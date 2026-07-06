'use client';

import { useEffect, useState } from 'react';
import { weddingData } from '@/data/weddingData';

export default function EnvelopeIntro() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const { intro } = weddingData;

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), 2200);
    const hideTimer = window.setTimeout(() => setVisible(false), 3050);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`envelope-intro${leaving ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="intro-motion">
        <span>{intro.eyebrow}</span>
        <strong>{intro.title}</strong>
        <p className="multiline">{intro.message}</p>
      </div>
    </div>
  );
}
