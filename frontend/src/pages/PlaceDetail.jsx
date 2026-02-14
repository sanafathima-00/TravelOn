import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useAssetManifest } from '../context/AssetManifestContext';
import { getPlaceImageUrl, getPlaceImageCount, getPlaceholderUrl, slugify } from '../utils/imageFallback';
import { getCityBySlug } from '../config/cities';
import { localPostsByCity } from '../api/client';
import LocalPostCard from '../components/LocalPostCard';
import styles from './PlaceDetail.module.css';

function slugToTitle(s) {
  if (!s) return '';
  return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function matchesSlug(post, slug) {
  if (!slug) return false;
  const kw = slug.toLowerCase().replace(/-/g, ' ');
  const parts = kw.split(/\s+/).filter(Boolean);
  const title = (post.title || '').toLowerCase();
  const tags = (post.tags || []).map((t) => String(t).toLowerCase());

  const check = (str) => str.includes(kw) || parts.some((p) => p.length > 2 && str.includes(p));
  return check(title) || tags.some(check);
}

export default function PlaceDetail() {
  const { city, type, slug } = useParams();
  const navigate = useNavigate();
  const manifest = useAssetManifest();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const citySlug = (city || '').toLowerCase().trim();
  const typeNorm = type === 'restaurant' ? 'restaurant' : type === 'place' ? 'place' : type === 'transport' ? 'transport' : 'place';
  const slugNorm = slugify(slug);
  const title = slugToTitle(slugNorm);

  const imageCount = getPlaceImageCount(manifest, citySlug, typeNorm, slugNorm);
  const images = imageCount > 0
    ? Array.from({ length: imageCount }, (_, i) => getPlaceImageUrl(citySlug, typeNorm, slugNorm, manifest, i + 1))
    : [getPlaceImageUrl(citySlug, typeNorm, slugNorm, manifest, 1)];
  const currentImage = images[galleryIndex] ?? getPlaceholderUrl();

  const cityDisplay = getCityBySlug(citySlug).name || citySlug;

  useEffect(() => {
    if (!citySlug) return;
    setLoading(true);
    localPostsByCity(cityDisplay)
      .then((r) => setPosts(Array.isArray(r.data) ? r.data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [citySlug]);

  const filteredPosts = posts.filter((p) => matchesSlug(p, slugNorm));

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </nav>

      <section className={styles.gallery}>
        <img
          src={currentImage}
          alt={title}
          className={styles.galleryImg}
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderUrl(); }}
        />
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
        <h1 className={styles.title}>{title}</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Local reviews</h2>
          {loading && <p className={styles.status}>Loading…</p>}
          {!loading && filteredPosts.length === 0 && (
            <p className={styles.empty}>No related local posts for this place.</p>
          )}
          {!loading && filteredPosts.length > 0 && (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <LocalPostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
