const Session = require('../models/sessionModel');
const User = require('../models/userModel');
const Skill = require('../models/skillModel');

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private (Admin only)
exports.getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find()
      .populate('learner', 'name email avatar')
      .populate('mentor', 'name email avatar')
      .populate('skill', 'title category');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private (Session participants and Admin)
exports.getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('learner', 'name email avatar bio')
      .populate('mentor', 'name email avatar bio')
      .populate('skill', 'title description category');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is authorized to view this session
    if (
      session.learner._id.toString() !== req.user.id &&
      session.mentor._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this session'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my sessions (as learner or mentor)
// @route   GET /api/sessions/me
// @access  Private
exports.getMySessions = async (req, res, next) => {
  try {
    // Find sessions where user is either learner or mentor
    const sessions = await Session.find({
      $or: [
        { learner: req.user.id },
        { mentor: req.user.id }
      ]
    })
      .populate('learner', 'name email avatar')
      .populate('mentor', 'name email avatar')
      .populate('skill', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new session request
// @route   POST /api/sessions
// @access  Private (Learner role)
exports.createSession = async (req, res, next) => {
  try {
    const { skillId, mentorId, date, startTime, endTime, notes } = req.body;

    // Validate required fields
    if (!skillId || !mentorId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if mentor exists and is the owner of the skill
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    if (skill.user.toString() !== mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Selected mentor does not offer this skill'
      });
    }

    // Prevent booking a session with yourself
    if (req.user.id === mentorId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book a session with yourself'
      });
    }

    // Create session
    const session = await Session.create({
      skill: skillId,
      learner: req.user.id,
      mentor: mentorId,
      date,
      startTime,
      endTime,
      notes,
      status: 'pending'
    });

    // Populate session data for response
    const populatedSession = await Session.findById(session._id)
      .populate('learner', 'name email avatar')
      .populate('mentor', 'name email avatar')
      .populate('skill', 'title category');

    res.status(201).json({
      success: true,
      data: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:id
// @access  Private (Session participants)
exports.updateSessionStatus = async (req, res, next) => {
  try {
    const { status, meetingLink } = req.body;
    
    // Find session
    let session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if user is authorized to update this session
    if (
      session.learner.toString() !== req.user.id &&
      session.mentor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }
    
    // Validate status transitions
    const validStatusTransitions = {
      pending: ['accepted', 'rejected', 'cancelled'],
      accepted: ['completed', 'cancelled'],
      rejected: [],
      completed: [],
      cancelled: []
    };
    
    if (status && !validStatusTransitions[session.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${session.status} to ${status}`
      });
    }
    
    // Only mentor can accept/reject/complete
    if (['accepted', 'rejected', 'completed'].includes(status) && 
        session.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentor can accept, reject or complete sessions'
      });
    }
    
    // Only learner can cancel if pending, both can cancel if accepted
    if (status === 'cancelled') {
      if (session.status === 'pending' && session.learner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Only the learner can cancel a pending session request'
        });
      }
    }
    
    // Update session
    const updateData = {};
    if (status) updateData.status = status;
    if (meetingLink) updateData.meetingLink = meetingLink;
    
    session = await Session.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('learner', 'name email avatar')
      .populate('mentor', 'name email avatar')
      .populate('skill', 'title category');
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Admin only)
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    await session.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};