/**
 * Navigation Bar Component
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ✈️ TravelOn
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/hotels" className="hover:text-primary transition">
              Hotels
            </Link>
            <Link to="/restaurants" className="hover:text-primary transition">
              Restaurants
            </Link>
            <Link to="/local-opinions" className="hover:text-primary transition">
              Local Tips
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hover:text-primary transition">
                  Orders
                </Link>
                <div className="flex items-center space-x-3 border-l pl-6">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="group relative">
                    <button className="flex items-center space-x-1 hover:text-primary">
                      <span className="text-sm font-medium">{user?.firstName}</span>
                    </button>
                    <div className="hidden group-hover:block absolute right-0 bg-white border rounded-lg shadow-lg py-2 w-40 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        >
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/hotels"
              className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              Hotels
            </Link>
            <Link
              to="/restaurants"
              className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              Restaurants
            </Link>
            <Link
              to="/local-opinions"
              className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              Local Tips
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
