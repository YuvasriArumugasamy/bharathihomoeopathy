import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { verifyGoogleToken } from '../config/googleOAuth.js';

export const register = async (req, res, next) => {
  try {
    const { isValid, errors } = validateRegister(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { isValid, errors } = validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account is blocked. Contact support.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          phone: req.user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth Login
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ 
        success: false, 
        message: 'Google credential is required' 
      });
    }

    // Verify Google token
    const verificationResult = await verifyGoogleToken(credential);

    if (!verificationResult.success) {
      return res.status(401).json({ 
        success: false, 
        message: verificationResult.message 
      });
    }

    const { googleId, email, name, profilePicture } = verificationResult.data;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        user.profilePicture = profilePicture;
        await user.save();
      }

      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({ 
          success: false, 
          message: 'Your account is blocked. Contact support.' 
        });
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        profilePicture,
        role: 'customer',
        phone: ''
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: user.isNew ? 'Account created successfully' : 'Logged in successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
