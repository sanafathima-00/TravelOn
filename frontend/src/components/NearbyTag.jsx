import { Link } from 'react-router-dom';
import { slugify } from '../utils/imageFallback';
import styles from './NearbyTag.module.css';

export default function NearbyTag({ name, cityName, type }) {
  const citySlug = (cityName || '').toLowerCase().replace(/\s+/g, '-').trim();
  const slug = slugify(name);
  const to = `/place/${citySlug}/${type}/${slug}`;

  return (
    <Link to={to} className={styles.tag}>
      {name}
    </Link>
  );
}
