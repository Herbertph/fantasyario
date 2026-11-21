import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { COSTUMES_CATALOG } from './catalog';

// public/ is copied verbatim into dist/, so these budgets also hold for the built site.
const PHOTO_DIR = path.resolve(__dirname, '../../public/images/costumes');
const webps = readdirSync(PHOTO_DIR).filter((f) => f.endsWith('.webp'));

describe('costume photos', () => {
  it('AC-7: every catalog id has exactly one WebP and there are no orphans', () => {
    expect(webps.map((f) => f.replace(/\.webp$/, '')).sort()).toEqual(COSTUMES_CATALOG.map((c) => c.id).sort());
  });

  it('AC-7: every photo is at most 120 KB', () => {
    const oversized = webps.filter((f) => statSync(path.join(PHOTO_DIR, f)).size > 120 * 1024);
    expect(oversized).toEqual([]);
  });

  it('AC-8: the photo folder is at most 4 MB', () => {
    const total = webps.reduce((sum, f) => sum + statSync(path.join(PHOTO_DIR, f)).size, 0);
    expect(total).toBeLessThanOrEqual(4 * 1024 * 1024);
  });
});
