import Enquiry from '../models/Enquiry.js';

export const submitEnquiry = async (req, res, next) => {
  try {
    const {
      enquiryId,
      customer,
      name,
      email,
      phone,
      subject,
      message,
      type = 'General',
      priority = 'Medium'
    } = req.body;

    const custObj = customer || {
      name: name || 'Website Visitor',
      email: email || '',
      phone: phone || ''
    };

    if (!custObj.name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    const uniqueEnquiryId = enquiryId || `ENQ-WEB-${Math.floor(100 + Math.random() * 900)}`;

    const newEnquiry = await Enquiry.create({
      enquiryId: uniqueEnquiryId,
      customer: custObj,
      subject: subject || 'Patient Enquiry',
      message,
      type,
      priority,
      status: 'New',
      isRead: false,
      replies: []
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully and recorded in MongoDB',
      data: newEnquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, isRead } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { enquiryId: req.params.id };

    const enquiry = await Enquiry.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const replyToEnquiry = async (req, res, next) => {
  try {
    const { message, sender = 'Dr. Bharathi (Admin)' } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { enquiryId: req.params.id };
    const enquiry = await Enquiry.findOne(query);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry.replies.push({
      sender,
      message,
      sentAt: new Date().toISOString()
    });
    enquiry.status = 'In Progress';
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Reply logged successfully in MongoDB',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};
