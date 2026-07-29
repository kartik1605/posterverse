#!/usr/bin/env node
/**
 * Builds a Shopify product-import CSV from the Posterverse catalogue in
 * js/data.js — original artwork only.
 *
 *   node scripts/build-shopify-import.js
 *   -> shopify_import.csv
 *
 * Import via Shopify admin -> Products -> Import. Shopify fetches each
 * Image Src over HTTP during import, so the image URLs must be publicly
 * reachable (they point at the public GitHub repo).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'shopify_import.csv');

// Raw GitHub serves the committed artwork; Shopify pulls from here on import.
const IMAGE_BASE = 'https://raw.githubusercontent.com/kartik1605/posterverse/main/';

const VENDOR = 'Posterverse';

const TYPE_BY_CATEGORY = {
  stickers: 'Sticker',
  posters: 'Poster',
  cards: 'Greeting Card',
  labels: 'Brand Label',
};

/* ---------- load the catalogue ---------- */
function loadCatalog() {
  const src = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  // data.js is plain declarations with no DOM access, so it evaluates as-is.
  vm.runInContext(src + '\n;({ PRODUCTS, VIBES, CATEGORY_META });', sandbox);
  return vm.runInContext('({ PRODUCTS, VIBES, CATEGORY_META })', sandbox);
}

/* ---------- helpers ---------- */

// Shopify will not accept SVG product images; the committed PNG renders are
// used instead. Raster sources pass through untouched.
function imageUrlFor(product) {
  let rel = product.img;
  if (rel.endsWith('.svg')) {
    rel = 'assets/img/products-png/' + path.basename(rel, '.svg') + '.png';
  }
  return IMAGE_BASE + rel;
}

function tagsFor(product, vibes) {
  const tags = [];
  if (product.vibe) tags.push(product.vibe); // filter chips match on this
  tags.push(product.category);
  if (product.vibe && vibes[product.vibe]) tags.push(vibes[product.vibe].label);
  if (product.badge === 'hot') tags.push('Bestseller');
  if (product.badge === 'new') tags.push('New Launch');
  tags.push('Original Design', 'Made in India');
  return [...new Set(tags)].join(', ');
}

// Expand an options object into Shopify's Option1/Option2 variant rows.
function variantsFor(product) {
  const entries = Object.entries(product.options || {});
  if (!entries.length) return [{ names: [], values: [] }];

  const [n1, v1] = entries[0];
  if (entries.length === 1) {
    return v1.map((v) => ({ names: [n1], values: [v] }));
  }
  const [n2, v2] = entries[1];
  const out = [];
  for (const a of v1) for (const b of v2) out.push({ names: [n1, n2], values: [a, b] });
  return out;
}

function csvCell(value) {
  const s = value === undefined || value === null ? '' : String(value);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/* ---------- build ---------- */
const HEADERS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
  'Variant SKU', 'Variant Inventory Tracker', 'Variant Inventory Qty',
  'Variant Inventory Policy', 'Variant Fulfillment Service',
  'Variant Price', 'Variant Compare At Price',
  'Variant Requires Shipping', 'Variant Taxable',
  'Image Src', 'Image Position', 'Image Alt Text', 'Status',
];

function build() {
  const { PRODUCTS, VIBES } = loadCatalog();
  const rows = [HEADERS];
  let variantCount = 0;

  for (const p of PRODUCTS) {
    const handle = p.shopifyHandle || p.id;
    const variants = variantsFor(p);

    variants.forEach((variant, i) => {
      const first = i === 0;
      const sku =
        handle.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 20) +
        (variant.values.length ? '-' + variant.values.map((v) => v.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()).join('-') : '');

      rows.push([
        handle,
        first ? p.name : '',
        first ? `<p>${p.desc}</p>` : '',
        first ? VENDOR : '',
        first ? TYPE_BY_CATEGORY[p.category] || '' : '',
        first ? tagsFor(p, VIBES) : '',
        first ? 'TRUE' : '',
        variant.names[0] || (first ? 'Title' : ''),
        variant.values[0] || (first ? 'Default Title' : ''),
        variant.names[1] || '',
        variant.values[1] || '',
        sku,
        'shopify',
        100,
        'deny',
        'manual',
        p.price,
        p.mrp || '',
        'TRUE',
        'TRUE',
        // One image per product, attached to its first row.
        first ? imageUrlFor(p) : '',
        first ? 1 : '',
        first ? `${p.name} — Posterverse` : '',
        first ? 'active' : '',
      ]);
      variantCount++;
    });
  }

  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
  fs.writeFileSync(OUT, csv, 'utf8');

  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  products : ${PRODUCTS.length}`);
  console.log(`  variants : ${variantCount}`);
  console.log(`  columns  : ${HEADERS.length}`);

  // Fail loudly if any referenced image is missing from disk — a broken
  // Image Src silently imports a product with no picture.
  const missing = [];
  for (const p of PRODUCTS) {
    const rel = imageUrlFor(p).replace(IMAGE_BASE, '');
    if (!fs.existsSync(path.join(ROOT, rel))) missing.push(rel);
  }
  if (missing.length) {
    console.error(`\n  ${missing.length} image file(s) missing on disk:`);
    missing.forEach((m) => console.error('    - ' + m));
    process.exitCode = 1;
  } else {
    console.log(`  images   : all ${PRODUCTS.length} present on disk`);
  }
}

build();
