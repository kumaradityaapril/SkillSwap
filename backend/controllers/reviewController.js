const Review = require('../models/reviewModel');
const Session = require('../models/sessionModel');
const User = require('../models/userModel');
const Skill = require('../models/skillModel');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getAllReviews = async (req, res, next) => {
  try {
    // Only get public reviews
    const reviews = await Review.find({ isPublic: true })
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar')
      .populate('skill', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific skill
// @route   GET /api/reviews/skill/:skillId
// @access  Public
exports.getSkillReviews = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Get public reviews for this skill
    const reviews = await Review.find({ 
      skill: skillId,
      isPublic: true 
    })
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get public reviews where this user is the reviewee
    const reviews = await Review.find({ 
      reviewee: userId,
      isPublic: true 
    })
      .populate('reviewer', 'name avatar')
      .populate('skill', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my reviews (as reviewer or reviewee)
// @route   GET /api/reviews/me
// @access  Private
exports.getMyReviews = async (req, res, next) => {
  try {
    // Find reviews where user is either reviewer or reviewee
    const reviews = await Review.find({
      $or: [
        { reviewer: req.user.id },
        { reviewee: req.user.id }
      ]
    })
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar')
      .populate('skill', 'title category')
      .populate('session')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Session participants only)
exports.createReview = async (req, res, next) => {
  try {
    const { sessionId, rating, comment, isPublic = true } = req.body;

    // Validate required fields
    if (!sessionId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if session exists and is completed
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed sessions'
      });
    }

    // Check if user is a participant in the session
    if (
      session.learner.toString() !== req.user.id &&
      session.mentor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this session'
      });
    }

    // Determine reviewer and reviewee
    const isLearner = session.learner.toString() === req.user.id;
    const reviewer = req.user.id;
    const reviewee = isLearner ? session.mentor : session.learner;

    // Check if user has already reviewed this session
    const existingReview = await Review.findOne({
      session: sessionId,
      reviewer
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this session'
      });
    }

    // Create review
    const review = await Review.create({
      session: sessionId,
      skill: session.skill,
      reviewer,
      reviewee,
      rating,
      comment,
      isPublic
    });

    // Update session feedback status
    if (isLearner) {
      await Session.findByIdAndUpdate(sessionId, { learnerFeedback: true });
    } else {
      await Session.findByIdAndUpdate(sessionId, { mentorFeedback: true });
    }

    // Award experience points to reviewee
    if (rating >= 4) {
      const experiencePoints = rating === 5 ? 10 : 5;
      await User.findByIdAndUpdate(reviewee, {
        $inc: { experience: experiencePoints }
      });
    }

    // Populate review data for response
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar')
      .populate('skill', 'title category');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Review owner only)
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, comment, isPublic } = req.body;
    
    // Find review
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is authorized to update this review
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    // Update review
    const updateData = {};
    if (rating) updateData.rating = rating;
    if (comment) updateData.comment = comment;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar')
      .populate('skill', 'title category');
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin or review owner)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is authorized to delete this review
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await review.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};