'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { weddingData } from '@/data/weddingData';

export default function EnvelopeIntro() {
  const { hero, invitation, weddingInfo } = weddingData;
  const stageRef = useRef<HTMLDivElement>(null);
  const hasEnteredRef = useRef(false);
  const [showVideo, setShowVideo] = useState(Boolean(hero.video));
  const [datePart, dayPart = 'SAT'] = hero.dateLabel.split(' ');
  const displayDate = datePart.replaceAll('.', ' / ');

  useEffect(() => {
    const stageElement = stageRef.current;

    if (!hero.video || !stageElement) return;

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

    observer.observe(stageElement);

    return () => observer.disconnect();
  }, [hero.video]);

  return (
    <section className="envelope-intro section" id="intro">
      <div className="cover-intro-copy">
        <h1>{displayDate}</h1>
        <time>{dayPart}</time>
      </div>

      <div className="cover-stage" aria-label={`${hero.names} 모바일 청첩장 인트로`} ref={stageRef}>
        <article className="cover-inner-card">
          <figure className="cover-polaroid">
            <div className="cover-media-frame">
              {hero.video && showVideo ? (
                <video
                  className="cover-photo"
                  src={hero.video}
                  poster={hero.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image src={hero.image} alt={invitation.imageAlt} width={720} height={900} className="cover-photo" priority />
              )}
            </div>
            <figcaption>
              <span>{hero.names}</span>
              <small>
                {weddingInfo.date} {weddingInfo.time}
                <br />
                {weddingInfo.introVenue}
              </small>
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
