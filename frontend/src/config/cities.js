/**
 * Static city config. Backend has no City model.
 * Use for: Popular Cities, city hero images, search suggestions.
 */
export const CITIES = [
  { name: 'Bangalore', slug: 'bangalore' },
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Chennai', slug: 'chennai' },
  { name: 'Hyderabad', slug: 'hyderabad' }
];

export function getCityBySlug(slug) {
  const normalized = (slug || '').toLowerCase().trim();
  return CITIES.find(c => c.slug === normalized) || { name: slug, slug: normalized };
}

export function getCityImagePath(citySlug) {
  return `/assets/cities/${citySlug}/hero.jpg`;
}

export function getFallbackImagePath() {
  return '/assets/placeholder.svg';
}
