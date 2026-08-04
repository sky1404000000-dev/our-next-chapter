'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ShareActions from './ShareActions';
import styles from './SideTimeline.module.css';

const timelineItems = [
  { label: '초대장', href: '#invitation' },
  { label: '예식일', href: '#schedule' },
  { label: '오시는 길', href: '#location' },
  { label: '두 사람', href: '#about-us' },
  { label: '우리 이야기', href: '#our-story' },
  { label: '갤러리', href: '#gallery' },
  { label: '포항 가이드', href: '#pohang-guide' },
  { label: '마음 전하기', href: '#account' },
  { label: '인사', href: '#closing' }
];

type SideTimelineProps = {
  showAccount: boolean;
};

export default function SideTimeline({ showAccount }: SideTimelineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('invitation');
  const visibleItems = useMemo(
    () => timelineItems.filter((item) => showAccount || item.href !== '#account'),
    [showAccount]
  );

  useEffect(() => {
    const targets = visibleItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.22, 0.45],
        rootMargin: '-18% 0px -46% 0px'
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [visibleItems]);

  return (
    <>
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
                onClick={() => setIsOpen(false)}
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
