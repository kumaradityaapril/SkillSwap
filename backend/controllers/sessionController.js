const Session = require('../models/sessionModel');
const User = require('../models/userModel');
const Skill = require('../models/skillModel');
const sendEmail = require('../utils/sendEmail'); // Import sendEmail utility

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
    console.log('getMySessions: req.user:', req.user);
    console.log('getMySessions: User ID:', req.user.id);
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

    console.log('getMySessions: Found sessions:', sessions);

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error in getMySessions:', error);
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

    // Check if skill exists and populate the owner field
    const skill = await Skill.findById(skillId).populate('owner');
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if mentor exists and populate the email field for sending email
    const mentor = await User.findById(mentorId).select('+email');
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    console.log('Skill owner ID:', skill.owner._id.toString());
    console.log('Mentor ID from request body:', mentorId);

    // Check if mentor is the owner of the skill
    if (skill.owner._id.toString() !== mentorId) {
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
    const session = new Session({
      skill: skillId,
      learner: req.user.id,
      mentor: mentorId,
      date,
      startTime,
      endTime,
      notes,
      status: 'pending'
    });

    await session.save();
    console.log('Session saved successfully:', session);

    // Send email notification to the mentor
    try {
      await sendEmail({
        to: mentor.email,
        subject: 'New Session Request Received',
        text: `You have a new session request for ${skill.title} on ${date} at ${startTime} from ${req.user.name || 'a learner'}. Please log in to your SkillSwap account to review and respond.`,
        html: `<p>You have a new session request for <strong>${skill.title}</strong> on <strong>${date}</strong> at <strong>${startTime}</strong> from ${req.user.name || 'a learner'}.</p><p>Please log in to your SkillSwap account to review and respond.</p>`,
      });
      console.log('Email notification sent to mentor');
    } catch (emailError) {
      console.error('Error sending email notification to mentor:', emailError);
    }

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
    
    // Find session and populate participants with email
    let session = await Session.findById(req.params.id)
      .populate('learner', 'name email avatar')
      .populate('mentor', 'name email avatar');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if user is authorized to update this session
    if (
      session.learner._id.toString() !== req.user.id &&
      session.mentor._id.toString() !== req.user.id &&
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
        session.mentor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentor can accept, reject or complete sessions'
      });
    }
    
    // Only learner can cancel if pending, both can cancel if accepted
    if (status === 'cancelled') {
      if (session.status === 'pending' && session.learner._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Only the learner can cancel a pending session request'
        });
      }
    }
    
    // Update session
    const oldStatus = session.status; // Store old status before updating
    const updateData = {};
    if (status) updateData.status = status;
    if (meetingLink) updateData.meetingLink = meetingLink;
    
    session = await Session.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('learner', 'name email avatar')
    .populate('mentor', 'name email avatar');
    
    // Send email notification based on status update
    if (status && status !== oldStatus) {
      const skillTitle = session.skill?.title || 'a skill';
      const sessionDate = session.date ? new Date(session.date).toLocaleDateString() : 'N/A';
      const sessionTime = session.startTime || 'N/A';
      const mentorName = session.mentor?.name || 'the mentor';
      const learnerName = session.learner?.name || 'The learner';

      let recipientEmail = null;
      let emailSubject = '';
      let emailText = '';
      let emailHtml = '';

      if (status === 'accepted') {
        recipientEmail = session.learner.email;
        emailSubject = 'Session Request Approved';
        emailText = `Your session request for ${skillTitle} on ${sessionDate} at ${sessionTime} has been approved by ${mentorName}. Log in to see details: [Link to session details]`;
        emailHtml = `<p>Your session request for <strong>${skillTitle}</strong> on <strong>${sessionDate}</strong> at <strong>${sessionTime}</strong> has been approved by ${mentorName}.</p><p>Log in to your SkillSwap account to see details.</p>`;

      } else if (status === 'rejected') {
        recipientEmail = session.learner.email;
        emailSubject = 'Session Request Rejected';
        emailText = `Your session request for ${skillTitle} on ${sessionDate} at ${sessionTime} has been rejected by ${mentorName}. Log in for more info: [Link]`;
        emailHtml = `<p>Your session request for <strong>${skillTitle}</strong> on <strong>${sessionDate}</strong> at <strong>${sessionTime}</strong> has been rejected by ${mentorName}.</p><p>Log in to your SkillSwap account for more information.</p>`;

      } else if (status === 'cancelled') {
        if (req.user.id === session.learner._id.toString()) {
          recipientEmail = session.mentor.email;
          emailSubject = 'Session Cancelled';
          emailText = `${learnerName} has cancelled the session for ${skillTitle} on ${sessionDate} at ${sessionTime}. Log in for details: [Link]`;
          emailHtml = `<p>${learnerName} has cancelled the session for <strong>${skillTitle}</strong> on <strong>${sessionDate}</strong> at <strong>${sessionTime}</strong>.</p><p>Log in to your SkillSwap account for details.</p>`;
        } else {
          recipientEmail = session.learner.email;
          emailSubject = 'Session Cancelled';
          emailText = `${mentorName} has cancelled the session for ${skillTitle} on ${sessionDate} at ${sessionTime}. Log in for details: [Link]`;
          emailHtml = `<p>${mentorName} has cancelled the session for <strong>${skillTitle}</strong> on <strong>${sessionDate}</strong> at <strong>${sessionTime}</strong>.</p><p>Log in to your SkillSwap account for details.</p>`;
        }
      }

      if (recipientEmail && emailSubject && (emailText || emailHtml)) {
        try {
          await sendEmail({
            to: recipientEmail,
            subject: emailSubject,
            text: emailText,
            html: emailHtml,
          });
          console.log(`Email notification sent for ${status} status update`);
        } catch (emailError) {
          console.error(`Error sending email notification for ${status}:`, emailError);
        }
      }
    }

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

