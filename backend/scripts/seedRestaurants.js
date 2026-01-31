/**
 * Seed Restaurants Script (MVP)
 * Usage: node scripts/seedRestaurants.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('../src/models/Restaurant');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGODB_URI;

// ===============================
// HELPERS
// ===============================
function pickRandom(arr, count) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

// ===============================
// REAL RESTAURANTS PER CITY
// ===============================
const cityRestaurants = {
  Bangalore: [
    { name: 'Meghana Foods', cuisines: ['South Indian'], priceRange: '₹₹' },
    { name: 'Empire Restaurant', cuisines: ['North Indian'], priceRange: '₹₹' },
    { name: 'CTR', cuisines: ['South Indian'], priceRange: '₹' },
    { name: 'Truffles', cuisines: ['Cafe', 'Continental'], priceRange: '₹₹₹' },
    { name: 'Nagarjuna', cuisines: ['Andhra'], priceRange: '₹₹' },
    { name: 'Byg Brewski', cuisines: ['Brewery'], priceRange: '₹₹₹' },
  ],

  Delhi: [
    { name: 'Karim’s', cuisines: ['Mughlai'], priceRange: '₹₹' },
    { name: 'Bukhara', cuisines: ['North Indian'], priceRange: '₹₹₹' },
    { name: 'Indian Accent', cuisines: ['Modern Indian'], priceRange: '₹₹₹' },
    { name: 'Saravana Bhavan', cuisines: ['South Indian'], priceRange: '₹' },
    { name: 'Gulati', cuisines: ['Punjabi'], priceRange: '₹₹' },
    { name: 'Haldiram’s', cuisines: ['Street Food'], priceRange: '₹' },
  ],

  Mumbai: [
    { name: 'Trishna', cuisines: ['Seafood'], priceRange: '₹₹₹' },
    { name: 'Leopold Cafe', cuisines: ['Cafe'], priceRange: '₹₹' },
    { name: 'Britannia', cuisines: ['Parsi'], priceRange: '₹₹' },
    { name: 'Social', cuisines: ['Fusion'], priceRange: '₹₹' },
    { name: 'Bademiya', cuisines: ['Street Food'], priceRange: '₹' },
    { name: 'Pizza By The Bay', cuisines: ['Italian'], priceRange: '₹₹₹' },
  ],

  Chennai: [
    { name: 'Murugan Idli Shop', cuisines: ['South Indian'], priceRange: '₹' },
    { name: 'Annalakshmi', cuisines: ['Vegetarian'], priceRange: '₹₹' },
    { name: 'The Flying Elephant', cuisines: ['Multi-Cuisine'], priceRange: '₹₹₹' },
    { name: 'Dakshin', cuisines: ['South Indian'], priceRange: '₹₹₹' },
    { name: 'Pind', cuisines: ['Punjabi'], priceRange: '₹₹' },
    { name: 'Coal Barbecues', cuisines: ['BBQ'], priceRange: '₹₹₹' },
  ],

  Hyderabad: [
    { name: 'Paradise Biryani', cuisines: ['Biryani'], priceRange: '₹₹' },
    { name: 'Bawarchi', cuisines: ['Biryani'], priceRange: '₹₹' },
    { name: 'Shah Ghouse', cuisines: ['Mughlai'], priceRange: '₹₹' },
    { name: 'Ohri’s Tansen', cuisines: ['North Indian'], priceRange: '₹₹₹' },
    { name: 'Barbeque Nation', cuisines: ['BBQ'], priceRange: '₹₹₹' },
    { name: 'Chutneys', cuisines: ['South Indian'], priceRange: '₹' },
  ],
};

// ===============================
// NEARBY PLACES + TRANSPORT POOLS
// ===============================
const nearbyTemplates = {
  Bangalore: {
    places: [
      'Church Street',
      'Cubbon Park',
      'Lalbagh Botanical Garden',
      'Indiranagar 100 ft Road',
      'Commercial Street',
    ],
    transport: [
      'MG Road Metro',
      'Indiranagar Metro',
      'BMTC Bus Stop',
    ],
  },

  Delhi: {
    places: [
      'India Gate',
      'Connaught Place',
      'Lodhi Garden',
      'Khan Market',
      'Janpath Market',
    ],
    transport: [
      'Rajiv Chowk Metro',
      'Central Secretariat Metro',
      'DTC Bus Stop',
    ],
  },

  Mumbai: {
    places: [
      'Marine Drive',
      'Colaba Causeway',
      'Gateway of India',
      'Bandra Bandstand',
      'Juhu Beach',
    ],
    transport: [
      'Churchgate Station',
      'Bandra Station',
      'BEST Bus Stop',
    ],
  },

  Chennai: {
    places: [
      'Marina Beach',
      'Besant Nagar Beach',
      'Kapaleeshwarar Temple',
      'Phoenix Marketcity',
      'Elliot’s Beach',
    ],
    transport: [
      'Guindy Metro',
      'Central Metro',
      'MTC Bus Stop',
    ],
  },

  Hyderabad: {
    places: [
      'Charminar',
      'Hussain Sagar Lake',
      'Necklace Road',
      'Golconda Fort',
      'Inorbit Mall',
    ],
    transport: [
      'Ameerpet Metro',
      'Raidurg Metro',
      'TSRTC Bus Stop',
    ],
  },
};

// ===============================
// SAMPLE MENU
// ===============================
const sampleMenu = [
  { name: 'Paneer Butter Masala', category: 'Main', price: 280 },
  { name: 'Chicken Biryani', category: 'Main', price: 320 },
  { name: 'Masala Dosa', category: 'Main', price: 120 },
  { name: 'Butter Naan', category: 'Bread', price: 60 },
  { name: 'Gulab Jamun', category: 'Dessert', price: 90 },
  { name: 'Veg Manchurian', category: 'Starter', price: 180 },
];

// ===============================
// SEED FUNCTION
// ===============================
async function seedRestaurants() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const owner = await User.findOne({ role: { $in: ['local', 'admin'] } });
    if (!owner) throw new Error('No local/admin user found');

    console.log(`👤 Using owner: ${owner.email}`);

    console.log('🧹 Clearing existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('✅ Old restaurants removed');

    const restaurants = [];

    Object.entries(cityRestaurants).forEach(([city, list]) => {
      list.forEach((item) => {
        restaurants.push({
          name: item.name,
          description: `Popular ${item.cuisines.join(', ')} restaurant in ${city}.`,
          city,
          cuisines: item.cuisines,
          priceRange: item.priceRange,
          menu: sampleMenu,
          nearby: {
            places: pickRandom(nearbyTemplates[city].places, 2),
            transport: pickRandom(nearbyTemplates[city].transport, 1),
          },
          owner: owner._id,
          rating: Math.floor(Math.random() * 2) + 4,
          reviewCount: Math.floor(Math.random() * 100) + 20,
          isActive: true,
        });
      });
    });

    console.log('🍽️ Inserting restaurants...');
    await Restaurant.insertMany(restaurants);

    console.log(`🎉 Successfully seeded ${restaurants.length} restaurants`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedRestaurants();
