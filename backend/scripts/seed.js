require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');
const LocalPost = require('../src/models/LocalPost');
const FoodItem = require('../src/models/FoodItem');

/* ================================
   DATA MATCHES manifest.json
================================ */

const DATA = {
  Bangalore: {
    hotels: [
      'ITC Gardenia',
      'Oberoi',
      'Radisson Blu Atria',
      'Taj MG',
      'The Leela Palace'
    ],
    restaurants: [
      'Empire Restaurant',
      'Meghana Foods'
    ],
    places: [
      'Cubbon Park',
      'MG Road'
    ],
    transport: ['Namma Metro Station']
  },

  Chennai: {
    hotels: [
      'Hyatt Regency',
      'ITC Grand Chola',
      'Leela Chennai',
      'Radisson Blu GRT',
      'Taj Coromandel'
    ],
    restaurants: [
      'Annalakshmi',
      'Murugan Idli Shop'
    ],
    places: [
      'Kapaleeshwarar Temple',
      'Marina Beach'
    ],
    transport: ['Chennai Metro']
  },

  Delhi: {
    hotels: [
      'ITC Maurya',
      'Le Meridien',
      'Lodhi',
      'Taj Palace',
      'The Imperial'
    ],
    restaurants: [
      'Bukhara',
      'Karims'
    ],
    places: [
      'India Gate',
      'Connaught Place'
    ],
    transport: ['Delhi Metro Station']
  },

  Hyderabad: {
    hotels: [
      'ITC Kohenur',
      'Novotel Hyderabad',
      'Park Hyatt Hyderabad',
      'Taj Falaknuma Palace',
      'Trident Hyderabad'
    ],
    restaurants: [
      'Bawarchi',
      'Paradise Biryani'
    ],
    places: [
      'Hussain Sagar Lake',
      'Charminar'
    ],
    transport: ['Hyderabad Metro']
  },

  Mumbai: {
    hotels: [
      'ITC Maratha',
      'Taj Palace Mumbai',
      'The Oberoi',
      'The St. Regis',
      'Trident Nariman Point'
    ],
    restaurants: [
      'Britannia Co',
      'Leopold Cafe Bar'
    ],
    places: [
      'Gateway of India',
      'Marine Drive'
    ],
    transport: ['Mumbai Local Train']
  }
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  /* ================================
     FULL WIPE (removes sample data)
  ================================== */

  await Hotel.deleteMany({});
  await Restaurant.deleteMany({});
  await LocalPost.deleteMany({});
  await FoodItem.deleteMany({});
  await User.deleteMany({});

  console.log('Database cleared');

  /* ================================
     ADMIN USER
  ================================== */

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@travelon.in',
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin user created');

  /* ================================
     HOTELS
  ================================== */

  for (const city in DATA) {
    for (const hotelName of DATA[city].hotels) {
      await Hotel.create({
        name: hotelName,
        description: `Premium stay in ${city}`,
        city: city,
        address: `${city} Central Area`,
        pricePerNightMin: 5000,
        pricePerNightMax: 25000,
        amenities: ['WiFi', 'AC', 'Restaurant'],
        nearby: {
          restaurants: DATA[city].restaurants,
          places: DATA[city].places,
          transport: DATA[city].transport
        },
        owner: admin._id,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 400),
        isActive: true
      });
    }
  }

  console.log('Hotels seeded');

  /* ================================
     RESTAURANTS
  ================================== */

  for (const city in DATA) {
    for (const restaurantName of DATA[city].restaurants) {
      await Restaurant.create({
        name: restaurantName,
        description: `Famous restaurant in ${city}`,
        city: city,
        cuisines: ['Indian'],
        priceRange: '₹₹',
        nearby: {
          places: DATA[city].places,
          transport: DATA[city].transport
        },
        owner: admin._id,
        rating: 3.8 + Math.random(),
        reviewCount: Math.floor(Math.random() * 250),
        isActive: true
      });
    }
  }

  console.log('Restaurants seeded');

  console.log('Seed completed successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
