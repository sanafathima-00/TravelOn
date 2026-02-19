require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');
const FoodItem = require('../src/models/FoodItem');
const LocalPost = require('../src/models/LocalPost');
const BangalorePlace = require('../src/models/BangalorePlace');

const CITIES = [
  { name: 'Bangalore', lng: 77.5946, lat: 12.9716 },
  { name: 'Mumbai', lng: 72.8777, lat: 19.0760 },
  { name: 'Hyderabad', lng: 78.4867, lat: 17.3850 },
  { name: 'Delhi', lng: 77.2090, lat: 28.6139 },
  { name: 'Chennai', lng: 80.2707, lat: 13.0827 }
];

const HOTELS_BY_CITY = {
  Bangalore: [
    'ITC Gardenia',
    'The Leela Palace',
    'Radisson Blu Atria',
    'Oberoi',
    'Taj MG'
  ],
  Mumbai: [
    'ITC Maratha',
    'Taj Palace Mumbai',
    'The Oberoi',
    'The St. Regis',
    'Trident Nariman Point'
  ],
  Hyderabad: [
    'ITC Kohenur',
    'Novotel Hyderabad',
    'Park Hyatt Hyderabad',
    'Taj Falaknuma Palace',
    'Trident Hyderabad'
  ],
  Delhi: [
    'ITC Maurya',
    'Le Meridien',
    'Lodhi',
    'Taj Palace',
    'The Imperial'
  ],
  Chennai: [
    'Hyatt Regency',
    'ITC Grand Chola',
    'Leela Chennai',
    'Radisson Blu GRT',
    'Taj Coromandel'
  ]
};

function randomOffset() {
  return (Math.random() - 0.5) * 0.02;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create / Get seed users
  let adminUser = await User.findOne({ email: 'admin@travelon.in' });
  let localUser;

  if (!adminUser) {
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@travelon.in',
      password: 'admin123',
      role: 'admin'
    });

    localUser = await User.create({
      firstName: 'Local',
      lastName: 'Guide',
      email: 'local@travelon.in',
      password: 'local123',
      role: 'local'
    });

    console.log('Seed users created');
  } else {
    localUser = await User.findOne({ role: 'local' }) || adminUser;
  }

  // 🔥 CLEAR DATA
  await Hotel.deleteMany({});
  await Restaurant.deleteMany({});
  await FoodItem.deleteMany({});
  await LocalPost.deleteMany({});
  await BangalorePlace.deleteMany({});
  console.log('All previous seed data cleared');

  // ===============================
  // SEED HOTELS (ONLY REQUIRED)
  // ===============================
  for (const city of CITIES) {
    const hotelNames = HOTELS_BY_CITY[city.name] || [];

    for (const name of hotelNames) {
      const lng = city.lng + randomOffset();
      const lat = city.lat + randomOffset();

      await Hotel.create({
        name,
        description: `${name} is a premium five-star hotel in ${city.name}.`,
        city: city.name,
        address: `${city.name}`,
        location: { type: 'Point', coordinates: [lng, lat] },
        pricePerNightMin: 12000,
        pricePerNightMax: 45000,
        amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', '24/7 Reception'],
        images: [],
        owner: adminUser._id,
        rating: 0,
        reviewCount: 0,
        isActive: true
      });
    }

    console.log(`Seeded ${hotelNames.length} hotels in ${city.name}`);
  }

  // ===============================
  // SEED LOCAL POSTS (Fixed engagement)
  // ===============================
  await LocalPost.create({
    userId: localUser._id,
    city: 'Bangalore',
    postType: 'Tip',
    title: 'Best time to visit Cubbon Park',
    content:
      'Visit Cubbon Park before 8 AM for peaceful greenery and fewer crowds. Weekends are very busy.',
    tags: ['parks'],
    engagement: {
      upvotes: 10,
      downvotes: 1,
      voters: [],
      comments: []
    },
    isApproved: true,
    isHidden: false
  });

  console.log('Local posts seeded');

  // ===============================
  // SEED BANGALORE STRUCTURED PAGE
  // ===============================

  const bangalorePlaces = [
    // Worship
    ['Iskcon Temple', 'Rajajinagar', 'worship'],
    ['St. Mary\'s Basilica Church', 'Shivajinagar', 'worship'],
    ['Masjid-E-Bilal', 'Jayanagar 9th Block', 'worship'],
    ['Gurudwara Sri Guru Singh Sabha', 'Halasuru', 'worship'],
    ['Sri Dharmanath Shwetambar Jain Temple', 'Jayanagar 4th Block', 'worship'],
    ['Buddha Vihar', 'Cox Town', 'worship'],

    // Eateries
    ['Brahmin Tiffins & Coffee', 'Jayanagar 4th Block', 'eatery'],
    ['New Shanthi Upahara', 'Jayanagar 4th T Block', 'eatery'],
    ['Halli Jonne Biriyani', 'Jayanagar 4th T Block', 'eatery'],
    ['Basaveshwar Khanavali', 'Jayanagar 3rd Block', 'eatery'],
    ['Prabhu Tiffen Room', 'Basavanagudi', 'eatery'],
    ['The Taj Hotel', 'City Market', 'eatery'],
    ['VV Puram Food Street', 'Vishweshwarapura', 'eatery'],

    // Interest
    ['Visvesvaraya Industrial & Technological Museum', 'Kasturba Road', 'interest'],
    ['Vidhana Soudha', 'Dr. Ambedkar Road', 'interest'],
    ['Cubbon Park', 'Ambedkar Veedhi', 'interest'],

    // Shopping
    ['Jayanagar Shopping Complex', 'Jayanagar 4th Block', 'shopping'],
    ['Commercial Street', 'Shivajinagar', 'shopping'],
    ['MG Road', 'MG Road', 'shopping']
  ];

  for (const [name, location, category] of bangalorePlaces) {
    await BangalorePlace.create({
      name,
      category,
      location,
      city: 'Bangalore',
      reviews: [],
      averageRating: 0,
      reviewCount: 0
    });
  }

  console.log('Bangalore structured places seeded');

  console.log('Seed completed successfully.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
