var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController');

router.get('/', carController.showWelcome);
router.get('/home', carController.renderHome);

module.exports = router;
