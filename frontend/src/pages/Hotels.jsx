/**
 * Hotels Page
 */

import { useEffect, useState } from 'react';
import { useMutation } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import HotelCard from '../components/HotelCard';
import { Search, Filter } from 'lucide-react';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({ city: '', minPrice: 0, maxPrice: 5000 });
  const { mutate, loading } = useMutation();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await mutate('GET', '/hotels', null);
      setHotels(response.data || []);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await mutate('GET', `/hotels?${query}`, null);
      setHotels(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">🏨 Find Hotels</h1>

        {/* Search & Filter Section */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search city..."
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Search size={20} />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </form>

        {/* Hotels Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hotels found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
