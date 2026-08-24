import type { Metadata } from 'next';
import WeddingPage from '@/features/wedding/WeddingPage';
import { createWeddingMetadata } from '@/lib/weddingMetadata';

export const metadata: Metadata = createWeddingMetadata('/');

export default function Home() {
  return <WeddingPage showAccount={false} />;
}
