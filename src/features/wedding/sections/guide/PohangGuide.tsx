'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';

export default function PohangGuide() {
  const { pohangGuide } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const scrollFeed = (direction: 'prev' | 'next') => {
    const feed = feedRef.current;
    if (!feed) return;

    feed.scrollBy({
      left: direction === 'next' ? feed.clientWidth * 0.86 : -feed.clientWidth * 0.86,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <section className="section" id="pohang-guide">
      <span className="section-kicker">GUIDE</span>
      <h2>{pohangGuide.title}</h2>
      <p className="guide-intro">{pohangGuide.intro}</p>

      <div className="guide-feed-wrap">
        <div className="guide-feed" ref={feedRef} aria-label="포항 추천 장소">
          {pohangGuide.items.map((item, index) => (
            <a
              className="guide-card"
              href={item.link}
              target="_blank"
              rel="noreferrer"
              key={`${item.label}-${item.title}-${index}`}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={`${item.title} 이미지`}
                  width={320}
                  height={360}
                  className="guide-image"
                />
              )}
              <span className="guide-label">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.feature}</p>
              <strong>{String(index + 1).padStart(2, '0')}.</strong>
            </a>
          ))}
        </div>

        <div className="guide-feed-controls" aria-label="포항 가이드 넘기기">
          <button type="button" onClick={() => scrollFeed('prev')} aria-label="이전 추천 장소 보기">
            <ChevronLeft aria-hidden />
          </button>
          <button type="button" onClick={() => scrollFeed('next')} aria-label="다음 추천 장소 보기">
            <ChevronRight aria-hidden />
          </button>
        </div>

        <button type="button" className="guide-expand-btn" onClick={() => setIsOpen(true)}>
          <Maximize2 aria-hidden />
          전체 보기
        </button>
      </div>

      {isOpen && createPortal(
        <div className="guide-modal" role="dialog" aria-modal="true" aria-label="포항 가이드 전체 보기">
          <article className="guide-modal-panel">
            <header className="guide-modal-header">
              <div>
                <span>POHANG GUIDE</span>
                <h3>{pohangGuide.title}</h3>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="포항 가이드 닫기">
                <X aria-hidden />
              </button>
            </header>

            <div className="guide-modal-grid">
              {pohangGuide.items.map((item, index) => (
                <article className="guide-modal-item" key={`${item.label}-${item.title}-${index}-modal`}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={`${item.title} 이미지`}
                      width={520}
                      height={420}
                      className="guide-modal-image"
                    />
                  )}
                  <div className="guide-modal-text">
                    <span>{item.label}</span>
                    <h4>
                      <small>{String(index + 1).padStart(2, '0')}.</small>
                      {item.title}
                    </h4>
                    <p>{item.description}</p>
                    <dl>
                      <dt>특징</dt>
                      <dd>{item.feature}</dd>
                    </dl>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        사이트 방문
                        <ExternalLink aria-hidden />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>,
        document.body
      )}
    </section>
  );
}
