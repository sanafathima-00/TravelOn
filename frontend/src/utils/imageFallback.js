/**
 * Image URL helpers
 *
 * Structure:
 * /assets/cities/<city>/hotels/<slug>/1.jpg
 * /assets/cities/<city>/restaurants/<slug>/1.jpg
 * /assets/cities/<city>/hero.jpg
 *
 * Bangalore structured images:
 * /assets/cities/bangalore/hotels/1.jpg
 * /assets/cities/bangalore/local-eateries/1.jpg
 * etc.
 */

export function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, '')
    .replace(/[^\w-]/g, '')
    .trim();
}

export function getHotelImageUrl(hotel, cityName, manifest = null) {
  if (!hotel?.name || !cityName) return getPlaceholderUrl();

  const city = slugify(cityName);

  /* ===========================
     Bangalore uses indexed images
  =========================== */
  if (city === 'bangalore') {
    const HOTEL_ORDER = [
      'itc-gardenia',
      'the-leela-palace',
      'radisson-blu-atria',
      'oberoi',
      'taj-mg'
    ];

    const slug = slugify(hotel.name);
    const index = HOTEL_ORDER.indexOf(slug);

    if (index !== -1) {
      return `/assets/cities/bangalore/hotels/${index + 1}.jpg`;
    }
  }

  /* Default structure for other cities */
  const hotelSlug = slugify(hotel.name);
  const meta = manifest?.hotels?.[hotelSlug];
  const ext = (typeof meta === 'object' ? meta?.ext : meta) ?? '.jpg';

  return `/assets/cities/${city}/hotels/${hotelSlug}/1${ext}`;
}

export function getRestaurantImageUrl(restaurant, cityName, manifest = null) {
  if (!restaurant?.name || !cityName) return getPlaceholderUrl();

  const city = slugify(cityName);
  const restSlug = slugify(restaurant.name);
  const meta = manifest?.restaurants?.[restSlug];
  const ext = (typeof meta === 'object' ? meta?.ext : meta) ?? '.jpg';

  return `/assets/cities/${city}/restaurants/${restSlug}/1${ext}`;
}

export function getCityHeroImageUrl(citySlug) {
  if (!citySlug) return getPlaceholderUrl();

  const city = slugify(citySlug);
  return `/assets/cities/${city}/hero.jpg`;
}

export function getGalleryImageUrl(hotel, index = 1, manifest = null) {
  if (!hotel?.name || !hotel?.city) return getPlaceholderUrl();

  const city = slugify(hotel.city);

  /* Bangalore gallery (indexed) */
  if (city === 'bangalore') {
    return `/assets/cities/bangalore/hotels/${index}.jpg`;
  }

  const hotelSlug = slugify(hotel.name);
  const meta = manifest?.hotels?.[hotelSlug];
  const ext = (typeof meta === 'object' ? meta?.ext : meta) ?? '.jpg';

  return `/assets/cities/${city}/hotels/${hotelSlug}/${index}${ext}`;
}

export function getPlaceImageUrl(citySlug, type, slug, manifest = null, index = 1) {
  if (!citySlug || !type || !slug) return getPlaceholderUrl();

  const city = slugify(citySlug);

  const bucket =
    type === 'restaurant'
      ? 'restaurants'
      : type === 'place'
      ? 'places'
      : 'transport';

  const slugNorm = slugify(slug);
  const meta = manifest?.[city]?.[bucket]?.[slugNorm];
  const ext = (typeof meta === 'object' ? meta?.ext : meta) ?? '.jpg';

  return `/assets/cities/${city}/${bucket}/${slugNorm}/${index}${ext}`;
}

export function getPlaceImageCount(manifest, citySlug, type, slug) {
  if (!manifest || !citySlug || !slug) return 0;

  const slugNorm = slugify(slug);
  const city = slugify(citySlug);

  const bucket =
    type === 'restaurant'
      ? 'restaurants'
      : type === 'place'
      ? 'places'
      : 'transport';

  const meta = manifest[city]?.[bucket]?.[slugNorm];

  return typeof meta === 'object' ? meta?.count ?? 0 : 0;
}

export function getPlaceholderUrl() {
  return '/assets/placeholder.svg';
}

export function getBangaloreCategoryImage(category, index = 1) {
  const map = {
    worship: 'places-of-worship',
    eatery: 'local-eateries',
    interest: 'places-of-interest',
    shopping: 'shopping-streets'
  };

  const folder = map[category];
  if (!folder) return getPlaceholderUrl();

  const safeIndex = Number.isFinite(index) && index > 0 ? index : 1;

  return `/assets/cities/bangalore/${folder}/${safeIndex}.jpg`;
}
