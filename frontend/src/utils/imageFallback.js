/**
 * Image URL helpers for new structure:
 * /assets/cities/<city>/hotels/<slug>/1.jpg
 * /assets/cities/<city>/restaurants/<slug>/1.jpg
 * /assets/cities/<city>/hero.jpg
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
  const hotelSlug = slugify(hotel.name);
  const meta = manifest?.hotels?.[hotelSlug];
  const ext = (typeof meta === 'object' ? meta?.ext : meta) ?? '.jpg';

  return `/assets/cities/${city}/hotels/${hotelSlug}/${index}${ext}`;
}

/**
 * Get image URL for place/restaurant/transport detail pages.
 * Path: /assets/cities/<city>/<type>/<slug>/<index>.<ext>
 * manifest: { bangalore: { restaurants: {...} }, ... }
 */
export function getPlaceImageUrl(citySlug, type, slug, manifest = null, index = 1) {
  if (!citySlug || !type || !slug) return getPlaceholderUrl();

  const city = slugify(citySlug);
  const slugNorm = slugify(slug);
  const bucket = type === 'restaurant' ? 'restaurants' : type === 'place' ? 'places' : 'transport';
  const meta = manifest?.[city]?.[bucket]?.[slugNorm];
  const ext = (typeof meta === 'object' ? meta?.ext : meta) ?? '.jpg';

  return `/assets/cities/${city}/${bucket}/${slugNorm}/${index}${ext}`;
}

/**
 * Get image count for place from manifest (for gallery).
 * manifest is the full manifest { bangalore: { restaurants: {...} }, ... }
 */
export function getPlaceImageCount(manifest, citySlug, type, slug) {
  if (!manifest || !citySlug || !slug) return 0;

  const slugNorm = slugify(slug);
  const city = slugify(citySlug);
  const bucket = type === 'restaurant' ? 'restaurants' : type === 'place' ? 'places' : 'transport';
  const meta = manifest[city]?.[bucket]?.[slugNorm];

  return typeof meta === 'object' ? meta?.count ?? 0 : 0;
}

export function getPlaceholderUrl() {
  return '/assets/placeholder.svg';
}
