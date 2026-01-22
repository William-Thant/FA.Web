const carModel = require('../models/carModel');

function buildNavItems() {
  return [
    { label: 'Cars', href: '/cars' },
    { label: 'Loan', href: '#loan' },
    { label: 'Sell', href: '#sell' },
    { label: 'More', href: '#more' }
  ];
}

exports.showWelcome = function(req, res) {
  // If user is already logged in, redirect to home
  if (req.user) {
    return res.redirect('/home');
  }
  res.render('welcome');
};

exports.renderHome = async function(req, res, next) {
  try {
    // Redirect to welcome if not logged in
    if (!req.user) {
      return res.redirect('/');
    }

    const search = req.query.search || '';
    const cars = await carModel.getAvailable(search);

    res.render('index', {
      title: 'Car Marketplace',
      search,
      navItems: buildNavItems(),
      cars
    });
  } catch (err) {
    next(err);
  }
};

exports.listCars = async function(req, res, next) {
  try {
    const search = req.query.search || '';
    const cars = await carModel.getAvailable(search);
    res.render('cars', {
      title: 'Browse Cars',
      search,
      navItems: buildNavItems(),
      cars
    });
  } catch (err) {
    next(err);
  }
};

exports.adminCars = async function(req, res, next) {
  try {
    const cars = await carModel.getAll();
    res.render('admin/cars', {
      title: 'Admin - Cars',
      cars,
      navItems: buildNavItems()
    });
  } catch (err) {
    next(err);
  }
};

exports.createCar = async function(req, res, next) {
  try {
    const { Model, Brand, Price, DealerID } = req.body;
    await carModel.addCar({
      Model,
      Brand,
      Price: Number(Price) || 0,
      DealerID: Number(DealerID) || 1
    });
    res.redirect('/admin/cars');
  } catch (err) {
    next(err);
  }
};

exports.updateCar = async function(req, res, next) {
  try {
    const { Model, Brand, Price } = req.body;
    const CarID = parseInt(req.params.id, 10);
    await carModel.updateCar(CarID, {
      Model,
      Brand,
      Price: Number(Price) || 0
    });
    res.redirect('/admin/cars');
  } catch (err) {
    next(err);
  }
};

exports.deleteCar = async function(req, res, next) {
  try {
    const CarID = parseInt(req.params.id, 10);
    await carModel.deleteCar(CarID);
    res.redirect('/admin/cars');
  } catch (err) {
    next(err);
  }
};

exports.toggleAvailability = async function(req, res, next) {
  try {
    const carId = parseInt(req.params.id, 10);
    await carModel.toggleAvailability(carId);
    res.redirect('/admin/cars');
  } catch (err) {
    next(err);
  }
};

exports.deleteCar = async function(req, res, next) {
  try {
    const carId = parseInt(req.params.id, 10);
    await carModel.deleteCar(carId);
    res.redirect('/admin/cars');
  } catch (err) {
    next(err);
  }
};
