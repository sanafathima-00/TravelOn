import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CITIES } from '../config/cities';
import { getCityHeroImageUrl, getPlaceholderUrl } from '../utils/imageFallback';
import styles from './PopularCities.module.css';

export default function PopularCities() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.arrow} onClick={() => scroll('left')} aria-label="Previous">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className={styles.scroll} ref={scrollRef}>
        {CITIES.map((city) => (
          <Link
            key={city.slug}
            to={`/city/${city.slug}`}
            className={styles.card}
          >
            <div className={styles.imgWrap}>
              <img
                src={getCityHeroImageUrl(city.slug)}
                alt={city.name}
                onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderUrl(); }}
              />
            </div>
            <span className={styles.name}>{city.name}</span>
          </Link>
        ))}
      </div>
      <button type="button" className={styles.arrow} onClick={() => scroll('right')} aria-label="Next">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
