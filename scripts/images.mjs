#!/usr/bin/env node
/**
 * Image pipeline for Rare Cottages (see docs/IMAGE-HANDOFF.md).
 *
 *   npm run images                     convert every source in images-src/
 *   npm run images -- riverbend        only sources whose name contains "riverbend"
 *   npm run images -- --placeholders   also draw placeholders for shot-list images with no file yet
 *   npm run images -- --check          list shot-list images still missing or on placeholders (no writes)
 *
 * Source files:  images-src/<name>.<shape>.<png|jpg|jpeg|webp|avif>
 *                e.g. images-src/sample-riverbend-villa.wide.png
 * Shapes:        card   4:3     -> public/images/<name>-card-480.webp,   <name>-card-900.webp
 *                wide   ~2.05:1 -> public/images/<name>-wide-800.webp,   <name>-wide-1400.webp
 *                square 1:1     -> public/images/<name>-square-480.webp, <name>-square-900.webp
 * Crops use sharp's "attention" strategy, so the most interesting part of the frame is kept.
 */
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'images-src');
const OUT = path.join(ROOT, 'public', 'images');
const SHOTLIST = path.join(ROOT, 'docs', 'image-shotlist.json');
/** Which outputs are still placeholders; `--check` reports them. */
const PLACEHOLDER_LOG = path.join(ROOT, 'docs', 'image-placeholders.json');

const SIZES = {
  card: [
    [480, 360],
    [900, 675],
  ],
  wide: [
    [800, 390],
    [1400, 682],
  ],
  square: [
    [480, 480],
    [900, 900],
  ],
};

const SERVICE_COLOURS = {
  night: ['#05ae0d', '#033d08'],
  hourly: ['#f2b30c', '#5c4100'],
  party: ['#0c76fe', '#06245a'],
  event: ['#f10f10', '#4a0708'],
  brand: ['#3a3a3a', '#0a0a0a'],
};

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith('--'));
const wantPlaceholders = args.includes('--placeholders');
const checkOnly = args.includes('--check');

const outFile = (name, shape, w) => path.join(OUT, `${name}-${shape}-${w}.webp`);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function convertSources(placeholders) {
  if (!existsSync(SRC)) return 0;
  const files = (await readdir(SRC)).filter((f) => /^[a-z0-9-]+\.(card|wide|square)\.(png|jpe?g|webp|avif)$/i.test(f));
  let done = 0;
  for (const file of files) {
    const [name, shape] = file.split('.');
    if (filter && !name.includes(filter)) continue;
    const input = path.join(SRC, file);
    const meta = await sharp(input).metadata();
    const [maxW, maxH] = SIZES[shape].at(-1);
    if ((meta.width ?? 0) < maxW || (meta.height ?? 0) < maxH) {
      console.warn(`! ${file}: ${meta.width}x${meta.height} is smaller than ${maxW}x${maxH}; it will be upscaled`);
    }
    for (const [w, h] of SIZES[shape]) {
      await sharp(input)
        .rotate()
        .resize(w, h, { fit: 'cover', position: sharp.strategy.attention })
        .webp({ quality: 80, effort: 6 })
        .toFile(outFile(name, shape, w));
    }
    delete placeholders[`${name}.${shape}`];
    console.log(`✓ ${file} -> ${SIZES[shape].map(([w]) => `${name}-${shape}-${w}.webp`).join(', ')}`);
    done++;
  }
  return done;
}

function escapeXml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
}

function placeholderSvg(w, h, label, service) {
  const [a, b] = SERVICE_COLOURS[service] ?? SERVICE_COLOURS.brand;
  const big = Math.round(Math.min(w, h) * 0.075);
  const small = Math.round(big * 0.5);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="${w * 0.06}" y="${h * 0.1}" width="${w * 0.88}" height="${h * 0.8}" rx="${big}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-dasharray="10 10"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="Inter, 'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="${big}" fill="#fff">${escapeXml(label)}</text>
  <text x="50%" y="59%" text-anchor="middle" font-family="Inter, 'DejaVu Sans', Arial, sans-serif" font-size="${small}" fill="#fff" fill-opacity=".8">Sample image · replace with the Gemini render</text>
</svg>`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const shotlist = await readJson(SHOTLIST, { images: [], optional: [] });
  const placeholders = await readJson(PLACEHOLDER_LOG, {});
  const required = shotlist.images ?? [];

  if (checkOnly) {
    const todo = [];
    for (const img of required) {
      const key = `${img.name}.${img.shape}`;
      const exists = SIZES[img.shape].every(([w]) => existsSync(outFile(img.name, img.shape, w)));
      if (!exists) todo.push(`${key}  (missing)`);
      else if (placeholders[key]) todo.push(`${key}  (placeholder)`);
    }
    console.log(todo.length ? `Still to generate (${todo.length}):\n  ${todo.join('\n  ')}` : 'All shot-list images are real renders.');
    return;
  }

  const converted = await convertSources(placeholders);

  let drawn = 0;
  if (wantPlaceholders) {
    for (const img of required) {
      if (filter && !img.name.includes(filter)) continue;
      const missing = SIZES[img.shape].some(([w]) => !existsSync(outFile(img.name, img.shape, w)));
      if (!missing) continue;
      for (const [w, h] of SIZES[img.shape]) {
        await sharp(Buffer.from(placeholderSvg(w, h, img.label, img.service)))
          .webp({ quality: 82 })
          .toFile(outFile(img.name, img.shape, w));
      }
      placeholders[`${img.name}.${img.shape}`] = true;
      drawn++;
    }
  }

  const sorted = Object.fromEntries(Object.keys(placeholders).sort().map((k) => [k, true]));
  await writeFile(PLACEHOLDER_LOG, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`Done: ${converted} converted, ${drawn} placeholders drawn, ${Object.keys(sorted).length} placeholders remaining.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
