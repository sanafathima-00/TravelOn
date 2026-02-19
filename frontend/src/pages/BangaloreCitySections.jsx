import { useEffect, useState } from 'react';
import HorizontalCardRow from '../components/HorizontalCardRow';
import HotelCard from '../components/HotelCard';
import BangalorePlaceCard from '../components/BangalorePlaceCard';
import { bangalorePlaces } from '../api/client';
import styles from './BangaloreCitySections.module.css';

const FIVE_STAR_HOTELS = [
  'ITC Gardenia',
  'The Leela Palace',
  'Radisson Blu Atria',
  'Oberoi',
  'Taj MG'
];

const CATEGORIES = [
  { key: 'worship', title: 'Places of Worship' },
  { key: 'eatery', title: 'Local Eateries' },
  { key: 'interest', title: 'Places of Interest' },
  { key: 'shopping', title: 'Shopping Streets' }
];

export default function BangaloreCitySections({ hotels, cityName, manifest }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all(CATEGORIES.map(c => bangalorePlaces(c.key)))
      .then((responses) => {
        if (cancelled) return;
        const result = {};
        responses.forEach((r, i) => {
          result[CATEGORIES[i].key] = Array.isArray(r.data) ? r.data : [];
        });
        setData(result);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, []);

  const fiveStarHotels = (hotels || []).filter((h) =>
    FIVE_STAR_HOTELS.some((name) =>
      h.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  return (
    <div className={styles.wrapper}>
      {loading && <p className={styles.status}>Loading Bangalore highlights…</p>}

      {!loading && (
        <>
          {CATEGORIES.map(({ key, title }) => (
            <section key={key} className={styles.section}>
              <h2 className={styles.sectionTitle}>{title}</h2>
              <HorizontalCardRow>
                {(data[key] || []).map((place, idx) => (
                  <BangalorePlaceCard
                    key={place._id}
                    place={place}
                    index={idx}
                  />
                ))}
              </HorizontalCardRow>
            </section>
          ))}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Five Star Hotels</h2>
            <HorizontalCardRow>
              {fiveStarHotels.map((h) => (
                <HotelCard
                  key={h._id}
                  hotel={h}
                  cityName={cityName}
                  manifest={manifest}
                />
              ))}
            </HorizontalCardRow>
            </section>
        </>
      )}
    </div>
  );
}
