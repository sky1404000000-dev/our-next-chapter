'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type GalleryItem, weddingData } from '@/data/weddingData';

const pageSize = weddingData.gallery.initialCount;
const closeAnimationDuration = 280;

export default function Gallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [detailDirection, setDetailDirection] = useState<'prev' | 'next'>('next');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { gallery } = weddingData;
  const galleryItems = gallery.items;
  const selectedItem = selectedIndex === null ? null : galleryItems[selectedIndex];
  const pages = useMemo(() => {
    const result: GalleryItem[][] = [];

    for (let index = 0; index < galleryItems.length; index += pageSize) {
      result.push(galleryItems.slice(index, index + pageSize));
    }

    return result;
  }, [galleryItems]);

  const displayPages = useMemo(() => {
    const originals = pages.map((items, logicalPage) => ({ items, logicalPage }));
    if (pages.length <= 1) return originals;

    return [
      { items: pages[pages.length - 1], logicalPage: pages.length - 1 },
      ...originals,
      { items: pages[0], logicalPage: 0 }
    ];
  }, [pages]);

  const jumpToPhysicalPage = useCallback((physicalPage: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const previousScrollBehavior = carousel.style.scrollBehavior;
    carousel.style.scrollBehavior = 'auto';
    carousel.scrollLeft = carousel.clientWidth * physicalPage;

    requestAnimationFrame(() => {
      carousel.style.scrollBehavior = previousScrollBehavior;
    });
  }, []);

  useLayoutEffect(() => {
    if (pages.length > 1) jumpToPhysicalPage(1);
  }, [jumpToPhysicalPage, pages.length]);

  const scrollCarousel = (direction: 'prev' | 'next') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const physicalPage = Math.round(carousel.scrollLeft / carousel.clientWidth);
    const nextPhysicalPage = direction === 'next' ? physicalPage + 1 : physicalPage - 1;

    carousel.scrollTo({
      left: carousel.clientWidth * nextPhysicalPage,
      behavior: 'smooth'
    });
  };

  const updateCurrentPage = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const physicalPage = Math.round(carousel.scrollLeft / carousel.clientWidth);
    const logicalPage =
      physicalPage === 0
        ? pages.length - 1
        : physicalPage === pages.length + 1
          ? 0
          : physicalPage - 1;

    setCurrentPage(logicalPage);

    if (carouselSettleTimerRef.current) clearTimeout(carouselSettleTimerRef.current);
    carouselSettleTimerRef.current = setTimeout(() => {
      if (physicalPage === 0) jumpToPhysicalPage(pages.length);
      if (physicalPage === pages.length + 1) jumpToPhysicalPage(1);
      carouselSettleTimerRef.current = null;
    }, 100);
  };

  const moveDetail = useCallback((direction: 'prev' | 'next') => {
    if (isClosing) return;

    setDetailDirection(direction);
    setSelectedIndex((current) => {
      if (current === null) return current;
      const lastIndex = galleryItems.length - 1;
      if (direction === 'next') return current === lastIndex ? 0 : current + 1;
      return current === 0 ? lastIndex : current - 1;
    });
  }, [galleryItems.length, isClosing]);

  const openDetail = (index: number) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setDetailDirection('next');
    setSelectedIndex(index);
  };

  const closeDetail = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setSelectedIndex(null);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, closeAnimationDuration);
  }, [isClosing]);

  useEffect(() => {
    return () => {
      if (carouselSettleTimerRef.current) clearTimeout(carouselSettleTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveDetail('prev');
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveDetail('next');
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeDetail();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDetail, moveDetail, selectedIndex]);

  return (
    <section className="section" id="gallery">
      <span className="section-kicker">GALLERY</span>
      <h2>{gallery.title}</h2>
      <p className="gallery-helper">사진을 클릭하시면 전체 화면 보기가 가능합니다</p>

      <div className="gallery-collage-wrap">
        <div className="gallery-collage-carousel" aria-label="사진 갤러리" ref={carouselRef} onScroll={updateCurrentPage}>
          {displayPages.map(({ items, logicalPage }, physicalPageIndex) => (
            <div
              className={`gallery-collage-page ${logicalPage === currentPage ? 'gallery-collage-page-active' : ''}`}
              key={`gallery-page-${physicalPageIndex}-${logicalPage}`}
            >
              {items.map((item, itemIndex) => {
                const index = logicalPage * pageSize + itemIndex;

                return (
                  <button
                    type="button"
                    className={`gallery-polaroid gallery-polaroid-${itemIndex + 1} ${item.caption ? 'gallery-polaroid-captioned' : ''}`}
                    key={`${item.image}-${item.caption ?? 'photo'}-${index}`}
                    onClick={() => openDetail(index)}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt ?? `웨딩 갤러리 사진 ${index + 1}`}
                      width={360}
                      height={360}
                      className="gallery-polaroid-image"
                    />
                    {item.caption && <span className="gallery-polaroid-caption">{item.caption}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="gallery-page-controls" aria-label="사진 묶음 이동">
          <button type="button" onClick={() => scrollCarousel('prev')} aria-label="이전 사진 묶음">
            <ChevronLeft aria-hidden />
          </button>
          <span className="gallery-page-count" aria-live="polite" aria-label={`${currentPage + 1} / ${pages.length}`}>
            <strong aria-hidden="true">{currentPage + 1}</strong>
            <span aria-hidden="true">/ {pages.length}</span>
          </span>
          <button type="button" onClick={() => scrollCarousel('next')} aria-label="다음 사진 묶음">
            <ChevronRight aria-hidden />
          </button>
        </div>
      )}

      {selectedItem &&
        createPortal(
          <div
            className={`gallery-modal ${isClosing ? 'gallery-modal-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.caption ?? `웨딩 갤러리 사진 ${(selectedIndex ?? 0) + 1}`}
          >
            <button type="button" className="gallery-modal-backdrop" onClick={closeDetail}>
              <span className="sr-only">닫기</span>
            </button>

            <div className="gallery-modal-content">
              <button type="button" className="gallery-close" onClick={closeDetail} aria-label="닫기">
                <X aria-hidden />
              </button>

              <button
                type="button"
                className="gallery-modal-arrow gallery-modal-prev"
                onClick={() => moveDetail('prev')}
                aria-label="이전 사진"
              >
                <ChevronLeft aria-hidden />
              </button>

              <div className={`gallery-modal-card gallery-modal-card-${detailDirection}`} key={selectedIndex}>
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.alt ?? `웨딩 갤러리 사진 ${(selectedIndex ?? 0) + 1}`}
                  width={760}
                  height={900}
                  className="gallery-modal-image"
                />
                {(selectedItem.caption || selectedItem.description) && (
                  <div className="gallery-modal-text">
                    {selectedItem.caption && <h3>{selectedItem.caption}</h3>}
                    {selectedItem.description && <p>{selectedItem.description}</p>}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="gallery-modal-arrow gallery-modal-next"
                onClick={() => moveDetail('next')}
                aria-label="다음 사진"
              >
                <ChevronRight aria-hidden />
              </button>

              <span className="gallery-modal-count">
                {String((selectedIndex ?? 0) + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
              </span>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
