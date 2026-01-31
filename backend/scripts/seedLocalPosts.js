/**
 * Seed Local Posts Script (MVP)
 * Usage: node scripts/seedLocalPosts.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const LocalPost = require('../src/models/LocalPost');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGODB_URI;

const postsByCity = {
  Bangalore: [
    {
      postType: 'Tip',
      title: 'Visit Lalbagh early morning',
      content:
        'Lalbagh gets very crowded after 9 AM on weekends. If you go before 7 AM, it’s peaceful and perfect for photos.',
      tags: ['parks', 'timing'],
    },
    {
      postType: 'Scam Alert',
      title: 'Auto drivers near MG Road may overcharge',
      content:
        'Some auto drivers refuse to use meters near MG Road. Always insist on meter or use app-based cabs.',
      tags: ['transport', 'scam'],
    },
    {
      postType: 'Hidden Place',
      title: 'DYU Art Café in Koramangala',
      content:
        'A quiet café with great coffee and a calm vibe. Perfect if you want to escape crowded places.',
      tags: ['cafe', 'hidden'],
    },
    {
      postType: 'Recommendation',
      title: 'Best street shopping at Commercial Street',
      content:
        'Commercial Street is great for clothes and accessories. Bargain a bit and you’ll get good deals.',
      tags: ['shopping'],
    },
    {
      postType: 'Tip',
      title: 'Use Namma Metro during peak hours',
      content:
        'Traffic can be brutal in the evenings. Metro is usually the fastest option between central areas.',
      tags: ['transport'],
    },
    {
      postType: 'Scam Alert',
      title: 'Fake guides near Cubbon Park',
      content:
        'Some people pose as guides and ask for money. Cubbon Park doesn’t require any guide.',
      tags: ['scam'],
    },
  ],

  Delhi: [
    {
      postType: 'Tip',
      title: 'Connaught Place best explored on foot',
      content:
        'Park your vehicle elsewhere and walk around CP. Inner and outer circles have many hidden cafes.',
      tags: ['walking'],
    },
    {
      postType: 'Scam Alert',
      title: 'Fake ticket sellers near monuments',
      content:
        'Avoid people selling tickets outside monuments. Always buy tickets from official counters.',
      tags: ['scam'],
    },
    {
      postType: 'Hidden Place',
      title: 'Sunder Nursery near Humayun’s Tomb',
      content:
        'Less crowded than Lodhi Garden and beautifully maintained. Great place for an evening walk.',
      tags: ['parks'],
    },
    {
      postType: 'Recommendation',
      title: 'Khan Market for cafes and shopping',
      content:
        'Slightly expensive but great ambience. Perfect for a relaxed evening.',
      tags: ['shopping', 'food'],
    },
    {
      postType: 'Tip',
      title: 'Use metro to avoid traffic',
      content:
        'Delhi Metro is reliable and connects most tourist spots efficiently.',
      tags: ['transport'],
    },
    {
      postType: 'Scam Alert',
      title: 'Tourist scams near Paharganj',
      content:
        'Be cautious of strangers offering hotel deals or tours at very low prices.',
      tags: ['scam'],
    },
  ],

  Mumbai: [
    {
      postType: 'Tip',
      title: 'Marine Drive best at sunset',
      content:
        'Visit Marine Drive around sunset for the best views and pleasant weather.',
      tags: ['sunset'],
    },
    {
      postType: 'Scam Alert',
      title: 'Overpriced taxis near stations',
      content:
        'Some taxis charge extra near stations. Use meter-based taxis or apps.',
      tags: ['transport', 'scam'],
    },
    {
      postType: 'Hidden Place',
      title: 'Bandra Bandstand morning walks',
      content:
        'Quiet and refreshing early morning. Locals prefer this time.',
      tags: ['walk'],
    },
    {
      postType: 'Recommendation',
      title: 'Colaba Causeway for shopping',
      content:
        'Great for souvenirs and street shopping. Bargaining is expected.',
      tags: ['shopping'],
    },
    {
      postType: 'Tip',
      title: 'Local trains are fastest',
      content:
        'If you’re comfortable, local trains save a lot of time during rush hours.',
      tags: ['transport'],
    },
    {
      postType: 'Scam Alert',
      title: 'Fake donation requests',
      content:
        'Avoid people asking for donations with fake IDs near tourist areas.',
      tags: ['scam'],
    },
  ],

  Chennai: [
    {
      postType: 'Tip',
      title: 'Marina Beach early mornings',
      content:
        'Best time to visit is early morning when it’s cooler and less crowded.',
      tags: ['beach'],
    },
    {
      postType: 'Hidden Place',
      title: 'Elliot’s Beach in Besant Nagar',
      content:
        'Cleaner and quieter than Marina Beach. Good cafés nearby.',
      tags: ['beach'],
    },
    {
      postType: 'Recommendation',
      title: 'Try local filter coffee',
      content:
        'Small darshinis serve some of the best filter coffee in the city.',
      tags: ['food'],
    },
    {
      postType: 'Scam Alert',
      title: 'Unofficial parking fees',
      content:
        'Some places have people charging unofficial parking fees. Be cautious.',
      tags: ['scam'],
    },
    {
      postType: 'Tip',
      title: 'Autos prefer fixed fares',
      content:
        'Many autos don’t use meters. Agree on fare before starting.',
      tags: ['transport'],
    },
    {
      postType: 'Hidden Place',
      title: 'Kapaleeshwarar Temple streets',
      content:
        'The streets around the temple are lively and full of local culture.',
      tags: ['culture'],
    },
  ],

  Hyderabad: [
    {
      postType: 'Tip',
      title: 'Charminar area is busy in evenings',
      content:
        'Visit early morning if you want to avoid crowds.',
      tags: ['timing'],
    },
    {
      postType: 'Scam Alert',
      title: 'Fake pearl sellers',
      content:
        'Buy pearls only from trusted stores. Many street sellers sell fakes.',
      tags: ['scam'],
    },
    {
      postType: 'Hidden Place',
      title: 'Qutb Shahi Tombs',
      content:
        'Less crowded than Golconda Fort and very peaceful.',
      tags: ['history'],
    },
    {
      postType: 'Recommendation',
      title: 'Necklace Road night walks',
      content:
        'Good place for an evening walk with food stalls nearby.',
      tags: ['walk'],
    },
    {
      postType: 'Tip',
      title: 'Metro is convenient',
      content:
        'Hyderabad Metro connects many major areas and is clean.',
      tags: ['transport'],
    },
    {
      postType: 'Scam Alert',
      title: 'Tourist photo scams',
      content:
        'Some people offer photos and then demand money. Avoid them.',
      tags: ['scam'],
    },
  ],
};

async function seedLocalPosts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const locals = await User.find({ role: 'local' });
    if (!locals.length) throw new Error('No local users found');

    console.log(`👤 Found ${locals.length} local users`);

    console.log('🧹 Clearing existing local posts...');
    await LocalPost.deleteMany({});
    console.log('✅ Old local posts removed');

    const posts = [];

    Object.entries(postsByCity).forEach(([city, cityPosts]) => {
      cityPosts.forEach((post) => {
        const randomLocal =
          locals[Math.floor(Math.random() * locals.length)];

        posts.push({
          ...post,
          city,
          author: randomLocal._id,
          upvotes: Math.floor(Math.random() * 50) + 5,
          isActive: true,
        });
      });
    });

    console.log('📝 Inserting local posts...');
    await LocalPost.insertMany(posts);

    console.log(`🎉 Successfully seeded ${posts.length} local posts`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedLocalPosts();
