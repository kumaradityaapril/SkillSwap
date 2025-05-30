const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import controllers (placeholder for demonstration)
// In a real implementation, you would create these controller files
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByMentor,
  getSkillsByCategory,
  getSkillsByLevel,
  searchSkills
} = require('../controllers/skillController');

// Import authentication middleware
const { protect, authorize, isVerified } = require('../middleware/auth');

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Create the multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes (no authentication required)
router.get('/', getAllSkills);
router.get('/search', searchSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/level/:level', getSkillsByLevel);
router.get('/:id', getSkillById);

// Protected routes (authentication required)
// Only verified mentors and admins can create skills
router.post('/', protect, isVerified, authorize('mentor', 'admin', 'both'), upload.single('image'), createSkill);

// Only the mentor who created the skill or an admin can update/delete it
// Note: Additional logic would be needed in the controller to verify ownership
router.put('/:id', protect, authorize('mentor', 'admin', 'both'), updateSkill);
router.delete('/:id', protect, authorize('mentor', 'admin', 'both'), deleteSkill);

module.exports = router;