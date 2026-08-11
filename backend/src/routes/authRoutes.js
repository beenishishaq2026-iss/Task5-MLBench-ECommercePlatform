const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    message: 'You are authenticated',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;