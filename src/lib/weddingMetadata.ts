import type { Metadata } from 'next';
import { weddingData } from '@/data/weddingData';

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl && !configuredUrl.includes('your-wedding-domain.com')) {
    return configuredUrl.replace(/\/$/, '');
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000';
}

export function createWeddingMetadata(pathname: '/' | '/with-love'): Metadata {
  const siteUrl = getSiteUrl();
  const pageUrl = new URL(pathname, `${siteUrl}/`).toString();
  const imageUrl = new URL(`${weddingData.metadata.ogImage}?v=20260824-share`, `${siteUrl}/`).toString();

  return {
    metadataBase: new URL(siteUrl),
    title: weddingData.metadata.title,
    description: weddingData.metadata.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: weddingData.metadata.title,
      description: weddingData.metadata.description,
      url: pageUrl,
      siteName: weddingData.metadata.title,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1080,
          alt: weddingData.metadata.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: weddingData.metadata.title,
      description: weddingData.metadata.description,
      images: [imageUrl]
    }
  };
}
