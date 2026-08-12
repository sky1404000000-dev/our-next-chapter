'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

export default function Hero() {
  const { hero } = weddingData;
  const [bride, groom] = hero.names.split('&').map((name) => name.trim());
  const heroRef = useRef<HTMLElement>(null);
  const hasEnteredRef = useRef(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const selectTimer = window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * hero.videos.length);
      setSelectedVideo(hero.videos[randomIndex]);
    }, 0);

    return () => window.clearTimeout(selectTimer);
  }, [hero.videos]);

  useEffect(() => {
    const heroElement = heroRef.current;

    if (!selectedVideo || !heroElement) return;

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
  }, [selectedVideo]);

  return (
    <section className="section hero" id="hero" ref={heroRef}>
      <div className="hero-photo-frame">
        {selectedVideo && showVideo ? (
          <video
            className="hero-image"
            src={selectedVideo}
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
