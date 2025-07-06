const express = require('express');
const router = express.Router();
const { registerUser, confirmPartner, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/register/confirm', confirmPartner);
router.post('/login', loginUser);



module.exports = router;
