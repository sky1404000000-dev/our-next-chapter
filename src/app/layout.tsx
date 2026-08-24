import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { createWeddingMetadata } from '@/lib/weddingMetadata';

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

export const metadata: Metadata = {
  ...createWeddingMetadata('/'),
  formatDetection: {
    telephone: false
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
