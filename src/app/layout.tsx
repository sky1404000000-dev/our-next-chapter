import type { Metadata } from 'next';
import './globals.css';
import { weddingData } from '@/data/weddingData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: weddingData.metadata.title,
  description: weddingData.metadata.description,
  openGraph: {
    title: weddingData.metadata.title,
    description: weddingData.metadata.description,
    url: siteUrl,
    siteName: weddingData.metadata.title,
    type: 'website',
    images: [
      {
        url: weddingData.metadata.ogImage,
        width: 1200,
        height: 630,
        alt: weddingData.metadata.title
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: weddingData.metadata.title,
    description: weddingData.metadata.description,
    images: [weddingData.metadata.ogImage]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
