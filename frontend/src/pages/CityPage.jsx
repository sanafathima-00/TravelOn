import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bangalore from "../assets/Vidhana-Soudha_BLR.jpg";
import "./CityPage.css";

function CityPage() {
    const { name } = useParams();
    const navigate = useNavigate();
    const cityName = name.charAt(0).toUpperCase() + name.slice(1);

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollRef = useRef();

    // Hero Image Map
    const cityImages = {
        Bangalore: bangalore,
    };

    // Hotel Image Map
    const hotelImages = {
        "Taj MG Road":
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "The Oberoi Bengaluru":
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "ITC Gardenia":
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "The Leela Palace":
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "Radisson Blu Atria":
            "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    };

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/hotels?city=${cityName}`)
            .then(res => res.json())
            .then(data => {
                setHotels(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching hotels:", err);
                setLoading(false);
            });
    }, [cityName]);

    const handleHotelClick = (id) => {
        navigate(`/hotel/${id}`);
    };

    return (
        <div className="city-page">
            {/* HERO */}
            <div className="city-hero">
                <img
                    src={cityImages[cityName]}
                    alt={cityName}
                    className="city-hero-img"
                />

                <div className="city-hero-overlay">
                    <h1>{cityName}</h1>
                </div>
            </div>
            {/* HOTELS */}
            <section className="city-section">
                <h2>Available Hotels</h2>

                {loading ? (
                    <p>Loading hotels...</p>
                ) : (
                    <div className="hotel-wrapper">

                        <div className="city-grid" ref={scrollRef}>
                            {hotels.map((hotel) => (
                                <div
                                    key={hotel._id}
                                    className="city-card"
                                    onClick={() => handleHotelClick(hotel._id)}
                                >
                                    <img
                                        src={hotelImages[hotel.name]}
                                        alt={hotel.name}
                                    />

                                    <div className="city-card-content">
                                        <h3>{hotel.name}</h3>
                                        <p><u>Rating</u>: {hotel.rating}⭐</p>
                                        <p><u>Reviews</u>: {hotel.reviewCount} reviews</p>
                                        <p><u>Price</u>: ₹{hotel.pricePerNightMin} - ₹{hotel.pricePerNightMax}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </section>

        </div>
    );
}

export default CityPage;
