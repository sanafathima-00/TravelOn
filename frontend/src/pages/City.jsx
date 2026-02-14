import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import HorizontalCardRow from '../components/HorizontalCardRow';
import HotelCard from '../components/HotelCard';
import { getCityBySlug } from '../config/cities';
import { getCityHeroImageUrl, getPlaceholderUrl } from '../utils/imageFallback';
import { filterHotelsWithImages } from '../utils/assetManifest';
import { useAssetManifest } from '../context/AssetManifestContext';
import { hotelsByCity } from '../api/client';
import styles from './City.module.css';

export default function City() {
  const { cityName } = useParams();
  const city = getCityBySlug(cityName);
  const displayName = city.name || cityName;
  const manifest = useAssetManifest();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    hotelsByCity(displayName)
      .then((r) => setHotels(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        setError(err.message || 'Failed to load');
        setHotels([]);
      })
      .finally(() => setLoading(false));
  }, [displayName]);

  const citySlug = city.slug || (displayName || '').toLowerCase().replace(/\s+/g, '-');
  const hotelsWithImages = filterHotelsWithImages(hotels, citySlug, manifest);

  const heroImage = getCityHeroImageUrl(city.slug);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.backLink}>← Back to home</Link>
      </nav>
      <section className={styles.hero}>
        <img
          src={heroImage}
          alt={displayName}
          className={styles.heroImg}
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderUrl(); }}
        />
        <div className={styles.heroOverlay} />
        <h1 className={styles.heroTitle}>{displayName}</h1>
      </section>

      <div className={`${styles.content} page-padding`}>
        {loading && <p className={styles.status}>Loading…</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <HorizontalCardRow title="Hotels">
            {hotelsWithImages.map((h) => (
              <HotelCard
                key={h._id}
                hotel={h}
                cityName={displayName}
                manifest={manifest}
              />
            ))}
          </HorizontalCardRow>
        )}
      </div>
    </div>
  );
}
