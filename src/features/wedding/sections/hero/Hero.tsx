'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

export default function Hero() {
  const { hero } = weddingData;
  const [bride, groom] = hero.names.split('&').map((name) => name.trim());
  const heroRef = useRef<HTMLElement>(null);
  const hasEnteredRef = useRef(false);
  const [showVideo, setShowVideo] = useState(Boolean(hero.video));

  useEffect(() => {
    const heroElement = heroRef.current;

    if (!hero.video || !heroElement) return;

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

    observer.observe(heroElement);

    return () => observer.disconnect();
  }, [hero.video]);

  return (
    <section className="section hero" id="hero" ref={heroRef}>
      <div className="hero-photo-frame">
        {hero.video && showVideo ? (
          <video
            className="hero-image"
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
            alt={`${bride}와 ${groom}의 대표 사진`}
            width={430}
            height={560}
            className="hero-image"
            priority
          />
        )}
      </div>
    </section>
  );
}
