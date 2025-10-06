const express = require('express');
const router = express.Router();
const { getHome } = require('../controllers/homeController');

// Home route
router.get('/', getHome);

module.exports = router;