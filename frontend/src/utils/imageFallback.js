/**
 * Simplified Image URL helpers
 * Structure:
 * /assets/bangalore/hotels/1.jpg
 * /assets/bangalore/local-eateries/1.jpg
 * /assets/bangalore/places-of-interest/1.jpg
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

export function getPlaceholderUrl() {
  return '/assets/placeholder.svg';
}

/* ===============================
   HOTEL IMAGE (Bangalore only)
================================ */

export function getHotelImageUrl(hotel, cityName) {
  if (!hotel?.name || !cityName) return getPlaceholderUrl();

  const city = slugify(cityName);

  // Only Bangalore uses indexed local images
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
      return `/assets/bangalore/hotels/${index + 1}.jpg`;
    }
  }

  return getPlaceholderUrl();
}

/* ===============================
   BANGALORE CATEGORY IMAGES
================================ */

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

  return `/assets/bangalore/${folder}/${safeIndex}.jpg`;
}
