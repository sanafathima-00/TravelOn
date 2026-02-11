import "./Hero.css";
import logo from "../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Hero() {
  return (
    <section className="hero">
      
      {/* LEFT SIDE */}
      <div className="hero-left">

        {/* Top bar */}
        <div className="hero-topbar">
          <div className="hero-logo">
            <img src={logo} alt="TravelOn Logo" className="logo-img" />
            <span>TravelOn</span>
          </div>

          <button className="login-btn">Login</button>
        </div>

        {/* Content */}
        <div className="hero-content">
          <h1>
            Not a travel guide, but a travel inspiration for your next trip
          </h1>

          <p>
            <i>Discover the places, stories, and experiences that shape your journey.</i>
          </p>

          <div className="hero-search">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search cities, places, or experiences..."
            />
          </div>
        </div>

      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hero-right" />

    </section>
  );
}

export default Hero;
