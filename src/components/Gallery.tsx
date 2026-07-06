'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';

export default function Gallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { gallery } = weddingData;
  const selectedItem = selectedIndex === null ? null : gallery.items[selectedIndex];

  const scrollCarousel = (direction: 'prev' | 'next') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction === 'next' ? carousel.clientWidth * 0.82 : -carousel.clientWidth * 0.82,
      behavior: 'smooth'
    });
  };

  const moveModal = (direction: 'prev' | 'next') => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      const lastIndex = gallery.items.length - 1;
      if (direction === 'next') return current === lastIndex ? 0 : current + 1;
      return current === 0 ? lastIndex : current - 1;
    });
  };

  return (
    <section className="section" id="gallery">
      <span className="section-kicker">GALLERY</span>
      <h2>{gallery.title}</h2>

      <div className="gallery-carousel-wrap">
        <button
          type="button"
          className="gallery-nav gallery-nav-prev"
          onClick={() => scrollCarousel('prev')}
          aria-label="이전 사진들"
        >
          <ChevronLeft aria-hidden />
        </button>

        <div className="gallery-carousel" aria-label="사진 갤러리" ref={carouselRef}>
          {gallery.items.map((item, index) => (
            <button
              type="button"
              className="gallery-slide"
              key={`${item.image}-${item.caption}-${index}`}
              onClick={() => setSelectedIndex(index)}
              style={{ '--tilt': `${(index % 5) - 2}deg` } as React.CSSProperties}
            >
              <Image
                src={item.image}
                alt={item.alt}
                width={420}
                height={520}
                className="gallery-slide-image"
              />
              <span className="gallery-slide-caption">{item.caption}</span>
              <span className="gallery-slide-count">
                {String(index + 1).padStart(2, '0')} / {String(gallery.items.length).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="gallery-nav gallery-nav-next"
          onClick={() => scrollCarousel('next')}
          aria-label="다음 사진들"
        >
          <ChevronRight aria-hidden />
        </button>
      </div>

      {selectedItem &&
        createPortal(
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={selectedItem.caption}>
          <button type="button" className="gallery-modal-backdrop" onClick={() => setSelectedIndex(null)}>
            <span className="sr-only">닫기</span>
          </button>

          <button
            type="button"
            className="gallery-modal-arrow gallery-modal-prev"
            onClick={() => moveModal('prev')}
            aria-label="이전 사진"
          >
            <ChevronLeft aria-hidden />
          </button>

          <div className="gallery-modal-content">
            <button type="button" className="gallery-close" onClick={() => setSelectedIndex(null)} aria-label="닫기">
              <X aria-hidden />
            </button>

            <div className="gallery-modal-card">
              <div className="gallery-modal-polaroid">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.alt}
                  width={720}
                  height={820}
                  className="gallery-modal-image"
                />
                <div className="gallery-modal-text">
                  <h3>{selectedItem.caption}</h3>
                  <p>{selectedItem.description}</p>
                </div>
              </div>
            </div>

            <span className="gallery-modal-count">
              {String((selectedIndex ?? 0) + 1).padStart(2, '0')} / {String(gallery.items.length).padStart(2, '0')}
            </span>
          </div>

          <button
            type="button"
            className="gallery-modal-arrow gallery-modal-next"
            onClick={() => moveModal('next')}
            aria-label="다음 사진"
          >
            <ChevronRight aria-hidden />
          </button>
        </div>,
        document.body
        )}
    </section>
  );
}
