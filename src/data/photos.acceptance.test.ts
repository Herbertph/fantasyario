import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { COSTUMES_CATALOG } from './catalog';

// QA acceptance tests for docs/specs/catalog-photos.md (see docs/test-cases/catalog-photos.md).
const PHOTO_DIR = path.resolve(__dirname, '../../public/images/costumes');
const files = readdirSync(PHOTO_DIR);

describe('costume photo files (QA)', () => {
  it('TC-7 (AC-7): one WebP per catalog id, no orphans, each at most 120 KB', () => {
    const webps = files.filter((f) => f.endsWith('.webp'));
    const ids = COSTUMES_CATALOG.map((c) => c.id);
    expect(webps).toHaveLength(54);
    expect(new Set(webps.map((f) => f.slice(0, -'.webp'.length)))).toEqual(new Set(ids));
    const oversized = webps
      .map((f) => [f, statSync(path.join(PHOTO_DIR, f)).size] as const)
      .filter(([, size]) => size > 120 * 1024);
    expect(oversized).toEqual([]);
  });

  it('TC-8 (AC-7): no source images or other files sit next to the WebP photos', () => {
    expect(files.filter((f) => !f.endsWith('.webp') && f !== '.gitkeep')).toEqual([]);
  });

  it('TC-9 (FR-1): every photo is a real WebP, square, at most 640 px', async () => {
    const wrong: string[] = [];
    for (const f of files.filter((name) => name.endsWith('.webp'))) {
      const { format, width, height } = await sharp(path.join(PHOTO_DIR, f)).metadata();
      if (format !== 'webp' || width !== height || width! > 640) wrong.push(`${f}: ${format} ${width}x${height}`);
    }
    expect(wrong).toEqual([]);
  });
});
