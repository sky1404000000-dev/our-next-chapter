import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { GalleryItem, PohangFolder } from '@/data/editableContent';

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, 'public');
const imageBackupRoot = path.join(projectRoot, 'image-backups');

export const galleryDataPath = path.join(projectRoot, 'src', 'data', 'galleryData.json');
export const guideDataPath = path.join(projectRoot, 'src', 'data', 'guideData.json');

export function isLocalAdminEnabled() {
  return process.env.NODE_ENV === 'development';
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isGalleryData(value: unknown): value is GalleryItem[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    return isString(candidate.image)
      && (candidate.width === undefined || isNumber(candidate.width))
      && (candidate.height === undefined || isNumber(candidate.height))
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

function getManagedImageVariants(imagePath: string) {
  const resolved = resolveManagedImage(imagePath);
  if (!resolved) return [];

  const parsedPath = path.parse(imagePath);
  const publicDirectory = path.dirname(resolved);
  const backupDirectory = imagePath.startsWith('/images/gallery/')
    ? path.join(imageBackupRoot, 'gallery-original-jpg')
    : null;
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  return extensions.flatMap((extension) => {
    const candidates = [];
    candidates.push(path.join(publicDirectory, `${parsedPath.name}${extension}`));

    if (backupDirectory) {
      candidates.push(path.join(backupDirectory, `${parsedPath.name}${extension}`));
    }

    return candidates;
  });
}

export async function removeUnusedImages(paths: string[], usedImages: Set<string>) {
  for (const imagePath of new Set(paths)) {
    if (usedImages.has(imagePath)) continue;
    const variants = getManagedImageVariants(imagePath);

    await Promise.all(variants.map(async (variant) => {
      const relativeToPublic = path.relative(publicRoot, variant);
      const relativeToBackup = path.relative(imageBackupRoot, variant);
      const isInPublic = !relativeToPublic.startsWith('..') && !path.isAbsolute(relativeToPublic);
      const isInBackup = !relativeToBackup.startsWith('..') && !path.isAbsolute(relativeToBackup);

      if (!isInPublic && !isInBackup) return;

      const publicImagePath = isInPublic ? `/${relativeToPublic.split(path.sep).join('/')}` : null;
      if (publicImagePath && usedImages.has(publicImagePath)) return;

      await fs.rm(variant, { force: true });
    }));
  }
}
