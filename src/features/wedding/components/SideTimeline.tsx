'use client';

import { CalendarDays, Link, Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ShareActions from './ShareActions';

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

  const copyCurrentLink = () => {
    void navigator.clipboard.writeText(window.location.href);
  };

  return (
    <>
      <button type="button" className="timeline-toggle" onClick={() => setIsOpen(true)} aria-label="메뉴 열기">
        <Menu aria-hidden />
      </button>

      <aside className={`side-timeline ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <button type="button" className="timeline-close" onClick={() => setIsOpen(false)} aria-label="메뉴 닫기">
          <X aria-hidden />
        </button>

        <div className="timeline-feature-links">
          <a href="#schedule" onClick={() => setIsOpen(false)}>
            <CalendarDays aria-hidden />
            예식일 확인
          </a>
          <button type="button" onClick={copyCurrentLink}>
            <Link aria-hidden />
            링크 복사
          </button>
          <a href="#closing" onClick={() => setIsOpen(false)}>
            <MessageCircle aria-hidden />
            공유하기
          </a>
        </div>

        <nav className="timeline-list" aria-label="초대장 메뉴">
          {visibleItems.map((item) => {
            const id = item.href.replace('#', '');

            return (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={activeId === id ? 'is-active' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <ShareActions compact />
      </aside>

      {isOpen && <button type="button" className="timeline-backdrop" onClick={() => setIsOpen(false)} aria-label="메뉴 닫기" />}
    </>
  );
}
