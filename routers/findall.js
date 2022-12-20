const express = require('express');
const router = express.Router();
const findController = require('../controllers/findController');

router.get('/find', findController.findall);

module.exports  = router;