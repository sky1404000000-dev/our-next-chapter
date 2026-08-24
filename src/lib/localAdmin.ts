import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { GalleryItem, PohangFolder } from '@/data/editableContent';

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, 'public');

export const galleryDataPath = path.join(projectRoot, 'src', 'data', 'galleryData.json');
export const guideDataPath = path.join(projectRoot, 'src', 'data', 'guideData.json');

export function isLocalAdminEnabled() {
  return process.env.NODE_ENV === 'development';
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isGalleryData(value: unknown): value is GalleryItem[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    return isString(candidate.image)
      && (candidate.caption === undefined || isString(candidate.caption))
      && (candidate.description === undefined || isString(candidate.description))
      && (candidate.alt === undefined || isString(candidate.alt));
  });
}

export function isGuideData(value: unknown): value is PohangFolder[] {
  return Array.isArray(value) && value.every((folder) => {
    if (!folder || typeof folder !== 'object') return false;
    const candidate = folder as Record<string, unknown>;
    if (!isString(candidate.title) || !isString(candidate.subtitle) || !isString(candidate.color) || !isString(candidate.accent)) {
      return false;
    }
    if (!Array.isArray(candidate.items)) return false;

    return candidate.items.every((item) => {
      if (!item || typeof item !== 'object') return false;
      const place = item as Record<string, unknown>;
      return isString(place.title)
        && isString(place.image)
        && isString(place.description)
        && (place.tip === undefined || isString(place.tip))
        && (place.link === undefined || isString(place.link))
        && (place.tags === undefined || (Array.isArray(place.tags) && place.tags.every(isString)));
    });
  });
}

export async function writeJson(filePath: string, value: unknown) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function resolveManagedImage(imagePath: string) {
  const isManaged = imagePath.startsWith('/images/gallery/') || imagePath.startsWith('/images/guide/places/');
  if (!isManaged) return null;

  const resolved = path.resolve(publicRoot, imagePath.replace(/^\/+/, ''));
  const relative = path.relative(publicRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return resolved;
}

export async function removeUnusedImages(paths: string[], usedImages: Set<string>) {
  for (const imagePath of new Set(paths)) {
    if (usedImages.has(imagePath)) continue;
    const resolved = resolveManagedImage(imagePath);
    if (!resolved) continue;
    await fs.rm(resolved, { force: true });
  }
}
