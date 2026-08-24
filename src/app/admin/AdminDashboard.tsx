'use client';

import Image from 'next/image';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { GalleryItem, PohangFolder, PohangPlace } from '@/data/editableContent';
import styles from './AdminDashboard.module.css';

type AdminDashboardProps = {
  initialGallery: GalleryItem[];
  initialGuide: PohangFolder[];
};

type Tab = 'gallery' | 'guide';
type UploadedImage = {
  image: string;
  width?: number;
  height?: number;
};

const emptyPlace: PohangPlace = {
  title: '',
  image: '',
  description: '',
  tip: '',
  tags: [],
  link: ''
};

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function cleanOptionalFields(item: GalleryItem): GalleryItem {
  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => typeof value !== 'string' || value.trim())
  ) as GalleryItem;
}

export default function AdminDashboard({ initialGallery, initialGuide }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('gallery');
  const [gallery, setGallery] = useState(() => structuredClone(initialGallery));
  const [guide, setGuide] = useState(() => structuredClone(initialGuide));
  const [folderIndex, setFolderIndex] = useState(0);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const selectedFolder = guide[folderIndex];

  const totalPlaces = useMemo(() => guide.reduce((total, folder) => total + folder.items.length, 0), [guide]);

  useEffect(() => {
    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnBeforeLeave);
    return () => window.removeEventListener('beforeunload', warnBeforeLeave);
  }, [dirty]);

  const markDirty = () => {
    setDirty(true);
    setMessage('저장하지 않은 변경사항이 있습니다.');
  };

  const uploadImage = async (file: File, kind: 'gallery' | 'guide') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', kind);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const result = await response.json() as { image?: string; width?: number; height?: number; message?: string };
    if (!response.ok || !result.image) throw new Error(result.message || '사진 업로드에 실패했습니다.');
    return {
      image: result.image,
      width: result.width,
      height: result.height
    } satisfies UploadedImage;
  };

  const addGalleryImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setMessage('갤러리 사진을 프로젝트 폴더로 복사하고 있습니다.');
    try {
      const images = await Promise.all(Array.from(files).map((file) => uploadImage(file, 'gallery')));
      setGallery((current) => [
        ...current,
        ...images.map((uploadedImage, index) => ({
          ...uploadedImage,
          alt: `웨딩 갤러리 사진 ${current.length + index + 1}`
        }))
      ]);
      markDirty();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '사진 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const deleteGalleryItem = (index: number) => {
    const item = gallery[index];
    if (!window.confirm('이 사진을 갤러리에서 삭제할까요? 실제 파일은 저장할 때 정리됩니다.')) return;
    setGallery((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setDeletedImages((current) => [...current, item.image]);
    markDirty();
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    setGallery((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
    markDirty();
  };

  const updatePlace = (itemIndex: number, patch: Partial<PohangPlace>) => {
    setGuide((current) => current.map((folder, currentFolderIndex) => (
      currentFolderIndex === folderIndex
        ? { ...folder, items: folder.items.map((item, currentItemIndex) => currentItemIndex === itemIndex ? { ...item, ...patch } : item) }
        : folder
    )));
    markDirty();
  };

  const addPlace = () => {
    setGuide((current) => current.map((folder, currentFolderIndex) => (
      currentFolderIndex === folderIndex ? { ...folder, items: [...folder.items, structuredClone(emptyPlace)] } : folder
    )));
    markDirty();
  };

  const deletePlace = (itemIndex: number) => {
    const item = selectedFolder.items[itemIndex];
    if (!window.confirm(`‘${item.title || '새 장소'}’ 항목을 삭제할까요?`)) return;
    setGuide((current) => current.map((folder, currentFolderIndex) => (
      currentFolderIndex === folderIndex
        ? { ...folder, items: folder.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) }
        : folder
    )));
    if (item.image) setDeletedImages((current) => [...current, item.image]);
    markDirty();
  };

  const replacePlaceImage = async (itemIndex: number, file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setMessage('장소 사진을 프로젝트 폴더로 복사하고 있습니다.');
    try {
      const oldImage = selectedFolder.items[itemIndex].image;
      const { image } = await uploadImage(file, 'guide');
      updatePlace(itemIndex, { image });
      if (oldImage) setDeletedImages((current) => [...current, oldImage]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '사진 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    setGallery((current) => moveItem(current, index, direction));
    markDirty();
  };

  const movePlace = (index: number, direction: -1 | 1) => {
    setGuide((current) => current.map((folder, currentFolderIndex) => (
      currentFolderIndex === folderIndex ? { ...folder, items: moveItem(folder.items, index, direction) } : folder
    )));
    markDirty();
  };

  const saveAll = async () => {
    setSaving(true);
    setMessage('프로젝트 파일에 저장하고 있습니다.');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gallery: gallery.map(cleanOptionalFields),
          guide,
          deletedImages
        })
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || '저장에 실패했습니다.');
      setDeletedImages([]);
      setDirty(false);
      setMessage('저장 완료! 이제 청첩장을 확인한 뒤 Git에 커밋하면 됩니다.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.adminPage}>
      <header className={styles.header}>
        <div>
          <span>LOCAL WEDDING EDITOR</span>
          <h1>청첩장 관리</h1>
          <p>여기서 저장하면 VS Code의 데이터와 이미지 파일이 바로 변경됩니다.</p>
        </div>
        <button type="button" className={styles.saveButton} onClick={saveAll} disabled={!dirty || saving || uploading}>
          {saving ? <LoaderCircle className={styles.spinner} aria-hidden /> : dirty ? <Save aria-hidden /> : <Check aria-hidden />}
          {saving ? '저장 중' : dirty ? '변경사항 저장' : '저장 완료'}
        </button>
      </header>

      <div className={styles.status} role="status">
        <span className={dirty ? styles.dirtyDot : styles.savedDot} />
        {message || '수정할 메뉴를 선택해주세요.'}
      </div>

      <nav className={styles.tabs} aria-label="관리 메뉴">
        <button type="button" className={tab === 'gallery' ? styles.activeTab : ''} onClick={() => setTab('gallery')}>
          갤러리 <span>{gallery.length}</span>
        </button>
        <button type="button" className={tab === 'guide' ? styles.activeTab : ''} onClick={() => setTab('guide')}>
          포항 가이드 <span>{totalPlaces}</span>
        </button>
      </nav>

      {tab === 'gallery' ? (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>갤러리 사진</h2>
              <p>위아래 버튼으로 실제 청첩장에 표시되는 순서를 변경할 수 있어요.</p>
            </div>
            <label className={styles.uploadButton}>
              {uploading ? <LoaderCircle className={styles.spinner} aria-hidden /> : <ImagePlus aria-hidden />}
              사진 추가
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(event) => void addGalleryImages(event.target.files)} />
            </label>
          </div>

          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => (
              <article className={styles.galleryCard} key={`${item.image}-${index}`}>
                <div className={styles.imagePreview}>
                  <Image
                    src={item.image}
                    alt={item.alt || `갤러리 사진 ${index + 1}`}
                    width={440}
                    height={560}
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                  <span>{index + 1}</span>
                </div>
                <div className={styles.inlineActions}>
                  <button type="button" onClick={() => moveGalleryItem(index, -1)} disabled={index === 0} aria-label="앞으로 이동"><ArrowUp aria-hidden /></button>
                  <button type="button" onClick={() => moveGalleryItem(index, 1)} disabled={index === gallery.length - 1} aria-label="뒤로 이동"><ArrowDown aria-hidden /></button>
                  <button type="button" className={styles.deleteButton} onClick={() => deleteGalleryItem(index)} aria-label="사진 삭제"><Trash2 aria-hidden /></button>
                </div>
                <label>
                  사진 문구 <small>선택</small>
                  <input value={item.caption || ''} onChange={(event) => updateGalleryItem(index, 'caption', event.target.value)} placeholder="비워두면 사진만 표시" />
                </label>
                <label>
                  상세 설명 <small>선택</small>
                  <textarea value={item.description || ''} onChange={(event) => updateGalleryItem(index, 'description', event.target.value)} placeholder="전체 화면에서 보여줄 설명" rows={2} />
                </label>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.section}>
          <div className={styles.folderTabs}>
            {guide.map((folder, index) => (
              <button
                type="button"
                className={folderIndex === index ? styles.activeFolder : ''}
                style={{ '--admin-folder-color': folder.color } as React.CSSProperties}
                onClick={() => setFolderIndex(index)}
                key={folder.title}
              >
                {folder.title}<span>{folder.items.length}</span>
              </button>
            ))}
          </div>

          <div className={styles.sectionHeading}>
            <div>
              <h2>{selectedFolder.title}</h2>
              <p>{selectedFolder.subtitle}</p>
            </div>
            <button type="button" className={styles.uploadButton} onClick={addPlace}><Plus aria-hidden /> 장소 추가</button>
          </div>

          <div className={styles.placeList}>
            {selectedFolder.items.map((item, index) => (
              <article className={styles.placeEditor} key={`${item.image}-${index}`}>
                <div className={styles.placeTopRow}>
                  <div className={styles.placeImage}>
                    {item.image ? (
                      <Image src={item.image} alt={`${item.title || '장소'} 사진`} width={360} height={250} />
                    ) : (
                      <span><ImagePlus aria-hidden />사진을 선택해주세요</span>
                    )}
                    <label>
                      사진 {item.image ? '교체' : '선택'}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void replacePlaceImage(index, event.target.files?.[0])} />
                    </label>
                  </div>
                  <div className={styles.placeMainFields}>
                    <label>
                      장소 이름
                      <input required value={item.title} onChange={(event) => updatePlace(index, { title: event.target.value })} placeholder="예: 알카노" />
                    </label>
                    <label>
                      네이버 지도 링크
                      <input value={item.link || ''} onChange={(event) => updatePlace(index, { link: event.target.value })} placeholder="https://naver.me/..." />
                    </label>
                    <div className={styles.inlineActions}>
                      <button type="button" onClick={() => movePlace(index, -1)} disabled={index === 0}><ArrowUp aria-hidden /> 위로</button>
                      <button type="button" onClick={() => movePlace(index, 1)} disabled={index === selectedFolder.items.length - 1}><ArrowDown aria-hidden /> 아래로</button>
                      <button type="button" className={styles.deleteButton} onClick={() => deletePlace(index)}><Trash2 aria-hidden /> 삭제</button>
                    </div>
                  </div>
                </div>
                <div className={styles.placeTextFields}>
                  <label>
                    한 줄 설명
                    <textarea required value={item.description} onChange={(event) => updatePlace(index, { description: event.target.value })} rows={2} placeholder="카드에 가장 먼저 보이는 설명" />
                  </label>
                  <label>
                    꿀팁 <small>선택 · 줄바꿈 가능</small>
                    <textarea value={item.tip || ''} onChange={(event) => updatePlace(index, { tip: event.target.value })} rows={3} placeholder="추천 메뉴나 방문 팁" />
                  </label>
                  <label>
                    해시태그 <small>쉼표로 구분</small>
                    <input
                      value={(item.tags || []).join(', ')}
                      onChange={(event) => updatePlace(index, {
                        tags: event.target.value.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean)
                      })}
                      placeholder="신부가족픽, 포항양식, 리소토"
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
