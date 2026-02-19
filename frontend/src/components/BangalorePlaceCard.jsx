import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { getBangaloreCategoryImage, getPlaceholderUrl } from '../utils/imageFallback';
import styles from './HotelCard.module.css';

export default function BangalorePlaceCard({ place, index }) {
  const imgSrc = getBangaloreCategoryImage(place.category, index + 1);

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={imgSrc}
          alt={place.name}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = getPlaceholderUrl(); 
          }}
        />
      </div>

      <div className={styles.panel}>
        <h3 className={styles.name}>{place.name}</h3>
        {place.location && (
          <p className={styles.location}>{place.location}</p>
        )}

        <div className={styles.footer}>
          <div className={styles.rating}>
            <FontAwesomeIcon icon={faStar} className={styles.star} />
            <span>{Number(place.averageRating ?? 0).toFixed(1)}</span>
            {place.reviewCount > 0 && (
              <span className={styles.reviewCount}>
                ({place.reviewCount})
              </span>
            )}
          </div>

          <Link 
            to={`/bangalore/places/${place._id}`} 
            className={styles.detailsBtn}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
