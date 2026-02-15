/**
 * Reorganize assets into:
 * public/assets/cities/<city>/hero.jpg
 * public/assets/cities/<city>/hotels/<slug>/1.jpg
 * public/assets/cities/<city>/restaurants/<slug>/1.jpg
 * public/assets/cities/<city>/places/<slug>/1.jpg
 * public/assets/cities/<city>/transport/<slug>/1.jpg
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS_ROOT = path.join(__dirname, '..', 'assets');
const TARGET_ROOT = path.join(__dirname, '..', 'public', 'assets', 'cities');

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
    .sort();
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
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

function processBucket(citySrc, cityDst, bucketName) {
  const srcDir = path.join(citySrc, bucketName);
  if (!fs.existsSync(srcDir)) return;

  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    const fullPath = path.join(srcDir, item);
    if (!fs.statSync(fullPath).isDirectory()) continue;

    const slug = slugify(item);
    const destDir = path.join(cityDst, bucketName, slug);
    ensureDir(destDir);

    const images = getImageFiles(fullPath);
    images.forEach((img, i) => {
      const ext = path.extname(img);
      copyFile(
        path.join(fullPath, img),
        path.join(destDir, `${i + 1}${ext}`)
      );
    });
  }
}

function generateManifest() {
  const manifest = {};

  const cities = fs.readdirSync(TARGET_ROOT);
  for (const city of cities) {
    const cityPath = path.join(TARGET_ROOT, city);
    if (!fs.statSync(cityPath).isDirectory()) continue;

    manifest[city] = {
      hotels: {},
      restaurants: {},
      places: {},
      transport: {}
    };

    ['hotels', 'restaurants', 'places', 'transport'].forEach((bucket) => {
      const bucketDir = path.join(cityPath, bucket);
      if (!fs.existsSync(bucketDir)) return;

      const slugs = fs.readdirSync(bucketDir);
      for (const slug of slugs) {
        const slugPath = path.join(bucketDir, slug);
        if (!fs.statSync(slugPath).isDirectory()) continue;

        const imgs = getImageFiles(slugPath);
        manifest[city][bucket][slug] = {
          ext: imgs[0] ? path.extname(imgs[0]) : '.jpg',
          count: imgs.length
        };
      }
    });
  }

  fs.writeFileSync(
    path.join(TARGET_ROOT, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}

function main() {
  ensureDir(TARGET_ROOT);

  const cities = fs.readdirSync(ASSETS_ROOT);
  for (const cityFolder of cities) {
    const citySrc = path.join(ASSETS_ROOT, cityFolder);
    if (!fs.statSync(citySrc).isDirectory()) continue;

    const citySlug = slugify(cityFolder);
    const cityDst = path.join(TARGET_ROOT, citySlug);

    ensureDir(cityDst);
    ensureDir(path.join(cityDst, 'hotels'));
    ensureDir(path.join(cityDst, 'restaurants'));
    ensureDir(path.join(cityDst, 'places'));
    ensureDir(path.join(cityDst, 'transport'));

    // Hero
    const heroSrc = path.join(citySrc, 'hero.jpg');
    if (fs.existsSync(heroSrc)) {
      copyFile(heroSrc, path.join(cityDst, 'hero.jpg'));
    }

    processBucket(citySrc, cityDst, 'hotels');
    processBucket(citySrc, cityDst, 'restaurants');
    processBucket(citySrc, cityDst, 'places');
    processBucket(citySrc, cityDst, 'transport');
  }

  generateManifest();
  console.log('✅ Assets reorganized with places + transport support.');
}

main();
