import "./Categories.css";
import { useNavigate } from "react-router-dom";

import bangalore from '../assets/Bangalore/Vidhana-Soudha_BLR.jpg';
import chennai from '../assets/Chennai/Church_CHE.jpg';
import hyderabad from '../assets/Hyderabad/Char-Minar_HYD.jpg';
import delhi from '../assets/Delhi/Red-Fort_DEL.jpg';
import mumbai from '../assets/Mumbai/Gateway-of-India_MUM.jpg';

function Categories() {
  const navigate = useNavigate();

  const cities = [
    { name: "Bangalore", image: bangalore },
    { name: "Chennai", image: chennai },
    { name: "Hyderabad", image: hyderabad },
    { name: "Delhi", image: delhi },
    { name: "Mumbai", image: mumbai },
  ];

  const handleClick = (cityName) => {
    navigate(`/city/${cityName.toLowerCase()}`);
  };

  return (
    <section className="categories">
      <h2>Popular cities</h2>

      <div className="category-list">
        {cities.map((city, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() => handleClick(city.name)}
          >
            <img src={city.image} alt={city.name} />
            <p>{city.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
