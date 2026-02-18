/**
 * Reorganize assets into:
 * public/assets/cities/<city>/hero.jpg
 * public/assets/cities/<city>/hotels/<slug>/1.jpg, 2.jpg...
 * public/assets/cities/<city>/restaurants/<slug>/1.jpg, 2.jpg...
 *
 * Dest slug = slugify(seed name) so frontend can resolve.
 * Source folder = current asset folder name.
 * Extensions preserved per user rule.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS_ROOT = path.join(__dirname, '..', 'assets');
const TARGET_ROOT = path.join(__dirname, '..', 'public', 'assets', 'cities');

// Map: source folder (in assets) → dest slug (slugify(seed name))
const HOTEL_MAPPING = {
  Bangalore: [
    { source: 'itc-gardenia', slug: 'itc-gardenia' },
    { source: 'leela-palace', slug: 'the-leela-palace' },
    { source: 'radisson-atria', slug: 'radisson-blu-atria' }
  ],
  Delhi: [
    { source: 'imperial', slug: 'the-imperial' },
    { source: 'taj-palace', slug: 'taj-palace' }
  ],
  Mumbai: [
    { source: 'taj-mahal', slug: 'taj-palace-mumbai' },
    { source: 'st-regis', slug: 'the-st-regis' },
    { source: 'trident-np', slug: 'trident-nariman-point' },
    { source: 'oberoi-mumbai', slug: 'the-oberoi' }
  ],
  Chennai: [
    { source: 'itc-grand-chola', slug: 'itc-grand-chola' },
    { source: 'leela-chennai', slug: 'the-leela-palace' },
    { source: 'radisson-grt', slug: 'radisson-blu-grt' },
    { source: 'taj-coromandel', slug: 'taj-coromandel' },
    { source: 'hyatt-regency', slug: 'hyatt-regency' }
  ],
  Hyderabad: [
    { source: 'taj-falaknuma', slug: 'taj-falaknuma-palace' },
    { source: 'park-hyderabad', slug: 'park-hyatt-hyderabad' },
    { source: 'itc-kohenur', slug: 'itc-kohenur' },
    { source: 'novotel-hicc', slug: 'novotel-hyderabad' }
  ]
};

const RESTAURANT_MAPPING = {
  Bangalore: [
    { source: 'meghana-foods', slug: 'meghana-foods' }
  ],
  Delhi: [
    { source: 'karims-restaurant', slug: 'karims' },
    { source: 'bukhara-restaurant', slug: 'bukhara' }
  ],
  Mumbai: [
    { source: 'britannia-restaurant', slug: 'britannia-co' }
  ],
  Chennai: [
    { source: 'annalakshmi-restaurant', slug: 'annalakshmi' },
    { source: 'murugan-idli-shop', slug: 'murugan-idli-shop' }
  ],
  Hyderabad: [
    { source: 'bawarchi-restaurant', slug: 'bawarchi' },
    { source: 'paradise-biryani', slug: 'paradise-biryani' }
  ]
};

// Landmark folder to use for hero if no hero.jpg exists
const LANDMARK_FOR_HERO = {
  Bangalore: 'cubbon-park',
  Delhi: 'india-gate',
  Mumbai: 'gateway-of-india',
  Chennai: 'marina-beach',
  Hyderabad: 'charminar'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const exts = ['.jpg', '.jpeg', '.png', '.webp'];
  return fs.readdirSync(dir)
    .filter((f) => exts.some((e) => f.toLowerCase().endsWith(e)))
    .sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const bNum = parseInt(b.replace(/\D/g, ''), 10) || 0;
      if (aNum !== bNum) return aNum - bNum;
      return a.localeCompare(b);
    });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function main() {
  const cityMap = {
    bangalore: 'Bangalore',
    chennai: 'Chennai',
    delhi: 'Delhi',
    hyderabad: 'Hyderabad',
    mumbai: 'Mumbai'
  };

  for (const [cityKey, displayName] of Object.entries(cityMap)) {
    const citySrc = path.join(ASSETS_ROOT, cityKey);
    const cityDst = path.join(TARGET_ROOT, cityKey);

    if (!fs.existsSync(citySrc)) continue;

    ensureDir(path.join(cityDst, 'hotels'));
    ensureDir(path.join(cityDst, 'restaurants'));

    // 1. Hero
    const heroSrc = path.join(citySrc, 'hero.jpg');
    if (fs.existsSync(heroSrc)) {
      copyFile(heroSrc, path.join(cityDst, 'hero.jpg'));
    } else {
      const lmFolder = LANDMARK_FOR_HERO[displayName];
      if (lmFolder) {
        const lmDir = path.join(citySrc, lmFolder);
        const images = getImageFiles(lmDir);
        if (images.length > 0) {
          const ext = path.extname(images[0]);
          copyFile(path.join(lmDir, images[0]), path.join(cityDst, 'hero' + ext));
        }
      }
    }

    // 2. Hotels
    const hotelMap = HOTEL_MAPPING[displayName] || [];
    for (const { source, slug } of hotelMap) {
      const srcDir = path.join(citySrc, source);
      if (!fs.existsSync(srcDir)) continue;
      const images = getImageFiles(srcDir);
      const destDir = path.join(cityDst, 'hotels', slug);
      ensureDir(destDir);
      images.forEach((img, i) => {
        const ext = path.extname(img);
        copyFile(path.join(srcDir, img), path.join(destDir, `${i + 1}${ext}`));
      });
    }

    // 3. Restaurants
    const restMap = RESTAURANT_MAPPING[displayName] || [];
    for (const { source, slug } of restMap) {
      const srcDir = path.join(citySrc, source);
      if (!fs.existsSync(srcDir)) continue;
      const images = getImageFiles(srcDir);
      const destDir = path.join(cityDst, 'restaurants', slug);
      ensureDir(destDir);
      images.forEach((img, i) => {
        const ext = path.extname(img);
        copyFile(path.join(srcDir, img), path.join(destDir, `${i + 1}${ext}`));
      });
    }
  }

  // Root assets
  const publicAssets = path.join(__dirname, '..', 'public', 'assets');
  ensureDir(publicAssets);
  for (const f of ['logo.png', 'placeholder.svg', 'Hero.jpg']) {
    const p = path.join(ASSETS_ROOT, f);
    if (fs.existsSync(p)) {
      copyFile(p, path.join(publicAssets, path.basename(f)));
    }
  }

  // Ensure placeholder exists
  const phPath = path.join(publicAssets, 'placeholder.svg');
  if (!fs.existsSync(phPath)) {
    const phSrc = path.join(__dirname, '..', 'public', 'assets', 'placeholder.svg');
    if (fs.existsSync(phSrc)) {
      copyFile(phSrc, phPath);
    }
  }

  // Write manifest of available hotel/restaurant slugs per city (for dynamic filtering)
  // Also records first image extension per slug for correct URL
  const manifest = {};
  for (const [cityKey] of Object.entries(cityMap)) {
    const cityDst = path.join(TARGET_ROOT, cityKey);
    if (!fs.existsSync(cityDst)) continue;
    manifest[cityKey] = { hotels: {}, restaurants: {} };
    const hotelsDir = path.join(cityDst, 'hotels');
    if (fs.existsSync(hotelsDir)) {
      for (const slug of fs.readdirSync(hotelsDir)) {
        const slugPath = path.join(hotelsDir, slug);
        if (!fs.statSync(slugPath).isDirectory()) continue;
        const imgs = getImageFiles(slugPath);
        manifest[cityKey].hotels[slug] = {
          ext: imgs[0] ? path.extname(imgs[0]) : '.jpg',
          count: imgs.length
        };
      }
    }
    const restsDir = path.join(cityDst, 'restaurants');
    if (fs.existsSync(restsDir)) {
      for (const slug of fs.readdirSync(restsDir)) {
        const slugPath = path.join(restsDir, slug);
        if (!fs.statSync(slugPath).isDirectory()) continue;
        const imgs = getImageFiles(slugPath);
        manifest[cityKey].restaurants[slug] = {
          ext: imgs[0] ? path.extname(imgs[0]) : '.jpg',
          count: imgs.length
        };
      }
    }
  }
  fs.writeFileSync(
    path.join(publicAssets, 'cities', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('Reorganization complete. Structure in public/assets/cities/');
}

main();
