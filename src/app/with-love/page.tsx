import type { Metadata } from 'next';
import WeddingPage from '@/features/wedding/WeddingPage';
import { createWeddingMetadata } from '@/lib/weddingMetadata';

export const metadata: Metadata = createWeddingMetadata('/with-love');

export default function WithLovePage() {
  return <WeddingPage showAccount />;
}