// Get available time slots for a mentor on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { mentorId, date: dateString, skillId } = req.query;
    
    // Create date range for the selected day
    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all sessions for the mentor within the specified date range
    const sessions = await Session.find({
      mentor: mentorId,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ['pending', 'approved'] }
    });

    // Get mentor's working hours (you might want to store this in the User model)
    const mentor = await User.findById(mentorId);
    const workingHours = mentor.workingHours || {
      start: '09:00',
      end: '18:00'
    };

    // Generate all possible time slots
    const allSlots = [];
    let currentTime = new Date(`2000-01-01T${workingHours.start}`);
    const endTime = new Date(`2000-01-01T${workingHours.end}`);

    while (currentTime < endTime) {
      allSlots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    // Filter out booked slots
    const bookedSlots = sessions.map(session => session.time);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(500).json({ message: 'Error getting available slots' });
  }
};

// Create a new session request
exports.createSessionRequest = async (req, res) => {
  try {
    const { skillId, mentorId, date, time } = req.body;

    // Check if the slot is still available
    const existingSession = await Session.findOne({
      mentor: mentorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'This time slot is no longer available' });
    }

    const session = new Session({
      skill: skillId,
      mentor: mentorId,
      learner: req.user.id,
      date: new Date(date),
      time,
      status: 'pending'
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session request:', error);
    res.status(500).json({ message: 'Error creating session request' });
  }
};

// Get session requests for a mentor or learner
exports.getSessionRequests = async (req, res) => {
  try {
    const { skillId: querySkillId, mentorId: queryMentorId } = req.query;
    const user = req.user;

    let query = {};
    if (user.role === 'mentor') {
      query.mentor = user.id;
    } else {
      query.learner = user.id;
    }

    if (querySkillId) query.skill = querySkillId;
    if (queryMentorId) query.mentor = queryMentorId;

    const sessions = await Session.find(query)
      .populate('skill', 'title')
      .populate('mentor', 'name')
      .populate('learner', 'name')
      .sort({ date: 1, time: 1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error getting session requests:', error);
    res.status(500).json({ message: 'Error getting session requests' });
  }
};

// Respond to a session request (approve/reject)
exports.respondToSessionRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this session' });
    }

    session.status = status;
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Error responding to session request:', error);
    res.status(500).json({ message: 'Error responding to session request' });
  }
};