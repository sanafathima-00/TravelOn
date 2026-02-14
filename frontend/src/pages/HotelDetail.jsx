import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { hotelById, hotelReviews, createHotelReview } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAssetManifest } from '../context/AssetManifestContext';
import { getHotelImageUrl, getGalleryImageUrl, getPlaceholderUrl, slugify } from '../utils/imageFallback';
import WriteReviewModal from '../components/WriteReviewModal';
import NearbyCard from '../components/NearbyCard';
import NearbyTag from '../components/NearbyTag';
import styles from './HotelDetail.module.css';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const manifest = useAssetManifest();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    hotelById(id)
      .then((r) => {
        setHotel(r.data);
        return hotelReviews(id);
      })
      .then((r) => setReviews(r.data || []))
      .catch((err) => {
        setError(err.message || 'Hotel not found');
        setHotel(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const refetchReviews = () => {
    if (!id) return;
    hotelReviews(id).then((r) => setReviews(r.data || []));
    hotelById(id).then((r) => setHotel(r.data));
  };

  const handleSubmitReview = async (rating, title, comment) => {
    await createHotelReview(id, { rating, title, comment });
    refetchReviews();
    setModalOpen(false);
  };

  if (loading) return <div className={styles.wrap}><p className={styles.status}>Loading…</p></div>;
  if (error || !hotel) {
    return (
      <div className={styles.wrap}>
        <p className={styles.error}>{error}</p>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  const hotelSlug = slugify(hotel.name);
  const meta = manifest?.hotels?.[hotelSlug];
  const assetCount = typeof meta === 'object' ? meta?.count ?? 0 : 0;
  const assetImages = assetCount > 0
    ? Array.from({ length: assetCount }, (_, i) => getGalleryImageUrl(hotel, i + 1, manifest))
    : [];
  const images = hotel.images && hotel.images.length > 0
    ? hotel.images
    : assetImages.length > 0 ? assetImages : [getHotelImageUrl(hotel, hotel.city, manifest)];
  const currentImage = images[galleryIndex] ?? getPlaceholderUrl();

  const nearbyPlaces = hotel.nearby?.places || [];
  const nearbyRestaurants = hotel.nearby?.restaurants || [];
  const nearbyTransport = hotel.nearby?.transport || [];

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </nav>
      <section className={styles.gallery}>
        <img src={currentImage} alt={hotel.name} className={styles.galleryImg} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={styles.galleryPrev}
              onClick={() => setGalleryIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              aria-label="Previous"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              type="button"
              className={styles.galleryNext}
              onClick={() => setGalleryIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              aria-label="Next"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
      </section>

      <div className={`${styles.content} page-padding`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{hotel.name}</h1>
          <div className={styles.ratingRow}>
            <span className={styles.rating}>
              <FontAwesomeIcon icon={faStar} className={styles.star} />
              {Number(hotel.rating ?? 0).toFixed(1)}
            </span>
            {hotel.reviewCount != null && (
              <span className={styles.reviewCount}>{hotel.reviewCount} reviews</span>
            )}
          </div>
        </div>

        {hotel.description && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About</h2>
            <p className={styles.description}>{hotel.description}</p>
          </section>
        )}

        {(nearbyRestaurants.length > 0 || nearbyPlaces.length > 0 || nearbyTransport.length > 0) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Nearby</h2>

            {nearbyRestaurants.length > 0 && (
              <div className={styles.nearbyBlock}>
                <h3 className={styles.nearbyLabel}>Restaurants</h3>
                <div className={styles.nearbyGrid}>
                  {nearbyRestaurants.map((name, i) => (
                    <NearbyCard
                      key={i}
                      name={name}
                      cityName={hotel.city}
                      type="restaurant"
                      manifest={manifest}
                    />
                  ))}
                </div>
              </div>
            )}

            {nearbyPlaces.length > 0 && (
              <div className={styles.nearbyBlock}>
                <h3 className={styles.nearbyLabel}>Places to visit</h3>
                <div className={styles.nearbyGrid}>
                  {nearbyPlaces.map((name, i) => (
                    <NearbyCard
                      key={i}
                      name={name}
                      cityName={hotel.city}
                      type="place"
                      manifest={manifest}
                    />
                  ))}
                </div>
              </div>
            )}

            {nearbyTransport.length > 0 && (
              <div className={styles.nearbyBlock}>
                <h3 className={styles.nearbyLabel}>Travel options</h3>
                <div className={styles.nearbyTags}>
                  {nearbyTransport.map((name, i) => (
                    <NearbyTag
                      key={i}
                      name={name}
                      cityName={hotel.city}
                      type="transport"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.sectionTitle}>Local reviews</h2>
            {user && (
              <button
                type="button"
                className={styles.writeReviewBtn}
                onClick={() => setModalOpen(true)}
              >
                Write a review
              </button>
            )}
            {!user && (
              <button
                type="button"
                className={styles.writeReviewBtn}
                onClick={() => navigate('/login')}
              >
                Login to write a review
              </button>
            )}
          </div>
          <div className={styles.reviewsList}>
            {reviews.length === 0 && <p className={styles.noReviews}>No reviews yet.</p>}
            {reviews.map((rev) => (
              <article key={rev._id} className={styles.reviewCard}>
                <div className={styles.reviewMeta}>
                  <span className={styles.reviewAuthor}>{rev.userId?.name || 'Guest'}</span>
                  <span className={styles.reviewDate}>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FontAwesomeIcon
                      key={n}
                      icon={faStar}
                      className={n <= (rev.rating || 0) ? styles.starFilled : styles.starEmpty}
                    />
                  ))}
                </div>
                {rev.title && <h3 className={styles.reviewTitle}>{rev.title}</h3>}
                <p className={styles.reviewComment}>{rev.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {modalOpen && (
        <WriteReviewModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
