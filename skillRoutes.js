const express = require('express');
const router = express.Router();

// Import controllers (placeholder for demonstration)
// In a real implementation, you would create these controller files
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

// Import authentication middleware
const { protect, authorize, isVerified } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllSkills);
router.get('/:id', getSkillById);

// Protected routes (authentication required)
// Only verified mentors and admins can create skills
router.post('/', protect, isVerified, authorize('mentor', 'admin', 'both'), createSkill);

// Only the mentor who created the skill or an admin can update/delete it
// Note: Additional logic would be needed in the controller to verify ownership
router.put('/:id', protect, isVerified, authorize('mentor', 'admin', 'both'), updateSkill);
router.delete('/:id', protect, isVerified, authorize('mentor', 'admin'), deleteSkill);

module.exports = router;