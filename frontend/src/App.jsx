/**
 * Main App Component
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Styles
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute>
                <div>Restaurants Page (coming soon)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <div>Orders Page (coming soon)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/local-opinions"
            element={
              <ProtectedRoute>
                <div>Local Opinions Page (coming soon)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile Page (coming soon)</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
