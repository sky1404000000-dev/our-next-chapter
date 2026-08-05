'use client';

import Image from 'next/image';
import { ArrowRight, Heart, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type StoryItem, weddingData } from '@/data/weddingData';
import styles from './OurStory.module.css';

const storyStartDate = new Date(2019, 10, 3);
const closeAnimationDuration = 300;

function getDaysTogether() {
  const today = new Date();
  const start = new Date(storyStartDate.getFullYear(), storyStartDate.getMonth(), storyStartDate.getDate());
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.floor((current.getTime() - start.getTime()) / 86400000) + 1;
}

type TimelineItemProps = {
  item: StoryItem;
  reverse: boolean;
};

function TimelineItem({ item, reverse }: TimelineItemProps) {
  return (
    <article
      className={`${styles.timelineItem} ${reverse ? styles.reverse : ''}`}
      data-story-timeline-item
    >
      <div className={styles.timelineMarker} aria-hidden>
        <span><Heart /></span>
      </div>

      {item.image && (
        <div className={styles.timelineImageWrap}>
          <Image
            src={item.image}
            alt={`${item.title} 추억 사진`}
            width={560}
            height={420}
            className={styles.timelineImage}
          />
        </div>
      )}

      <div className={styles.timelineText}>
        <time>{item.date}</time>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

export default function OurStory() {
  const { story } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const daysTogether = getDaysTogether();

  const openStory = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeStory = useCallback(() => {
    if (isClosing) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsOpen(false);
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, closeAnimationDuration);
  }, [isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeStory();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [closeStory, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const panel = document.querySelector<HTMLElement>('[data-story-panel]');
    const items = document.querySelectorAll<HTMLElement>('[data-story-timeline-item]');

    if (!panel || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add(styles.timelineItemVisible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.timelineItemVisible);
          observer.unobserve(entry.target);
        });
      },
      {
        root: panel,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <section className={`section ${styles.storySection}`} id="our-story">
      <span className="section-kicker">{story.kicker}</span>
      <h2>{story.title}</h2>

      <article className={styles.storyCard}>
        <div className={styles.storyHeader}>
          <p>함께 보낸 소중한 날</p>
          <strong className={styles.daysCount} suppressHydrationWarning>
            + {daysTogether.toLocaleString('ko-KR')}<small>일</small>
          </strong>
        </div>

        <Image
          src={story.coverImage}
          alt={story.coverAlt}
          width={720}
          height={720}
          className={styles.storyCover}
        />

        <div className={styles.storyArchive}>
          <p className={styles.archiveMeta}>
            <span>Collection :</span>
            <span>Ongoing Records</span>
          </p>
          <p className={styles.archiveScript}>Our story</p>
        </div>
        <p className={styles.archiveCaption}>Milestone Documentation. These moments, carefully documented and lovingly preserved.</p>

        <button type="button" className={styles.openButton} onClick={openStory}>
          이야기 시작하기
          <span aria-hidden>
            <ArrowRight />
          </span>
        </button>
      </article>

      {isOpen && createPortal(
        <div
          className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={story.title}
        >
          <button type="button" className={styles.backdrop} onClick={closeStory} aria-label="우리의 이야기 닫기" />
          <article className={styles.panel} data-story-panel>
            <header className={styles.panelHeader}>
              <span>Timeline</span>
              <button type="button" onClick={closeStory} aria-label="우리의 이야기 닫기">
                <X aria-hidden />
              </button>
            </header>

            <div className={styles.content}>
              <div className={styles.timelineIntro}>
                <span>Our story</span>
                <h3>{story.title}</h3>
                <p>{story.intro}</p>
              </div>

              <div className={styles.timeline}>
                {story.items.map((item, index) => (
                  <TimelineItem
                    key={`${item.date}-${item.title}`}
                    item={item}
                    reverse={index % 2 === 1}
                  />
                ))}
                <Heart className={styles.timelineEnd} aria-hidden />
              </div>
            </div>
          </article>
        </div>,
        document.body
      )}
    </section>
  );
}
