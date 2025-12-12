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

exports.renderHome = async function(req, res, next) {
  try {
    const category = req.query.category || '';
    const search = req.query.search || '';
    const [cars, highlights] = await Promise.all([
      carModel.getAvailable(category, search),
      carModel.getHighlights()
    ]);

    res.render('index', {
      title: 'DriveWay Rentals',
      category,
      search,
      navItems: buildNavItems(),
      categories: carModel.getCategories(),
      cars,
      highlights
    });
  } catch (err) {
    next(err);
  }
};

exports.listCars = async function(req, res, next) {
  try {
    const category = req.query.category || '';
    const search = req.query.search || '';
    const cars = await carModel.getAvailable(category, search);
    res.render('cars', {
      title: 'Browse Cars',
      category,
      search,
      navItems: buildNavItems(),
      categories: carModel.getCategories(),
      cars
    });
  } catch (err) {
    next(err);
  }
};

exports.rentCar = async function(req, res, next) {
  try {
    const carId = parseInt(req.params.id, 10);
    const renterName = req.user?.name || 'Guest';
    const rented = await carModel.rentCar(carId, renterName);
    if (!rented) {
      return res.status(400).render('error', { message: 'Car unavailable', error: { status: 400 } });
    }
    res.redirect('/?rented=' + carId);
  } catch (err) {
    next(err);
  }
};

exports.adminCars = async function(req, res, next) {
  try {
    const cars = await carModel.getAll();
    res.render('admin/cars', {
      title: 'Admin - Fleet',
      cars,
      categories: carModel.getCategories(),
      navItems: buildNavItems()
    });
  } catch (err) {
    next(err);
  }
};

exports.createCar = async function(req, res, next) {
  try {
    const { name, category, condition, pricePerDay, type } = req.body;
    await carModel.addCar({
      name,
      category,
      condition,
      pricePerDay: Number(pricePerDay) || 0,
      type
    });
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
