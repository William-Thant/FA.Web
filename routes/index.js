var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController');

router.get('/', carController.renderHome);

module.exports = router;
