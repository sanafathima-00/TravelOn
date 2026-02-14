/**
 * Fetches the asset manifest for dynamic filtering of hotels/restaurants.
 * Only items with image folders are shown in the UI.
 */

let cachedManifest = null;

export async function fetchAssetManifest() {
  if (cachedManifest) return cachedManifest;
  try {
    const res = await fetch('/assets/cities/manifest.json');
    if (!res.ok) return {};
    cachedManifest = await res.json();
    return cachedManifest;
  } catch {
    return {};
  }
}

export function getAssetManifestSync() {
  return cachedManifest || {};
}

/**
 * Filter hotels to only those that have an image folder in assets.
 */
export function filterHotelsWithImages(hotels, citySlug, manifest) {
  if (!Array.isArray(hotels)) return [];
  if (!manifest || !manifest[citySlug]?.hotels) return [];
  const slugs = Object.keys(manifest[citySlug].hotels);
  return hotels.filter((h) => slugs.includes(slugify(h?.name)));
}

/**
 * Filter restaurants to only those that have an image folder in assets.
 */
export function filterRestaurantsWithImages(restaurants, citySlug, manifest) {
  if (!Array.isArray(restaurants)) return [];
  if (!manifest || !manifest[citySlug]?.restaurants) return [];
  const slugs = Object.keys(manifest[citySlug].restaurants);
  return restaurants.filter((r) => slugs.includes(slugify(r?.name)));
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, '')
    .replace(/[^\w-]/g, '')
    .trim();
}
