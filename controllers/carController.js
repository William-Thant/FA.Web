const carModel = require('../models/carModel');

function buildNavItems() {
  return [
    { label: 'New', href: '/?category=New' },
    { label: 'Used', href: '/?category=Used' },
    { label: 'Electric', href: '/?category=Electric' },
    { label: 'Hybrid', href: '/?category=Hybrid' },
    { label: 'Loan', href: '#loan' },
    { label: 'Rent', href: '/cars' },
    { label: 'Sell', href: '#sell' },
    { label: 'More', href: '#more' }
  ];
}

exports.renderHome = function(req, res) {
  const category = req.query.category || '';
  const search = req.query.search || '';
  const cars = carModel.getAvailable(category, search);
  res.render('index', {
    title: 'DriveWay Rentals',
    category,
    search,
    navItems: buildNavItems(),
    categories: carModel.getCategories(),
    cars,
    highlights: carModel.getHighlights()
  });
};

exports.listCars = function(req, res) {
  const category = req.query.category || '';
  const search = req.query.search || '';
  const cars = carModel.getAvailable(category, search);
  res.render('cars', {
    title: 'Browse Cars',
    category,
    search,
    navItems: buildNavItems(),
    categories: carModel.getCategories(),
    cars
  });
};

exports.rentCar = function(req, res) {
  const carId = parseInt(req.params.id, 10);
  const renterName = req.user?.name || 'Guest';
  const rented = carModel.rentCar(carId, renterName);
  if (!rented) {
    return res.status(400).render('error', { message: 'Car unavailable', error: { status: 400 } });
  }
  res.redirect('/?rented=' + carId);
};

exports.adminCars = function(req, res) {
  res.render('admin/cars', {
    title: 'Admin — Fleet',
    cars: carModel.getAll(),
    categories: carModel.getCategories(),
    navItems: buildNavItems()
  });
};

exports.createCar = function(req, res) {
  const { name, category, condition, pricePerDay, type } = req.body;
  carModel.addCar({
    name,
    category,
    condition,
    pricePerDay: Number(pricePerDay) || 0,
    type
  });
  res.redirect('/admin/cars');
};

exports.toggleAvailability = function(req, res) {
  const carId = parseInt(req.params.id, 10);
  carModel.toggleAvailability(carId);
  res.redirect('/admin/cars');
};

exports.deleteCar = function(req, res) {
  const carId = parseInt(req.params.id, 10);
  carModel.deleteCar(carId);
  res.redirect('/admin/cars');
};
