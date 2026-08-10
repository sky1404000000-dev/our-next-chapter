'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector('.mobile-shell');
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.top-ornament, .section'));
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.16) {
            entry.target.classList.add('is-visible');
          } else if (!entry.isIntersecting) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: [0, 0.16],
        rootMargin: '0px 0px -8% 0px'
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  return null;
}
