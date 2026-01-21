var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController');
var { requireAdmin } = require('../middleware/auth');

router.get('/cars', requireAdmin, carController.adminCars);
router.post('/cars', requireAdmin, carController.createCar);
router.post('/cars/:id/update', requireAdmin, carController.updateCar);
router.post('/cars/:id/delete', requireAdmin, carController.deleteCar);

module.exports = router;
