// Converts <sourceDir>/<id>.png photos into public/images/costumes/<id>.webp.
// Usage: node scripts/optimize-photos.mjs <sourceDir>
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const MAX_SIZE = 640;
const MAX_BYTES = 120 * 1024;

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Usage: node scripts/optimize-photos.mjs <sourceDir>');
  process.exit(1);
}

const outDir = path.resolve('public/images/costumes');
await mkdir(outDir, { recursive: true });

const files = (await readdir(sourceDir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
for (const file of files) {
  const id = path.parse(file).name;
  const out = path.join(outDir, `${id}.webp`);
  const src = path.join(sourceDir, file);
  // Square side never exceeds the source, so small photos are cropped, not enlarged.
  const { width, height } = await sharp(src).metadata();
  const side = Math.min(MAX_SIZE, width, height);
  // Step quality down only if a photo would exceed the per-file budget.
  for (let quality = 80; quality >= 50; quality -= 10) {
    const { size } = await sharp(src)
      .resize(side, side, { fit: 'cover' })
      .webp({ quality })
      .toFile(out);
    if (size <= MAX_BYTES || quality === 50) {
      console.log(`${id}.webp  ${(size / 1024).toFixed(1)} KB  q${quality}`);
      break;
    }
  }
}
console.log(`${files.length} photos written to ${outDir}`);
