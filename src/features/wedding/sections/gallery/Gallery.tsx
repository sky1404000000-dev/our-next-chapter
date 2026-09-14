'use client';

import Image from 'next/image';
import './Gallery.css';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import {
  galleryItems,
  type GalleryItem
} from '@/data/editableContent';
import { weddingData } from '@/data/weddingData';

const pageSize = weddingData.gallery.initialCount;
const closeAnimationDuration = 280;

type DragStart = {
  x: number;
  y: number;
  pointerId: number;
};

export default function Gallery() {
  const closeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  // 목록 스와이프 시작 위치
  const pageDragStartRef =
    useRef<DragStart | null>(null);

  // 목록 스와이프 직후 사진 클릭 방지
  const suppressPageClickRef = useRef(false);

  // 전체화면 사진 스와이프 시작 위치
  const detailDragStartRef =
    useRef<DragStart | null>(null);

  const [currentPage, setCurrentPage] =
    useState(0);

  const [detailDirection, setDetailDirection] =
    useState<'prev' | 'next'>('next');

  const [isClosing, setIsClosing] =
    useState(false);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const { gallery } = weddingData;

  const selectedItem =
    selectedIndex === null
      ? null
      : galleryItems[selectedIndex];

  const isDetailOpen =
    selectedIndex !== null;

  // 전체 사진을 페이지 단위로만 나눔
  const pages = useMemo(() => {
    const result: GalleryItem[][] = [];

    for (
      let index = 0;
      index < galleryItems.length;
      index += pageSize
    ) {
      result.push(
        galleryItems.slice(
          index,
          index + pageSize
        )
      );
    }

    return result;
  }, []);

  // 현재 페이지 사진만 사용
  const currentItems =
    pages[currentPage] ?? [];

  // 목록 이전 / 다음
  const movePage = useCallback(
    (direction: 'prev' | 'next') => {
      if (pages.length <= 1) return;

      setCurrentPage((current) => {
        if (direction === 'next') {
          return current === pages.length - 1
            ? 0
            : current + 1;
        }

        return current === 0
          ? pages.length - 1
          : current - 1;
      });
    },
    [pages.length]
  );

  // 목록 스와이프 시작
  const handlePagePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      !event.isPrimary ||
      event.button !== 0
    ) {
      return;
    }

    pageDragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  // 목록 스와이프 종료
  const handlePagePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const start =
      pageDragStartRef.current;

    if (
      !start ||
      start.pointerId !== event.pointerId
    ) {
      return;
    }

    pageDragStartRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    const deltaX =
      event.clientX - start.x;

    const deltaY =
      event.clientY - start.y;

    const isHorizontalSwipe =
      Math.abs(deltaX) > 45 &&
      Math.abs(deltaX) >
        Math.abs(deltaY) * 1.1;

    if (!isHorizontalSwipe) return;

    // 스와이프 후 사진이 클릭되는 것 방지
    suppressPageClickRef.current = true;

    window.setTimeout(() => {
      suppressPageClickRef.current = false;
    }, 0);

    movePage(
      deltaX < 0 ? 'next' : 'prev'
    );
  };

  const handlePagePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      pageDragStartRef.current
        ?.pointerId !== event.pointerId
    ) {
      return;
    }

    pageDragStartRef.current = null;
  };

  // 전체화면 사진 이전 / 다음
  const moveDetail = useCallback(
    (direction: 'prev' | 'next') => {
      if (isClosing) return;

      setDetailDirection(direction);

      setSelectedIndex((current) => {
        if (current === null) {
          return current;
        }

        const lastIndex =
          galleryItems.length - 1;

        if (direction === 'next') {
          return current === lastIndex
            ? 0
            : current + 1;
        }

        return current === 0
          ? lastIndex
          : current - 1;
      });
    },
    [isClosing]
  );

  // 전체화면 닫기 애니메이션
  const finishClosingDetail =
    useCallback(() => {
      if (closeTimerRef.current) {
        clearTimeout(
          closeTimerRef.current
        );
      }

      detailDragStartRef.current = null;

      const prefersReducedMotion =
        window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

      if (prefersReducedMotion) {
        setSelectedIndex(null);
        setIsClosing(false);
        return;
      }

      setIsClosing(true);

      closeTimerRef.current =
        setTimeout(() => {
          setSelectedIndex(null);
          setIsClosing(false);
          closeTimerRef.current = null;
        }, closeAnimationDuration);
    }, []);

  // 전체화면 열기
  const openDetail = (
    index: number
  ) => {
    // 목록 스와이프 직후 발생한 클릭이면 무시
    if (suppressPageClickRef.current) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(
        closeTimerRef.current
      );
    }

    closeTimerRef.current = null;

    setIsClosing(false);
    setDetailDirection('next');
    setSelectedIndex(index);
  };

  // 전체화면 닫기
  const closeDetail = useCallback(() => {
    if (isClosing) return;

    finishClosingDetail();
  }, [
    finishClosingDetail,
    isClosing
  ]);

  // 전체화면 사진 스와이프 시작
  const handleDetailPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      !event.isPrimary ||
      event.button !== 0
    ) {
      return;
    }

    detailDragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  // 전체화면 사진 스와이프 종료
  const handleDetailPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const start =
      detailDragStartRef.current;

    if (
      !start ||
      start.pointerId !== event.pointerId
    ) {
      return;
    }

    detailDragStartRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    const deltaX =
      event.clientX - start.x;

    const deltaY =
      event.clientY - start.y;

    const isHorizontalSwipe =
      Math.abs(deltaX) > 42 &&
      Math.abs(deltaX) >
        Math.abs(deltaY) * 1.1;

    if (!isHorizontalSwipe) return;

    moveDetail(
      deltaX < 0 ? 'next' : 'prev'
    );
  };

  const handleDetailPointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      detailDragStartRef.current
        ?.pointerId !== event.pointerId
    ) {
      return;
    }

    detailDragStartRef.current = null;
  };

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(
          closeTimerRef.current
        );
      }
    };
  }, []);

  // 전체화면 모달이 열렸을 때
  // 뒤 페이지 스크롤 막기
  useEffect(() => {
    if (!isDetailOpen) return;

    const originalHtmlOverflow =
      document.documentElement.style
        .overflow;

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalOverscrollBehavior =
      document.documentElement.style
        .overscrollBehavior;

    const preventTouchMove = (
      event: TouchEvent
    ) => {
      event.preventDefault();
    };

    document.documentElement.style.overflow =
      'hidden';

    document.body.style.overflow =
      'hidden';

    document.documentElement.style
      .overscrollBehavior = 'none';

    document.addEventListener(
      'touchmove',
      preventTouchMove,
      { passive: false }
    );

    return () => {
      document.removeEventListener(
        'touchmove',
        preventTouchMove
      );

      document.documentElement.style
        .overflow = originalHtmlOverflow;

      document.body.style.overflow =
        originalBodyOverflow;

      document.documentElement.style
        .overscrollBehavior =
        originalOverscrollBehavior;
    };
  }, [isDetailOpen]);

  // 키보드 조작
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
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

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    closeDetail,
    moveDetail,
    selectedIndex
  ]);

  return (
    <section
      className="section"
      id="gallery"
    >
      <span className="section-kicker">
        GALLERY
      </span>

      <h2>{gallery.title}</h2>

      <p className="gallery-helper">
        사진을 클릭하시면 전체 화면 보기가
        가능합니다
      </p>

      <div className="gallery-collage-wrap">
        <div
          className="gallery-collage-carousel"
          aria-label="사진 갤러리"
          onPointerDown={
            handlePagePointerDown
          }
          onPointerUp={
            handlePagePointerUp
          }
          onPointerCancel={
            handlePagePointerCancel
          }
        >
          <div
            className="gallery-collage-page gallery-collage-page-active"
            key={`gallery-page-${currentPage}`}
          >
            {currentItems.map(
              (item, itemIndex) => {
                const index =
                  currentPage *
                    pageSize +
                  itemIndex;

                const isLandscape =
                  item.width !==
                    undefined &&
                  item.height !==
                    undefined &&
                  item.width >
                    item.height;

                return (
                  <button
                    type="button"
                    className={`gallery-polaroid gallery-polaroid-${itemIndex + 1} ${
                      isLandscape
                        ? 'gallery-polaroid-landscape'
                        : ''
                    } ${
                      item.caption
                        ? 'gallery-polaroid-captioned'
                        : ''
                    }`}
                    key={`${item.image}-${index}`}
                    onClick={() =>
                      openDetail(index)
                    }
                  >
                    <Image
                      src={item.image}
                      alt={
                        item.alt ??
                        `웨딩 갤러리 사진 ${
                          index + 1
                        }`
                      }
                      width={
                        item.width ?? 360
                      }
                      height={
                        item.height ?? 360
                      }
                      className="gallery-polaroid-image"
                    />

                    {item.caption && (
                      <span className="gallery-polaroid-caption">
                        {item.caption}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {pages.length > 1 && (
        <div
          className="gallery-page-controls"
          aria-label="사진 묶음 이동"
        >
          <button
            type="button"
            onClick={() =>
              movePage('prev')
            }
            aria-label="이전 사진 묶음"
          >
            <ChevronLeft aria-hidden />
          </button>

          <span
            className="gallery-page-count"
            aria-live="polite"
            aria-label={`${
              currentPage + 1
            } / ${pages.length}`}
          >
            <strong aria-hidden="true">
              {currentPage + 1}
            </strong>

            <span aria-hidden="true">
              / {pages.length}
            </span>
          </span>

          <button
            type="button"
            onClick={() =>
              movePage('next')
            }
            aria-label="다음 사진 묶음"
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
      )}

      {selectedItem &&
        createPortal(
          <div
            className={`gallery-modal ${
              isClosing
                ? 'gallery-modal-closing'
                : ''
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={
              selectedItem.caption ??
              `웨딩 갤러리 사진 ${
                (selectedIndex ?? 0) +
                1
              }`
            }
          >
            <div
              className="gallery-modal-backdrop"
              aria-hidden="true"
            />

            <div className="gallery-modal-content">
              <button
                type="button"
                className="gallery-close"
                onClick={closeDetail}
                aria-label="닫기"
              >
                <X aria-hidden />
              </button>

              <div
                className={`gallery-modal-card gallery-modal-card-${detailDirection}`}
                key={selectedIndex}
                onPointerDown={
                  handleDetailPointerDown
                }
                onPointerUp={
                  handleDetailPointerUp
                }
                onPointerCancel={
                  handleDetailPointerCancel
                }
              >
                <Image
                  src={selectedItem.image}
                  alt={
                    selectedItem.alt ??
                    `웨딩 갤러리 사진 ${
                      (selectedIndex ??
                        0) + 1
                    }`
                  }
                  fill
                  sizes="100vw"
                  className="gallery-modal-image"
                  draggable={false}
                />
              </div>

              <div
                className="gallery-modal-controls"
                aria-label="사진 이동"
              >
                <button
                  type="button"
                  className="gallery-modal-arrow gallery-modal-prev"
                  onClick={() =>
                    moveDetail('prev')
                  }
                  aria-label="이전 사진"
                >
                  <ChevronLeft
                    aria-hidden
                  />
                </button>

                <span className="gallery-modal-count">
                  {String(
                    (selectedIndex ??
                      0) + 1
                  ).padStart(2, '0')}{' '}
                  /{' '}
                  {String(
                    galleryItems.length
                  ).padStart(2, '0')}
                </span>

                <button
                  type="button"
                  className="gallery-modal-arrow gallery-modal-next"
                  onClick={() =>
                    moveDetail('next')
                  }
                  aria-label="다음 사진"
                >
                  <ChevronRight
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}