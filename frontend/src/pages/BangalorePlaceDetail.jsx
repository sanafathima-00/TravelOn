import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { bangalorePlaceById, bangalorePlaces, createBangalorePlaceReview } from '../api/client';
import { getBangaloreCategoryImage, getPlaceholderUrl } from '../utils/imageFallback';
import WriteReviewModal from '../components/WriteReviewModal';
import styles from './HotelDetail.module.css';

const DESCRIPTION_PLACEHOLDER =
  'This spot is one of Bangalore’s most loved local gems...';

export default function BangalorePlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [place, setPlace] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    bangalorePlaceById(id)
      .then((r) => {
        const currentPlace = r.data;
        setPlace(currentPlace);

        // fetch full category list to calculate index
        return bangalorePlaces(currentPlace.category);
      })
      .then((r) => {
        setCategoryList(Array.isArray(r.data) ? r.data : []);
      })
      .catch((err) => {
        setError(err.message || 'Place not found');
        setPlace(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async (rating, title, comment) => {
    const res = await createBangalorePlaceReview(id, { rating, title, comment });
    setPlace(res.data);
  };

  if (loading) {
    return (
      <div className={styles.wrap}>
        <p className={styles.status}>Loading…</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className={styles.wrap}>
        <p className={styles.error}>{error}</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  // 🔥 derive correct index
  const index = categoryList.findIndex(p => p._id === place._id);
  const heroImage =
    getBangaloreCategoryImage(place.category, index + 1) ||
    getPlaceholderUrl();

  const reviews = Array.isArray(place.reviews) ? place.reviews : [];

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </nav>

      <section className={styles.gallery}>
        <img
          src={heroImage}
          alt={place.name}
          className={styles.galleryImg}
        />
      </section>

      <div className={`${styles.content} page-padding`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{place.name}</h1>
          <div className={styles.ratingRow}>
            <span className={styles.rating}>
              <FontAwesomeIcon icon={faStar} className={styles.star} />
              {Number(place.averageRating ?? 0).toFixed(1)}
            </span>
            {place.reviewCount != null && (
              <span className={styles.reviewCount}>
                {place.reviewCount} reviews
              </span>
            )}
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.description}>{DESCRIPTION_PLACEHOLDER}</p>
        </section>

        <section className={styles.section}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.sectionTitle}>Local reviews</h2>
            <button
              className={styles.writeReviewBtn}
              onClick={() =>
                user ? setModalOpen(true) : navigate('/login')
              }
            >
              {user ? 'Write a review' : 'Login to write a review'}
            </button>
          </div>

          <div className={styles.reviewsList}>
            {reviews.length === 0 && (
              <p className={styles.noReviews}>No reviews yet.</p>
            )}

            {reviews.map((rev, idx) => (
              <article key={rev._id || idx} className={styles.reviewCard}>
                <div className={styles.reviewMeta}>
                  <span className={styles.reviewAuthor}>
                    {rev.user?.name || 'Guest'}
                  </span>
                  {rev.createdAt && (
                    <span className={styles.reviewDate}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className={styles.reviewStars}>
                  {[1,2,3,4,5].map((n) => (
                    <FontAwesomeIcon
                      key={n}
                      icon={faStar}
                      className={
                        n <= (rev.rating || 0)
                          ? styles.starFilled
                          : styles.starEmpty
                      }
                    />
                  ))}
                </div>

                {rev.title && (
                  <h3 className={styles.reviewTitle}>{rev.title}</h3>
                )}
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
