const express = require('express');
const router = express.Router();
const { createCouple } = require('../controllers/coupleController');

router.post('/couples', createCouple);

module.exports = router;


