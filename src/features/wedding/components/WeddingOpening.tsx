'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const openingImages = [
  {
    src: '/images/intro/opening-1.jpg',
    alt: '은진과 동균의 웨딩 인트로 사진 1'
  },
  {
    src: '/images/intro/opening-2.jpg',
    alt: '은진과 동균의 웨딩 인트로 사진 2'
  }
];

const openingTitle = 'Our Wedding Day';

export default function WeddingOpening() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // 🔴 모바일 디버그용
  const [debugMountCount, setDebugMountCount] = useState(0);
  const [debugEvent, setDebugEvent] = useState('mount');

  // 🔴 WeddingOpening이 몇 번 마운트됐는지 확인
  useEffect(() => {
    const key = 'wedding-opening-debug-mount-count';

    const previous = Number(
      sessionStorage.getItem(key) ?? '0'
    );

    const next = previous + 1;

    sessionStorage.setItem(key, String(next));
    setDebugMountCount(next);
    setDebugEvent('mounted');

    const handlePopState = () => {
      setDebugEvent('POPSTATE');
    };

const handlePageShow = (event: PageTransitionEvent) => {
  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming | undefined;

  const navigationType = navigation?.type ?? 'unknown';

  setDebugEvent(
    `PAGESHOW / ${navigationType} / H${window.history.length}`
  );
};

    const handleVisibilityChange = () => {
      setDebugEvent(
        `VISIBILITY / ${document.visibilityState}`
      );
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    if (isVisible) return;

    window.dispatchEvent(
      new Event('wedding-opening-complete')
    );
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow =
      document.body.style.overflow;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const isDebugMode =
      process.env.NODE_ENV === 'development' &&
      new URLSearchParams(window.location.search).get(
        'introDebug'
      ) === '1';

    const leaveDelay = prefersReducedMotion
      ? 600
      : 4500;

    const finishDelay = prefersReducedMotion
      ? 1050
      : 5400;

    document.body.style.overflow = 'hidden';

    if (isDebugMode) {
      return () => {
        document.body.style.overflow =
          previousOverflow;
      };
    }

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, leaveDelay);

    const finishTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, finishDelay);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(finishTimer);

      document.body.style.overflow =
        previousOverflow;
    };
  }, [isVisible]);

  const dismissOpening = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    window.setTimeout(() => {
      setIsVisible(false);
    }, 850);
  };

  // 🔴 인트로가 사라진 뒤에도 화면에 계속 표시
  const debugBadge = (
    <div
      style={{
        position: 'fixed',
        top: '8px',
        left: '8px',
        zIndex: 999999,
        padding: '6px 8px',
        borderRadius: '4px',
        background: 'red',
        color: 'white',
        fontSize: '11px',
        fontWeight: 700,
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.4,
        pointerEvents: 'none'
      }}
    >
      MOUNT #{debugMountCount}
      <br />
      {debugEvent}
    </div>
  );

  // 인트로가 끝나도 디버그 글자는 남겨둠
  if (!isVisible) {
    return debugBadge;
  }

  return (
    <>
      {debugBadge}

      <div
        className={`wedding-opening ${
          isLeaving ? 'is-leaving' : ''
        }`}
        role="dialog"
        aria-label="웨딩 초대장 인트로"
        onClick={dismissOpening}
      >
        <div
          className="wedding-opening-images"
          aria-hidden="true"
        >
          {openingImages.map((image, index) => (
            <figure
              className={`wedding-opening-slide wedding-opening-slide-${index + 1}`}
              key={image.src}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                quality={90}
                sizes="(max-width: 430px) 100vw, 430px"
              />
            </figure>
          ))}
        </div>

        <p
          className="wedding-opening-title"
          aria-label={openingTitle}
        >
          <span aria-hidden="true">
            {openingTitle}
          </span>
        </p>

        <p className="wedding-opening-hint">
          화면을 누르면 바로 시작합니다
        </p>

        <button
          type="button"
          className="wedding-opening-skip"
          onClick={(event) => {
            event.stopPropagation();
            dismissOpening();
          }}
        >
          SKIP
        </button>
      </div>
    </>
  );
}