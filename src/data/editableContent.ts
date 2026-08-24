import galleryJson from './galleryData.json';
import guideJson from './guideData.json';

export type GalleryItem = {
  image: string;
  width?: number;
  height?: number;
  caption?: string;
  description?: string;
  alt?: string;
};

export type PohangPlace = {
  title: string;
  image: string;
  description: string;
  tip?: string;
  tags?: string[];
  link?: string;
};

export type PohangFolder = {
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  items: PohangPlace[];
};

export const galleryItems: GalleryItem[] = galleryJson;
export const guideFolders: PohangFolder[] = guideJson;
