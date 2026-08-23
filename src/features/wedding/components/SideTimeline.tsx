'use client';

import { ChevronUp, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ShareActions from './ShareActions';
import styles from './SideTimeline.module.css';

const timelineItems = [
  { label: '첫 장', href: '#intro' },
  { label: '초대의 글', href: '#invitation' },
  { label: '예식 안내', href: '#schedule' },
  { label: '오시는 길', href: '#location' },
  { label: '두 사람 소개', href: '#about-us' },
  { label: '우리 이야기', href: '#our-story' },
  { label: '사진첩', href: '#gallery' },
  { label: '포항 안내', href: '#pohang-guide' },
  { label: '마음 전하기', href: '#account' },
  { label: '감사의 인사', href: '#closing' }
];

type SideTimelineProps = {
  showAccount: boolean;
};

export default function SideTimeline({ showAccount }: SideTimelineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('intro');
  const animationFrameRef = useRef<number | null>(null);
  const visibleItems = useMemo(
    () => timelineItems.filter((item) => showAccount || item.href !== '#account'),
    [showAccount]
  );

  useEffect(() => {
    const targets = visibleItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter(Boolean) as HTMLElement[];

    const updateActiveItem = () => {
      animationFrameRef.current = null;

      if (targets.length === 0) return;

      const pageBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtPageBottom = pageBottom >= documentHeight - 2;
      let activeTarget = targets[0];

      if (isAtPageBottom) {
        activeTarget = targets[targets.length - 1];
      } else {
        const viewportAnchor = window.scrollY + window.innerHeight * 0.34;

        for (const target of targets) {
          if (target.offsetTop > viewportAnchor) break;
          activeTarget = target;
        }
      }

      setActiveId(activeTarget.id);
    };

    const scheduleUpdate = () => {
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = window.requestAnimationFrame(updateActiveItem);
    };

    updateActiveItem();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visibleItems]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <button type="button" className={styles.scrollTop} onClick={scrollToTop} aria-label="맨 위로 이동">
        <ChevronUp aria-hidden />
      </button>

      <button type="button" className={styles.toggle} onClick={() => setIsOpen(true)} aria-label="메뉴 열기">
        <Menu aria-hidden />
      </button>

      <aside className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} aria-hidden={!isOpen}>
        <button type="button" className={styles.close} onClick={() => setIsOpen(false)} aria-label="메뉴 닫기">
          <X aria-hidden />
        </button>

        <nav className={styles.list} aria-label="초대장 메뉴">
          {visibleItems.map((item) => {
            const id = item.href.replace('#', '');

            return (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={activeId === id ? styles.active : undefined}
                onClick={() => {
                  setActiveId(id);
                  setIsOpen(false);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <ShareActions compact />
      </aside>

      {isOpen && <button type="button" className={styles.backdrop} onClick={() => setIsOpen(false)} aria-label="메뉴 닫기" />}
    </>
  );
}
