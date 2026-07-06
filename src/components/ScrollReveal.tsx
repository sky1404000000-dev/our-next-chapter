'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector('.mobile-shell');
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.top-ornament, .section, .quick-menu'));
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
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
