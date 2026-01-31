/**
 * Hotel Card Component
 */

import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HotelCard = ({ hotel }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Hotel Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={hotel.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
          alt={hotel.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-300"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{hotel.name}</h3>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span>{hotel.city}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-bold text-lg text-gray-800">
              {formatCurrency(hotel.pricePerNightMin)}/night
            </span>
          </div>
          <Link
            to={`/hotels/${hotel._id}`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
