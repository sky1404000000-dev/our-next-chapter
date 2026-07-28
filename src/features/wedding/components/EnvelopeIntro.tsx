'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { weddingData } from '@/data/weddingData';

export default function EnvelopeIntro() {
  const { hero, invitation, weddingInfo, aboutUs } = weddingData;
  const [groom, bride] = aboutUs.people;
  const photoRef = useRef<HTMLDivElement>(null);
  const hasEnteredRef = useRef(false);
  const [showVideo, setShowVideo] = useState(Boolean(hero.video));

  useEffect(() => {
    const photoElement = photoRef.current;

    if (!hero.video || !photoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEnteredRef.current = true;
          return;
        }

        if (hasEnteredRef.current) {
          setShowVideo(false);
          observer.disconnect();
        }
      },
      {
        threshold: 0.22,
        rootMargin: '-10% 0px -18% 0px'
      }
    );

    observer.observe(photoElement);

    return () => observer.disconnect();
  }, [hero.video]);

  return (
    <section className="envelope-intro section" id="invitation">
      <div className="envelope-paper">
        <div className="envelope-top" aria-hidden>
          <span />
        </div>

        <header className="envelope-header">
          <Sparkles aria-hidden className="envelope-icon" />
          <p>Wedding Invitation</p>
          <h1>
            <span>{hero.names}</span>
            <span>{invitation.title}</span>
          </h1>
          <time>{weddingInfo.date}</time>
          <span className="envelope-cue" aria-hidden>
            ^
          </span>
        </header>

        <div className="envelope-photo-panel">
          <div className="envelope-photo-frame" ref={photoRef}>
            {hero.video && showVideo ? (
              <video
                className="envelope-main-photo"
                src={hero.video}
                poster={hero.image}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={hero.image}
                alt={invitation.imageAlt}
                width={720}
                height={860}
                className="envelope-main-photo"
                priority
              />
            )}
          </div>
        </div>

        <article className="envelope-letter">
          <p className="envelope-welcome">welcome</p>
          <p className="multiline envelope-message">{invitation.message}</p>
          <div className="envelope-divider" aria-hidden />
          <p className="envelope-family">
            {groom.parents} {groom.name}
            <br />
            {bride.parents} {bride.name}
          </p>
        </article>
      </div>
    </section>
  );
}
