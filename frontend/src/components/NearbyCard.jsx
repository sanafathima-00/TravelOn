import { Link } from 'react-router-dom';
import { slugify } from '../utils/imageFallback';
import { getPlaceImageUrl, getPlaceholderUrl } from '../utils/imageFallback';
import styles from './NearbyCard.module.css';

export default function NearbyCard({ name, cityName, type, manifest }) {
  const citySlug = (cityName || '').toLowerCase().replace(/\s+/g, '-').trim();
  const slug = slugify(name);
  const to = `/place/${citySlug}/${type}/${slug}`;
  const imgUrl = getPlaceImageUrl(citySlug, type, slug, manifest);

  return (
    <Link to={to} className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={imgUrl}
          alt={name}
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderUrl(); }}
        />
      </div>
      <span className={styles.name}>{name}</span>
    </Link>
  );
}
