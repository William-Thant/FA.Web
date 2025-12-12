const categories = ['New', 'Used', 'Electric', 'Hybrid'];

let nextId = 7;
const cars = [
  {
    id: 1,
    name: 'Tesla Model 3 Long Range',
    category: 'Electric',
    condition: 'New',
    pricePerDay: 129,
    type: 'Sedan',
    status: 'available',
    highlight: true
  },
  {
    id: 2,
    name: 'Toyota Corolla Altis',
    category: 'Used',
    condition: 'Used',
    pricePerDay: 49,
    type: 'Sedan',
    status: 'available'
  },
  {
    id: 3,
    name: 'Honda CR-V Hybrid',
    category: 'Hybrid',
    condition: 'New',
    pricePerDay: 79,
    type: 'SUV',
    status: 'available',
    highlight: true
  },
  {
    id: 4,
    name: 'BMW 4 Series Coupe',
    category: 'New',
    condition: 'New',
    pricePerDay: 139,
    type: 'Coupe',
    status: 'available'
  },
  {
    id: 5,
    name: 'Nissan Leaf',
    category: 'Electric',
    condition: 'Used',
    pricePerDay: 59,
    type: 'Hatchback',
    status: 'maintenance'
  },
  {
    id: 6,
    name: 'Jeep Wrangler Sahara',
    category: 'Used',
    condition: 'Used',
    pricePerDay: 99,
    type: 'SUV',
    status: 'rented',
    rentedBy: 'Chloe'
  }
];

function normalize(text) {
  return (text || '').toString().toLowerCase();
}

function getAll() {
  return cars;
}

function getCategories() {
  return categories;
}

function getAvailable(category, searchTerm) {
  const categoryFilter = normalize(category);
  const searchFilter = normalize(searchTerm);
  return cars.filter((car) => {
    const isAvailable = car.status === 'available';
    const matchCategory = !categoryFilter || normalize(car.category) === categoryFilter;
    const matchSearch = !searchFilter || normalize(car.name).includes(searchFilter) || normalize(car.type).includes(searchFilter);
    return isAvailable && matchCategory && matchSearch;
  });
}

function getHighlights() {
  return cars.filter((car) => car.highlight);
}

function getById(id) {
  return cars.find((c) => c.id === id);
}

function addCar(payload) {
  const car = {
    id: nextId++,
    name: payload.name || 'Untitled',
    category: payload.category || 'New',
    condition: payload.condition || 'New',
    pricePerDay: payload.pricePerDay || 0,
    type: payload.type || 'Sedan',
    status: 'available'
  };
  cars.push(car);
  return car;
}

function toggleAvailability(id) {
  const car = getById(id);
  if (!car) return null;
  car.status = car.status === 'available' ? 'maintenance' : 'available';
  if (car.status === 'available') {
    delete car.rentedBy;
  }
  return car;
}

function rentCar(id, renterName) {
  const car = getById(id);
  if (!car || car.status !== 'available') return null;
  car.status = 'rented';
  car.rentedBy = renterName;
  return car;
}

function deleteCar(id) {
  const index = cars.findIndex((c) => c.id === id);
  if (index >= 0) {
    cars.splice(index, 1);
  }
}

module.exports = {
  getAll,
  getAvailable,
  getCategories,
  getHighlights,
  addCar,
  toggleAvailability,
  rentCar,
  deleteCar
};
