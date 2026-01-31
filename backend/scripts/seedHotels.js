/**
 * Seed Hotels Script (REALISTIC DATA)
 * Usage: node scripts/seedHotels.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('../src/models/Hotel');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGODB_URI;

const cityHotels = {
  Bangalore: [
    'Taj MG Road',
    'The Oberoi Bengaluru',
    'ITC Gardenia',
    'The Leela Palace',
    'Radisson Blu Atria',
  ],
  Delhi: [
    'The Imperial',
    'Taj Palace',
    'Le Meridien',
    'ITC Maurya',
    'The Lodhi',
  ],
  Mumbai: [
    'The Taj Mahal Palace',
    'Trident Nariman Point',
    'The Oberoi Mumbai',
    'ITC Maratha',
    'St. Regis Mumbai',
  ],
  Chennai: [
    'ITC Grand Chola',
    'The Leela Palace Chennai',
    'Taj Coromandel',
    'Radisson Blu GRT',
    'Hyatt Regency Chennai',
  ],
  Hyderabad: [
    'Taj Falaknuma Palace',
    'ITC Kohenur',
    'The Park Hyderabad',
    'Novotel HICC',
    'Trident Hyderabad',
  ],
};

const nearbyTemplates = {
  Bangalore: {
    restaurants: ['Meghana Foods', 'Empire', 'CTR'],
    transport: ['Metro Station', 'Bus Stop'],
    places: ['Cubbon Park', 'MG Road'],
  },
  Delhi: {
    restaurants: ['Karim’s', 'Bukhara', 'Indian Accent'],
    transport: ['Metro Station', 'Bus Stop'],
    places: ['India Gate', 'Connaught Place'],
  },
  Mumbai: {
    restaurants: ['Trishna', 'Leopold Cafe', 'Britannia'],
    transport: ['Local Train', 'Metro'],
    places: ['Marine Drive', 'Gateway of India'],
  },
  Chennai: {
    restaurants: ['Murugan Idli Shop', 'Annalakshmi'],
    transport: ['Metro Station', 'Bus Stop'],
    places: ['Marina Beach', 'Kapaleeshwarar Temple'],
  },
  Hyderabad: {
    restaurants: ['Paradise Biryani', 'Bawarchi'],
    transport: ['Metro Station', 'Bus Stop'],
    places: ['Charminar', 'Hussain Sagar'],
  },
};

const amenitiesPool = [
  'WiFi',
  'Parking',
  'AC',
  'TV',
  'Restaurant',
  'Gym',
  'Pool',
  'Spa',
];

const randomAmenities = () =>
  amenitiesPool.sort(() => 0.5 - Math.random()).slice(0, 5);

async function seedHotels() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const owner = await User.findOne({
      role: { $in: ['local', 'admin'] },
    });

    if (!owner) {
      throw new Error('No local/admin user found');
    }

    console.log(`👤 Using owner: ${owner.email}`);

    console.log('🧹 Clearing existing hotels...');
    await Hotel.deleteMany({});
    console.log('✅ Old hotels removed');

    const hotels = [];

    Object.entries(cityHotels).forEach(([city, hotelNames]) => {
      hotelNames.forEach((name, index) => {
        hotels.push({
          name,
          description: `A well-known premium hotel located in ${city}, offering comfortable stays and excellent service.`,
          city,
          pricePerNightMin: 2500 + index * 800,
          pricePerNightMax: 5000 + index * 1200,
          amenities: randomAmenities(),
          nearby: nearbyTemplates[city],
          owner: owner._id,
          rating: Math.floor(Math.random() * 2) + 4, // 4–5 stars
          reviewCount: Math.floor(Math.random() * 120) + 20,
          isActive: true,
        });
      });
    });

    console.log('🏨 Inserting hotels...');
    await Hotel.insertMany(hotels);

    console.log(`🎉 Seeded ${hotels.length} realistic hotels`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedHotels();
