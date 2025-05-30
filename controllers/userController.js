const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Session = require('../models/sessionModel');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'both'
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // user is already available in req due to the protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      location: req.body.location,
      socialLinks: req.body.socialLinks
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get skills for the logged-in user
// @route   GET /api/users/me/skills
// @access  Private
exports.getUserSkills = async (req, res) => {
  // In a real application, you would fetch skills related to req.user.id
  // For now, send back empty data to resolve 404
  res.status(200).json({
    success: true,
    data: []
  });
};

// @desc    Get sessions for the logged-in user
// @route   GET /api/users/me/sessions
// @access  Private
exports.getUserSessions = async (req, res) => {
  try {
    console.log('getUserSessions: User ID:', req.user.id);
    // Find sessions where user is either learner or mentor
    const sessions = await Session.find({
      $or: [
        { learner: req.user.id },
        { mentor: req.user.id }
      ]
    })
      .populate('skill', 'title category')
      .populate('learner', 'name avatar')
      .populate('mentor', 'name avatar')
      .sort({ date: 1, startTime: 1 });

    console.log('getUserSessions: Found sessions:', sessions);

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get stats for the logged-in user
// @route   GET /api/users/me/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculate total hours spent in completed sessions
    const completedSessions = await Session.find({
      $or: [{ learner: userId }, { mentor: userId }],
      status: 'completed',
    });

    let totalDurationMs = 0;
    completedSessions.forEach(session => {
      if (session.startTime && session.endTime) {
        totalDurationMs += new Date(session.endTime) - new Date(session.startTime);
      }
    });

    const totalHours = (totalDurationMs / (1000 * 60 * 60)).toFixed(2);

    // Placeholder for Day Streak (requires more complex logic based on session dates)
    const dayStreak = 0; // Replace with actual calculation later if needed

    res.status(200).json({
      success: true,
      data: {
        hoursSpent: parseFloat(totalHours),
        dayStreak: dayStreak,
        // Add other stats here if needed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Bookmark a skill for the logged-in user
// @route   POST /api/users/me/bookmark
// @access  Private
exports.bookmarkSkill = async (req, res) => {
  console.log('Attempting to bookmark skill.'); // Temporary log
  try {
    const { skillId } = req.body;

    const user = await User.findById(req.user.id);

    // Check if skill is already bookmarked
    if (user.bookmarkedSkills.includes(skillId)) {
      return res.status(400).json({
        success: false,
        message: 'Skill already bookmarked'
      });
    }

    user.bookmarkedSkills.push(skillId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skill bookmarked successfully',
      data: user.bookmarkedSkills
    });
  } catch (error) {
    console.error('Error bookmarking skill:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove a bookmarked skill for the logged-in user
// @route   DELETE /api/users/me/bookmark/:skillId
// @access  Private
exports.removeBookmarkedSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.user.id);

    // Check if skill is bookmarked
    if (!user.bookmarkedSkills.includes(skillId)) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found in bookmarks'
      });
    }

    user.bookmarkedSkills = user.bookmarkedSkills.filter(
      (skill) => skill.toString() !== skillId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skill removed from bookmarks',
      data: user.bookmarkedSkills
    });
  } catch (error) {
    console.error('Error removing bookmarked skill:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};