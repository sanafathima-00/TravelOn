require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');
const FoodItem = require('../src/models/FoodItem');
const LocalPost = require('../src/models/LocalPost');

const CITIES = [
  { name: 'Bangalore', lng: 77.5946, lat: 12.9716 },
  { name: 'Delhi', lng: 77.2090, lat: 28.6139 },
  { name: 'Mumbai', lng: 72.8777, lat: 19.0760 },
  { name: 'Chennai', lng: 80.2707, lat: 13.0827 },
  { name: 'Hyderabad', lng: 78.4867, lat: 17.3850 }
];

const HOTELS_BY_CITY = {
  Bangalore: [
    { name: 'Taj West End', desc: 'Heritage luxury hotel set in lush gardens.', address: 'Race Course Road', min: 18000, max: 45000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'ITC Gardenia', desc: 'Eco-friendly five-star with rooftop pool.', address: 'Residency Road', min: 12000, max: 28000, amenities: ['WiFi', 'AC', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Laundry', 'Breakfast'] },
    { name: 'The Leela Palace', desc: 'Palatial hotel with Cubbon Park views.', address: 'Old Airport Road', min: 22000, max: 55000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'Park Plaza', desc: 'Modern business hotel in MG Road area.', address: 'MG Road', min: 6500, max: 12000, amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'Fortune Park JP Celestial', desc: 'Comfortable stay near Manyata Tech Park.', address: 'Hebbal', min: 5500, max: 9500, amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Radisson Blu Atria', desc: 'Upscale hotel with event spaces.', address: 'Diamond District', min: 8500, max: 16000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Room Service', '24/7 Reception', 'Breakfast'] },
    { name: 'Lemon Tree Premier', desc: 'Vibrant hotel near Electronic City.', address: 'Electronic City', min: 5000, max: 9000, amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym', 'Breakfast'] },
    { name: 'Novotel Bengaluru', desc: 'Contemporary hotel with pool and dining.', address: 'Outer Ring Road', min: 7500, max: 14000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'The Ritz-Carlton', desc: 'Luxury hotel in the heart of the city.', address: 'MG Road', min: 25000, max: 60000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', '24/7 Reception', 'Travel Desk', 'Breakfast'] },
    { name: 'Treebo Trend Sapphire', desc: 'Budget-friendly stay near Indiranagar.', address: 'Indiranagar', min: 2200, max: 4500, amenities: ['WiFi', 'AC', '24/7 Reception'] }
  ],
  Delhi: [
    { name: 'The Imperial', desc: 'Colonial-era luxury on Janpath.', address: 'Janpath', min: 20000, max: 50000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'Taj Palace', desc: 'Iconic five-star in diplomatic enclave.', address: 'Sardar Patel Marg', min: 18000, max: 42000, amenities: ['WiFi', 'AC', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', 'Breakfast'] },
    { name: 'Leela Ambience', desc: 'Grand hotel near Connaught Place.', address: 'Connaught Place', min: 11000, max: 26000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Roseate House', desc: 'Boutique luxury near airport.', address: 'Aerocity', min: 14000, max: 32000, amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'Andaz Delhi', desc: 'Hip hotel in Aerocity.', address: 'Aerocity', min: 12000, max: 22000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'The Claridges', desc: 'Classic luxury in Lutyens Delhi.', address: 'Janpath', min: 15000, max: 35000, amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Room Service', 'Laundry', 'Breakfast'] },
    { name: 'Radisson Blu Marina', desc: 'Waterfront hotel in Connaught Place.', address: 'Connaught Place', min: 8000, max: 15000, amenities: ['WiFi', 'AC', 'Gym', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'Hotel Palace Heights', desc: 'Heritage-style stay in Karol Bagh.', address: 'Karol Bagh', min: 3500, max: 7000, amenities: ['WiFi', 'AC', 'Restaurant', '24/7 Reception'] },
    { name: 'Pullman Aerocity', desc: 'Business hotel near IGI Airport.', address: 'Aerocity', min: 9000, max: 18000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Ibis New Delhi', desc: 'Affordable comfort in Aerocity.', address: 'Aerocity', min: 4500, max: 8000, amenities: ['WiFi', 'AC', 'Restaurant', '24/7 Reception', 'Breakfast'] }
  ],
  Mumbai: [
    { name: 'Taj Palace Mumbai', desc: 'Legendary waterfront luxury.', address: 'Apollo Bunder', min: 22000, max: 65000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'The St. Regis', desc: 'Luxury in Lower Parel.', address: 'Lower Parel', min: 18000, max: 45000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Laundry', 'Breakfast'] },
    { name: 'Trident Nariman Point', desc: 'Sea-facing five-star.', address: 'Nariman Point', min: 14000, max: 32000, amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'ITC Grand Central', desc: 'Grand hotel in Parel.', address: 'Parel', min: 10000, max: 24000, amenities: ['WiFi', 'AC', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Breakfast'] },
    { name: 'The Oberoi', desc: 'Iconic luxury with harbour views.', address: 'Nariman Point', min: 25000, max: 60000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'Grand Hyatt Mumbai', desc: 'Contemporary luxury in Santacruz.', address: 'Santacruz East', min: 12000, max: 28000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Hilton Mumbai', desc: 'Business hotel in Andheri.', address: 'Andheri East', min: 8500, max: 16000, amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Gym', '24/7 Reception', 'Breakfast'] },
    { name: 'Fariyas Resort', desc: 'Peaceful stay near Lonavala.', address: 'Lonavala', min: 6000, max: 12000, amenities: ['WiFi', 'AC', 'Parking', 'Pool', 'Restaurant', 'Breakfast'] },
    { name: 'Sea Princess', desc: 'Beach-facing hotel in Juhu.', address: 'Juhu', min: 7000, max: 14000, amenities: ['WiFi', 'AC', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'Hotel Suba Palace', desc: 'Budget stay in Andheri.', address: 'Andheri West', min: 2500, max: 5000, amenities: ['WiFi', 'AC', '24/7 Reception'] }
  ],
  Chennai: [
    { name: 'Taj Coromandel', desc: 'Luxury in the heart of Chennai.', address: 'Nungambakkam', min: 16000, max: 40000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'ITC Grand Chola', desc: 'Palatial hotel in Guindy.', address: 'Guindy', min: 14000, max: 35000, amenities: ['WiFi', 'AC', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', 'Breakfast'] },
    { name: 'The Leela Palace', desc: 'Beach-facing luxury.', address: 'Mahabalipuram Road', min: 20000, max: 48000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'Park Hyatt Chennai', desc: 'Upscale stay in Guindy.', address: 'Guindy', min: 11000, max: 26000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Radisson Blu GRT', desc: 'Comfortable hotel in T Nagar.', address: 'T Nagar', min: 7500, max: 14000, amenities: ['WiFi', 'AC', 'Gym', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'The Raintree', desc: 'Eco-friendly hotel in Anna Salai.', address: 'Anna Salai', min: 6500, max: 12000, amenities: ['WiFi', 'AC', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Hyatt Regency', desc: 'Riverside luxury in Egmore.', address: 'Egmore', min: 9500, max: 20000, amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Gym', '24/7 Reception', 'Breakfast'] },
    { name: 'Fortune Park', desc: 'Business hotel in Guindy.', address: 'Guindy', min: 5000, max: 9000, amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Breakfast'] },
    { name: 'Ibis Chennai', desc: 'Budget-friendly in OMR.', address: 'OMR', min: 4000, max: 7000, amenities: ['WiFi', 'AC', 'Restaurant', '24/7 Reception'] },
    { name: 'Treebo Select', desc: 'Value stay near Central.', address: 'Park Town', min: 2800, max: 5500, amenities: ['WiFi', 'AC', '24/7 Reception'] }
  ],
  Hyderabad: [
    { name: 'Taj Falaknuma Palace', desc: 'Royal palace experience.', address: 'Falaknuma', min: 45000, max: 120000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', '24/7 Reception', 'Travel Desk', 'Breakfast'] },
    { name: 'Park Hyatt Hyderabad', desc: 'Luxury in Banjara Hills.', address: 'Banjara Hills', min: 15000, max: 38000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', '24/7 Reception', 'Breakfast'] },
    { name: 'ITC Kohenur', desc: 'Modern luxury in HITEC City.', address: 'HITEC City', min: 12000, max: 28000, amenities: ['WiFi', 'AC', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Novotel Hyderabad', desc: 'Contemporary hotel near airport.', address: 'Gachibowli', min: 7000, max: 14000, amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Gym', '24/7 Reception', 'Breakfast'] },
    { name: 'Radisson Blu', desc: 'Upscale stay in Banjara Hills.', address: 'Banjara Hills', min: 8500, max: 18000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Breakfast'] },
    { name: 'Lemon Tree Premier', desc: 'Vibrant hotel in HITEC City.', address: 'HITEC City', min: 5500, max: 10000, amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym', 'Breakfast'] },
    { name: 'Marriott Hyderabad', desc: 'Business and leisure in Gachibowli.', address: 'Gachibowli', min: 9000, max: 20000, amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Laundry', 'Breakfast'] },
    { name: 'Fortune Park', desc: 'Comfort near Madhapur.', address: 'Madhapur', min: 5000, max: 9500, amenities: ['WiFi', 'AC', 'Restaurant', '24/7 Reception', 'Breakfast'] },
    { name: 'Red Fox Hotel', desc: 'Budget stay near Secunderabad.', address: 'Secunderabad', min: 3200, max: 6000, amenities: ['WiFi', 'AC', '24/7 Reception'] },
    { name: 'Treebo Trip', desc: 'Affordable in Jubilee Hills.', address: 'Jubilee Hills', min: 2600, max: 5000, amenities: ['WiFi', 'AC', 'Restaurant'] }
  ]
};

const RESTAURANTS_BY_CITY = {
  Bangalore: [
    { name: 'Mavalli Tiffin Room (MTR)', cuisines: ['South Indian'], priceRange: '₹', desc: 'Legendary South Indian breakfast.' },
    { name: 'Karavalli', cuisines: ['Coastal', 'South Indian'], priceRange: '₹₹₹', desc: 'Coastal Karnataka and Kerala cuisine.' },
    { name: 'Toit Brewpub', cuisines: ['Continental', 'Bar Food'], priceRange: '₹₹', desc: 'Craft beer and wood-fired pizzas.' },
    { name: 'Nagaland Kitchen', cuisines: ['North East Indian'], priceRange: '₹₹', desc: 'Authentic Naga and NE dishes.' },
    { name: 'Chutney Chang', cuisines: ['North Indian', 'Chinese'], priceRange: '₹₹', desc: 'Multi-cuisine with city views.' },
    { name: 'Sri Udupi Park', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹', desc: 'Pure veg Udupi meals.' },
    { name: 'Hole in the Wall', cuisines: ['Cafe', 'Continental'], priceRange: '₹₹', desc: 'Cozy cafe and comfort food.' },
    { name: 'Meghana Foods', cuisines: ['Andhra', 'Biryani'], priceRange: '₹', desc: 'Spicy Andhra and biryani.' },
    { name: 'Truffles', cuisines: ['Continental', 'Burgers'], priceRange: '₹₹', desc: 'Burgers and steaks.' },
    { name: 'Brik Oven', cuisines: ['Italian', 'Mediterranean'], priceRange: '₹₹₹', desc: 'Wood-fired pizzas and pasta.' }
  ],
  Delhi: [
    { name: 'Karim\'s', cuisines: ['Mughlai', 'North Indian'], priceRange: '₹₹', desc: 'Historic Old Delhi Mughlai.' },
    { name: 'Indian Accent', cuisines: ['Indian', 'Fine Dining'], priceRange: '₹₹₹₹', desc: 'Progressive Indian cuisine.' },
    { name: 'Bukhara', cuisines: ['North Indian', 'Tandoor'], priceRange: '₹₹₹₹', desc: 'Iconic dal and kebabs.' },
    { name: 'Sagar Ratna', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹', desc: 'Pure veg South Indian.' },
    { name: 'Pindi', cuisines: ['North Indian', 'Punjabi'], priceRange: '₹₹', desc: 'Classic Punjabi fare.' },
    { name: 'Dilli 32', cuisines: ['North Indian', 'Street Food'], priceRange: '₹₹', desc: 'Modern street food.' },
    { name: 'Khan Chacha', cuisines: ['Mughlai', 'Kebabs'], priceRange: '₹₹', desc: 'Rolls and kebabs.' },
    { name: 'Saravana Bhavan', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹', desc: 'South Indian vegetarian chain.' },
    { name: 'Big Chill', cuisines: ['Continental', 'Desserts'], priceRange: '₹₹', desc: 'Pastas and desserts.' },
    { name: 'Yum Yum Tree', cuisines: ['Asian', 'Thai'], priceRange: '₹₹₹', desc: 'Pan-Asian and Thai.' }
  ],
  Mumbai: [
    { name: 'Trishna', cuisines: ['Seafood', 'Mangalorean'], priceRange: '₹₹₹', desc: 'Famous seafood in Fort.' },
    { name: 'Bademiya', cuisines: ['Mughlai', 'Street Food'], priceRange: '₹₹', desc: 'Late-night kebabs.' },
    { name: 'Britannia & Co', cuisines: ['Parsi', 'Iranian'], priceRange: '₹₹', desc: 'Berry pulao and Parsi dishes.' },
    { name: 'Gajalee', cuisines: ['Konkan', 'Seafood'], priceRange: '₹₹₹', desc: 'Konkan coastal food.' },
    { name: 'The Bombay Canteen', cuisines: ['Indian', 'Contemporary'], priceRange: '₹₹₹', desc: 'Modern Indian flavours.' },
    { name: 'Cafe Madras', cuisines: ['South Indian'], priceRange: '₹', desc: 'Filter coffee and idlis.' },
    { name: 'Kyani & Co', cuisines: ['Irani', 'Bakery'], priceRange: '₹', desc: 'Historic Irani cafe.' },
    { name: 'Shree Thaker Bhojanalay', cuisines: ['Gujarati', 'Thali'], priceRange: '₹', desc: 'Gujarati thali.' },
    { name: 'Peshawri', cuisines: ['North Indian', 'Tandoor'], priceRange: '₹₹₹₹', desc: 'North West Frontier cuisine.' },
    { name: 'Guru Kripa', cuisines: ['South Indian', 'Snacks'], priceRange: '₹', desc: 'Samosas and vada pav.' }
  ],
  Chennai: [
    { name: 'Saravana Bhavan', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹', desc: 'South Indian meals and tiffin.' },
    { name: 'Dakshin', cuisines: ['South Indian', 'Fine Dining'], priceRange: '₹₹₹₹', desc: 'Classic South Indian.' },
    { name: 'Annalakshmi', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹', desc: 'Pay-as-you-wish vegetarian.' },
    { name: 'Peshawri Chennai', cuisines: ['North Indian', 'Tandoor'], priceRange: '₹₹₹', desc: 'Kebabs and tikkas.' },
    { name: 'Murugan Idli Shop', cuisines: ['South Indian'], priceRange: '₹', desc: 'Famous idlis and dosas.' },
    { name: 'Coal Barbecues', cuisines: ['North Indian', 'Grill'], priceRange: '₹₹₹', desc: 'Live grill and buffet.' },
    { name: 'Junior Kuppanna', cuisines: ['Chettinad', 'Seafood'], priceRange: '₹₹', desc: 'Chettinad and seafood.' },
    { name: 'The Marina', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹₹', desc: 'Traditional vegetarian.' },
    { name: 'Zaitoon', cuisines: ['Mughlai', 'North Indian'], priceRange: '₹₹', desc: 'Biryani and curries.' },
    { name: 'Eden', cuisines: ['Multi-cuisine'], priceRange: '₹₹', desc: 'Rooftop dining.' }
  ],
  Hyderabad: [
    { name: 'Paradise Biryani', cuisines: ['Hyderabadi', 'Biryani'], priceRange: '₹₹', desc: 'Iconic Hyderabadi biryani.' },
    { name: 'Chutneys', cuisines: ['South Indian', 'Vegetarian'], priceRange: '₹', desc: 'South Indian breakfast.' },
    { name: 'Bawarchi', cuisines: ['Hyderabadi', 'Mughlai'], priceRange: '₹₹', desc: 'Biryani and kebabs.' },
    { name: 'Ohri\'s', cuisines: ['Multi-cuisine'], priceRange: '₹₹', desc: 'Comfort food and buffets.' },
    { name: 'Absolute Barbecues', cuisines: ['BBQ', 'North Indian'], priceRange: '₹₹₹', desc: 'Live grill buffet.' },
    { name: 'Nawab\'s', cuisines: ['Hyderabadi', 'Mughlai'], priceRange: '₹₹₹', desc: 'Royal Hyderabadi.' },
    { name: 'Minerva Coffee Shop', cuisines: ['South Indian', 'Snacks'], priceRange: '₹', desc: 'Iranian chai and snacks.' },
    { name: 'Shah Ghouse', cuisines: ['Hyderabadi', 'Biryani'], priceRange: '₹', desc: 'Local favourite biryani.' },
    { name: 'Firdaus', cuisines: ['Mughlai', 'North Indian'], priceRange: '₹₹', desc: 'Kebabs and biryani.' },
    { name: 'Taj Mahal Hotel', cuisines: ['Andhra', 'North Indian'], priceRange: '₹₹', desc: 'Classic Andhra meals.' }
  ]
};

const PLACES_BY_CITY = {
  Bangalore: ['Cubbon Park', 'Vidhana Soudha', 'MG Road', 'Bangalore Palace'],
  Delhi: ['India Gate', 'Red Fort', 'Connaught Place', 'Agrasen Ki Baoli'],
  Mumbai: ['Gateway of India', 'Marine Drive', 'Chhatrapati Shivaji Terminus'],
  Chennai: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St George'],
  Hyderabad: ['Charminar', 'Hussain Sagar Lake', 'Golconda Fort']
};

const MENU_ITEMS = [
  { name: 'Masala Dosa', category: 'Breakfast', price: 120, veg: true, prep: 10 },
  { name: 'Idli (4 pcs)', category: 'Breakfast', price: 80, veg: true, prep: 5 },
  { name: 'Vada Sambar', category: 'Breakfast', price: 90, veg: true, prep: 8 },
  { name: 'Filter Coffee', category: 'Beverages', price: 50, veg: true, prep: 3 },
  { name: 'Chicken Biryani', category: 'Main', price: 280, veg: false, prep: 25 },
  { name: 'Veg Biryani', category: 'Main', price: 200, veg: true, prep: 20 },
  { name: 'Dal Makhani', category: 'Main', price: 220, veg: true, prep: 15 },
  { name: 'Butter Naan', category: 'Bread', price: 45, veg: true, prep: 5 },
  { name: 'Paneer Butter Masala', category: 'Main', price: 260, veg: true, prep: 18 },
  { name: 'Chicken Tikka', category: 'Starters', price: 320, veg: false, prep: 22 },
  { name: 'Gulab Jamun', category: 'Dessert', price: 80, veg: true, prep: 5 },
  { name: 'Rasmalai', category: 'Dessert', price: 120, veg: true, prep: 5 },
  { name: 'Lassi', category: 'Beverages', price: 60, veg: true, prep: 3 },
  { name: 'Veg Thali', category: 'Main', price: 250, veg: true, prep: 15 },
  { name: 'Fish Curry', category: 'Main', price: 350, veg: false, prep: 25 }
];

const LOCAL_POSTS = [
  { city: 'Bangalore', type: 'Tip', title: 'Best time to visit Cubbon Park', content: 'Visit Cubbon Park early morning before 8 AM to avoid crowds and enjoy the greenery. Weekends get very busy. Carry water and wear comfortable shoes for walking.', tags: ['parks', 'morning'] },
  { city: 'Bangalore', type: 'Scam Alert', title: 'Fake tour guides at Bangalore Palace', content: 'Be wary of people outside Bangalore Palace offering \"guided tours\" at cheap rates. Buy tickets only at the official counter inside. Many touts charge double and give wrong information.', tags: ['scam', 'palace'] },
  { city: 'Delhi', type: 'Recommendation', title: 'Hidden gem: Agrasen Ki Baoli', content: 'This stepwell near Connaught Place is free to enter and rarely crowded. Beautiful architecture and a peaceful escape from the busy streets. Best visited in morning light.', tags: ['heritage', 'free'] },
  { city: 'Delhi', type: 'Scam Alert', title: 'Overpriced rickshaws near Red Fort', content: 'Auto and cycle rickshaw drivers near Red Fort often quote 3-4x the actual fare. Use Uber/Ola or agree on a price before sitting. Normal fare to Chandni Chowk should be under 50 rupees.', tags: ['transport', 'scam'] },
  { city: 'Mumbai', type: 'Hidden Place', title: 'Banganga Tank – peaceful spot in Malabar Hill', content: 'Banganga Tank is an ancient water tank surrounded by temples. Very few tourists know about it. Quiet and spiritual. No entry fee. Visit early morning for the best experience.', tags: ['temples', 'quiet'] },
  { city: 'Mumbai', type: 'Tip', title: 'Local trains: avoid peak hours', content: 'Local trains in Mumbai are packed during 8-10 AM and 6-8 PM. If you are not used to crowds, travel between 11 AM and 4 PM. Always keep bags in front and be careful of pickpockets.', tags: ['transport', 'safety'] },
  { city: 'Chennai', type: 'Recommendation', title: 'Marina Beach at sunset', content: 'Marina Beach is beautiful at sunset. Go around 5:30 PM. Avoid swimming as currents are strong. Plenty of street food and coconut water. Keep an eye on your belongings.', tags: ['beach', 'sunset'] },
  { city: 'Chennai', type: 'Tip', title: 'Carry water and hat in summer', content: 'Chennai gets very hot from March to June. Always carry a water bottle and wear a hat or cap. Many temples require you to remove shoes – the floor can get extremely hot. Plan indoor activities for midday.', tags: ['weather', 'safety'] },
  { city: 'Hyderabad', type: 'Hidden Place', title: 'Qutb Shahi Tombs – less crowded than Golconda', content: 'The Qutb Shahi Tombs are near Golconda Fort but get far fewer visitors. Beautiful Indo-Persian architecture and peaceful gardens. Combine with Golconda in the same day. Open 9:30 AM.', tags: ['heritage', 'tombs'] },
  { city: 'Hyderabad', type: 'Recommendation', title: 'Biryani at small local joints', content: 'While Paradise and Bawarchi are famous, try smaller joints like Shah Ghouse or Mandar for authentic local biryani at half the price. Go for mutton biryani and mirchi ka salan on the side.', tags: ['food', 'biryani'] }
];

function randomOffset() {
  return (Math.random() - 0.5) * 0.02;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@travelon.in' });
  let adminUser, localUser;
  if (!existing) {
    adminUser = await User.create({ name: 'Admin', email: 'admin@travelon.in', password: 'admin123', role: 'admin' });
    localUser = await User.create({ name: 'Local Guide', email: 'local@travelon.in', password: 'local123', role: 'local' });
    console.log('Created seed users: admin@travelon.in, local@travelon.in');
  } else {
    adminUser = await User.findOne({ role: 'admin' });
    localUser = await User.findOne({ role: 'local' }) || adminUser;
  }

  await FoodItem.deleteMany({});
  await LocalPost.deleteMany({});
  await Hotel.deleteMany({});
  await Restaurant.deleteMany({});
  console.log('Cleared hotels, restaurants, menu items, local posts');

  const ownerId = adminUser._id;

  for (const city of CITIES) {
    const hotels = HOTELS_BY_CITY[city.name] || [];
    for (let i = 0; i < hotels.length; i++) {
      const h = hotels[i];
      const lng = city.lng + randomOffset();
      const lat = city.lat + randomOffset();
      await Hotel.create({
        name: h.name,
        description: h.desc,
        city: city.name,
        address: h.address || `${h.name}, ${city.name}`,
        location: { type: 'Point', coordinates: [lng, lat] },
        pricePerNightMin: h.min,
        pricePerNightMax: h.max,
        amenities: h.amenities || ['WiFi', 'AC', '24/7 Reception'],
        images: [],
        nearby: {
          places: (PLACES_BY_CITY[city.name] || []).slice(0, 3),
          restaurants: (RESTAURANTS_BY_CITY[city.name] || []).slice(0, 4).map((r) => r.name),
          transport: ['Metro', 'Cab']
        },
        owner: ownerId,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 500),
        isActive: true
      });
    }
    console.log(`Seeded ${hotels.length} hotels in ${city.name}`);
  }

  const restaurantIds = [];
  for (const city of CITIES) {
    const rests = RESTAURANTS_BY_CITY[city.name] || [];
    for (let i = 0; i < rests.length; i++) {
      const r = rests[i];
      const lng = city.lng + randomOffset();
      const lat = city.lat + randomOffset();
      const rest = await Restaurant.create({
        name: r.name,
        description: r.desc,
        city: city.name,
        location: { type: 'Point', coordinates: [lng, lat] },
        cuisines: r.cuisines,
        priceRange: r.priceRange,
        owner: ownerId,
        rating: 3.5 + Math.random() * 1.2,
        reviewCount: Math.floor(Math.random() * 400),
        nearby: { places: [] },
        openingHours: '8 AM – 11 PM',
        deliveryTime: 30 + Math.floor(Math.random() * 20),
        minimumOrderValue: 200,
        acceptOrders: true,
        isActive: true
      });
      restaurantIds.push(rest._id);
    }
    console.log(`Seeded ${rests.length} restaurants in ${city.name}`);
  }

  for (const restId of restaurantIds) {
    const count = 5 + Math.floor(Math.random() * 6);
    const shuffled = [...MENU_ITEMS].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      const m = shuffled[i];
      await FoodItem.create({
        restaurantId: restId,
        name: m.name,
        description: `${m.name} - house special`,
        category: m.category,
        price: m.price + Math.floor(Math.random() * 30),
        isVegetarian: m.veg,
        preparationTime: m.prep
      });
    }
  }
  console.log('Seeded menu items for all restaurants');

  for (const post of LOCAL_POSTS) {
    await LocalPost.create({
      userId: localUser._id,
      city: post.city,
      postType: post.type,
      title: post.title,
      content: post.content,
      tags: post.tags,
      upvotes: Math.floor(Math.random() * 50),
      isHidden: false
    });
  }
  console.log(`Seeded ${LOCAL_POSTS.length} local posts`);

  console.log('Seed completed successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
