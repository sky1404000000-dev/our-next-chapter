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
    title: weddingData.share.title,
    description: weddingData.share.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: weddingData.share.title,
      description: weddingData.share.description,
      url: pageUrl,
      siteName: weddingData.share.title,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 540,
          alt: weddingData.share.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: weddingData.share.title,
      description: weddingData.share.description,
      images: [imageUrl]
    }
  };
}
