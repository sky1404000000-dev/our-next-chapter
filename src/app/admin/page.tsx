import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { galleryItems, guideFolders } from '@/data/editableContent';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: '청첩장 로컬 관리',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return <AdminDashboard initialGallery={galleryItems} initialGuide={guideFolders} />;
}
