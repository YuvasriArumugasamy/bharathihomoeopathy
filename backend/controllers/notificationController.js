import FcmToken from '../models/FcmToken.js';
import Notification from '../models/Notification.js';
import { admin } from '../config/firebase.js';

// @desc  Save or update FCM token from a browser/device
// @route POST /api/notifications/fcm-token
// @access Public
export const saveFcmToken = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    // Upsert — update lastSeen if token exists, else create new
    await FcmToken.findOneAndUpdate(
      { token },
      { 
        token, 
        email: email || null, 
        userId: req.user ? req.user._id : null,
        lastSeen: new Date() 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'FCM token saved' });
  } catch (error) {
    next(error);
  }
};

// @desc  Send push notification to a specific token or all tokens
// @route POST /api/notifications/send
// @access Private (admin)
export const sendNotification = async (req, res, next) => {
  try {
    const { title, body, token, data = {} } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'title and body are required' });
    }

    const messaging = admin?.messaging?.();
    if (!messaging) {
      // If server SDK not active, still save record so notifications list works
      await Notification.create({
        title,
        message: body,
        type: 'system',
        read: false,
        data
      });
      return res.status(200).json({ 
        success: true, 
        message: 'Notification saved (Firebase Admin SDK not initialized on server)' 
      });
    }

    let result;

    if (token) {
      // Send to single token
      result = await messaging.send({
        token,
        notification: { title, body },
        webpush: {
          notification: {
            icon: '/logo.png',
            badge: '/favicon.png',
          },
        },
        data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      });
    } else {
      // Broadcast to all saved tokens
      const tokens = await FcmToken.find({}).select('token');
      const tokenList = tokens.map((t) => t.token);

      if (tokenList.length === 0) {
        return res.status(200).json({ success: true, message: 'No tokens registered' });
      }

      const response = await messaging.sendEachForMulticast({
        tokens: tokenList,
        notification: { title, body },
        webpush: {
          notification: {
            icon: '/logo.png',
            badge: '/favicon.png',
          },
        },
        data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      });

      // Clean up invalid tokens
      const invalidTokens = [];
      response.responses.forEach((r, i) => {
        if (!r.success) invalidTokens.push(tokenList[i]);
      });
      if (invalidTokens.length > 0) {
        await FcmToken.deleteMany({ token: { $in: invalidTokens } });
      }

      result = { successCount: response.successCount, failureCount: response.failureCount };
    }

    // Save notification record to database
    await Notification.create({
      title,
      message: body,
      type: 'system',
      read: false,
      data
    });

    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications for admin
// @route   GET /api/notifications
// @access  Private (Admin)
export const getNotifications = async (req, res, next) => {
  try {
    const { read, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (read === 'true') query.read = true;
    else if (read === 'false') query.read = false;
    if (type) query.type = type;

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    res.json({ success: true, count: notifications.length, total, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private (Admin)
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: send booking/event notification (call this from other controllers)
 */
export const sendEventNotification = async (eventData) => {
  try {
    await Notification.create({
      title: eventData.title,
      message: eventData.message,
      type: eventData.type || 'system',
      read: false,
      link: eventData.link || null,
      data: eventData.data || {},
    });

    const messaging = admin?.messaging?.();
    if (!messaging) return;

    // Broadcast to all registered devices
    const tokens = await FcmToken.find({}).select('token');
    const tokenList = tokens.map((t) => t.token);

    if (tokenList.length === 0) return;

    const stringData = eventData.data 
      ? Object.fromEntries(Object.entries(eventData.data).map(([k, v]) => [k, String(v)]))
      : {};

    const response = await messaging.sendEachForMulticast({
      tokens: tokenList,
      notification: {
        title: eventData.title,
        body: eventData.message,
      },
      webpush: {
        notification: {
          icon: '/logo.png',
          badge: '/favicon.png',
        },
      },
      data: stringData,
    });

    // Clean up invalid/expired tokens
    const invalidTokens = [];
    response.responses.forEach((r, i) => {
      if (!r.success) invalidTokens.push(tokenList[i]);
    });
    if (invalidTokens.length > 0) {
      await FcmToken.deleteMany({ token: { $in: invalidTokens } });
    }

    console.log(`📲 Broadcasted push notification: ${eventData.title}`);
  } catch (err) {
    console.error('Push notification failed:', err.message);
  }
};
