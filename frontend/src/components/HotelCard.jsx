import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { getHotelImageUrl, getPlaceholderUrl } from '../utils/imageFallback';
import styles from './HotelCard.module.css';

export default function HotelCard({ hotel, cityName, manifest }) {
  const imgUrl = getHotelImageUrl(hotel, cityName, manifest);

  return (
    <Link to={`/hotel/${hotel._id}`} className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={imgUrl}
          alt={hotel.name}
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderUrl(); }}
        />
      </div>
      <div className={styles.panel}>
        <h3 className={styles.name}>{hotel.name}</h3>
        <div className={styles.rating}>
          <FontAwesomeIcon icon={faStar} className={styles.star} />
          <span>{Number(hotel.rating ?? 0).toFixed(1)}</span>
          {hotel.reviewCount != null && hotel.reviewCount > 0 && (
            <span className={styles.reviewCount}>({hotel.reviewCount})</span>
          )}
        </div>
      </div>
    </Link>
  );
}
