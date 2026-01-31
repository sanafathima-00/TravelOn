/**
 * Home Page
 */

import { Link } from 'react-router-dom';
import { MapPin, Coffee, Users, Award } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🌍 Welcome to TravelOn</h1>
          <p className="text-xl mb-8">Your all-in-one travel companion for hotels, food, and local insights</p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/hotels"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Find Hotels
            </Link>
            <Link
              to="/restaurants"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Order Food
            </Link>
            <Link
              to="/local-opinions"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Local Tips
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose TravelOn?</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <MapPin size={40} />,
                title: 'Best Hotels',
                description: 'Find and book the best hotels in any city',
              },
              {
                icon: <Coffee size={40} />,
                title: 'Food Delivery',
                description: 'Order delicious food from local restaurants',
              },
              {
                icon: <Users size={40} />,
                title: 'Local Community',
                description: 'Get authentic tips from local travelers',
              },
              {
                icon: <Award size={40} />,
                title: 'Verified Reviews',
                description: 'Read honest reviews from real travelers',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg text-center shadow-lg">
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg mb-6">Start your journey with TravelOn today</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 TravelOn. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Your trusted travel companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
