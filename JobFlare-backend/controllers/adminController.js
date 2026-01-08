import { validationResult } from 'express-validator';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Initialize default admin account
// @route   POST /api/admin/initialize
// @access  Public (should be protected in production)
export const initializeAdmin = async (req, res, next) => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists'
      });
    }

    // Create default admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@jobflare.ai',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      name: 'System Administrator',
      role: 'super_admin',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find admin with password field
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Verify password
    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const incompleteUsers = await User.countDocuments({ overallStatus: 'incomplete' });
    const pendingReview = await User.countDocuments({ overallStatus: 'pending_review' });
    const approvedUsers = await User.countDocuments({ overallStatus: 'approved' });
    const rejectedUsers = await User.countDocuments({ overallStatus: 'rejected' });

    // Step-wise statistics
    const step1Completed = await User.countDocuments({ 'verificationSteps.step1.completed': true });
    const step2Completed = await User.countDocuments({ 'verificationSteps.step2.completed': true });
    const step3Completed = await User.countDocuments({ 'verificationSteps.step3.completed': true });

    // Pending admin checks
    const step1Pending = await User.countDocuments({ 
      'verificationSteps.step1.completed': true,
      'verificationSteps.step1.adminChecked': false 
    });
    const step2Pending = await User.countDocuments({ 
      'verificationSteps.step2.completed': true,
      'verificationSteps.step2.adminChecked': false 
    });
    const step3Pending = await User.countDocuments({ 
      'verificationSteps.step3.completed': true,
      'verificationSteps.step3.adminChecked': false 
    });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          incompleteUsers,
          pendingReview,
          approvedUsers,
          rejectedUsers,
          recentRegistrations
        },
        verificationSteps: {
          step1: {
            completed: step1Completed,
            pendingAdminCheck: step1Pending
          },
          step2: {
            completed: step2Completed,
            pendingAdminCheck: step2Pending
          },
          step3: {
            completed: step3Completed,
            pendingAdminCheck: step3Pending
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private
export const getAllUsers = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = '-createdAt',
      step1Status,
      step2Status,
      step3Status
    } = req.query;

    const query = {};

    // Filter by overall status
    if (status) {
      query.overallStatus = status;
    }

    // Filter by step statuses
    if (step1Status) {
      query['verificationSteps.step1.adminStatus'] = step1Status;
    }
    if (step2Status) {
      query['verificationSteps.step2.adminStatus'] = step2Status;
    }
    if (step3Status) {
      query['verificationSteps.step3.adminStatus'] = step3Status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-__v')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/admin/users/search
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { profession: { $regex: q, $options: 'i' } }
      ]
    })
    .select('-__v')
    .limit(50);

    res.status(200).json({
      success: true,
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details
// @route   GET /api/admin/users/:userId
// @access  Private
export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check device hadRun status by user ID
// @route   POST /api/admin/users/:userId/check-device
// @access  Private
export const checkUserDevice = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log('Checking device for userId:', userId);

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', user.email, 'hadRun:', user.hadRun);

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        ip: user.deviceInfo?.ip,
        hadRun: user.hadRun || false
      }
    });
  } catch (error) {
    console.error('Error in checkUserDevice:', error);
    next(error);
  }
};

// @desc    Update hadRun status for a user
// @route   PUT /api/admin/users/:userId/hadrun
// @access  Private
export const updateHadRun = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { hadRun } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.hadRun = hadRun;
    await user.save();

    res.status(200).json({
      success: true,
      message: `hadRun status updated to ${hadRun}`,
      data: {
        userId: user._id,
        hadRun: user.hadRun
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user verification step status
// @route   PUT /api/admin/users/:userId/verification/:stepNumber
// @access  Private
export const updateUserVerification = async (req, res, next) => {
  try {
    const { userId, stepNumber } = req.params;
    const { adminChecked, adminStatus, adminNotes } = req.body;

    // Validate step number
    if (!['1', '2', '3'].includes(stepNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step number'
      });
    }

    // Validate admin status
    const validStatuses = ['pending', 'approved', 'rejected', 'needs_review'];
    if (adminStatus && !validStatuses.includes(adminStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin status'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update the verification step
    const stepKey = `step${stepNumber}`;
    
    if (adminChecked !== undefined) {
      user.verificationSteps[stepKey].adminChecked = adminChecked;
    }
    
    if (adminStatus) {
      user.verificationSteps[stepKey].adminStatus = adminStatus;
    }
    
    if (adminNotes !== undefined) {
      user.verificationSteps[stepKey].adminNotes = adminNotes;
    }

    // Update overall status
    user.updateOverallStatus();
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Verification step updated successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          verificationSteps: user.verificationSteps,
          overallStatus: user.overallStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
