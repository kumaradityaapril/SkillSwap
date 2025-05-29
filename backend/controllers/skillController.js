const Skill = require('../models/skillModel');
const User = require('../models/userModel');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate('owner', 'name');

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Public
exports.getSkillById = async (req, res) => {
  try {
    // Populate the 'owner' field and select the 'name'
    const skill = await Skill.findById(req.params.id).populate('owner', 'name');

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Mentor, Admin, Both roles)
exports.createSkill = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.owner = req.user.id;

    // Get mentor's name
    const mentor = await User.findById(req.user.id);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Create the skill with form data and image
    const skill = await Skill.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      owner: req.user.id,
      image: req.file ? req.file.filename : 'default-skill.jpg'
    });

    // Increment mentor's post count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { postsCount: 1 }
    });

    // Add mentor's name to the response
    const populatedSkill = await Skill.findById(skill._id).populate('owner', 'name');

    res.status(201).json({
      success: true,
      data: populatedSkill
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating skill'
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Skill owner or Admin)
exports.updateSkill = async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Make sure user is skill owner or admin
    if (skill.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill'
      });
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Skill owner or Admin)
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Make sure user is skill owner or admin
    if (skill.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill'
      });
    }

    await skill.remove();

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

// @desc    Get skills by mentor
// @route   GET /api/skills/mentor/:mentorId
// @access  Private
exports.getSkillsByMentor = async (req, res) => {
  try {
    const skills = await Skill.find({ owner: req.params.mentorId }).populate('owner', 'name');
    
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
exports.getSkillsByCategory = async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category }).populate('owner', 'name');
    
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get skills by level
// @route   GET /api/skills/level/:level
// @access  Public
exports.getSkillsByLevel = async (req, res) => {
  try {
    const skills = await Skill.find({ level: req.params.level }).populate('owner', 'name');
    
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search skills
// @route   GET /api/skills/search
// @access  Public
exports.searchSkills = async (req, res) => {
  try {
    const { query } = req.query;
    
    const skills = await Skill.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).populate('owner', 'name');
    
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};