var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController');
var { requireAuth } = require('../middleware/auth');

router.get('/', carController.listCars);
router.post('/:id/rent', requireAuth, carController.rentCar);

module.exports = router;
