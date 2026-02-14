import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { getRestaurantImageUrl, getPlaceholderUrl } from '../utils/imageFallback';
import styles from './RestaurantCard.module.css';

export default function RestaurantCard({ restaurant, cityName, manifest }) {
  const imgUrl = getRestaurantImageUrl(restaurant, cityName, manifest);
  const cuisines = Array.isArray(restaurant.cuisines) && restaurant.cuisines.length
    ? restaurant.cuisines.slice(0, 2).join(', ')
    : '';

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={imgUrl}
          alt={restaurant.name}
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderUrl(); }}
        />
      </div>
      <div className={styles.panel}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <div className={styles.rating}>
          <FontAwesomeIcon icon={faStar} className={styles.star} />
          {Number(restaurant.rating ?? 0).toFixed(1)}
        </div>
        {cuisines && <p className={styles.cuisines}>{cuisines}</p>}
        {restaurant.deliveryTime != null && (
          <span className={styles.delivery}>~{restaurant.deliveryTime} min</span>
        )}
      </div>
    </div>
  );
}
