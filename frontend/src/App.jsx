import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import City from './pages/City';
import HotelDetail from './pages/HotelDetail';
import PlaceDetail from './pages/PlaceDetail';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/city/:cityName" element={<City />} />
      <Route path="/hotel/:id" element={<HotelDetail />} />
      <Route path="/place/:city/:type/:slug" element={<PlaceDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
