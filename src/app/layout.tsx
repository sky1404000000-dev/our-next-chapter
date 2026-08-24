import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { weddingData } from '@/data/weddingData';

const koPubBatang = localFont({
  src: [
    {
      path: '../../node_modules/@fontpkg/ko-pub-world-batang/KoPubWorld Batang Light.ttf',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../../node_modules/@fontpkg/ko-pub-world-batang/KoPubWorld Batang Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../node_modules/@fontpkg/ko-pub-world-batang/KoPubWorld Batang Bold.ttf',
      weight: '700',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-kopub-batang'
});

const greatVibes = localFont({
  src: '../../node_modules/@fontsource/great-vibes/files/great-vibes-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-great-vibes'
});

const specialElite = localFont({
  src: '../../node_modules/@fontsource/special-elite/files/special-elite-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-special-elite'
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');
const ogImageUrl = `${weddingData.metadata.ogImage}?v=20260824-share`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: weddingData.metadata.title,
  description: weddingData.metadata.description,
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: weddingData.metadata.title,
    description: weddingData.metadata.description,
    url: siteUrl,
    siteName: weddingData.metadata.title,
    type: 'website',
    images: [
      {
        url: ogImageUrl,
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
    images: [ogImageUrl]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${koPubBatang.variable} ${greatVibes.variable} ${specialElite.variable}`}>
      <body>{children}</body>
    </html>
  );
}
