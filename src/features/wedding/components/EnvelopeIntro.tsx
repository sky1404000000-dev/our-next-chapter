'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { weddingData } from '@/data/weddingData';

export default function EnvelopeIntro() {
  const { hero, invitation, weddingInfo } = weddingData;
  const stageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const hasPositionedSliderRef = useRef(false);
  const hasEnteredRef = useRef(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>();
  const [showVideo, setShowVideo] = useState(true);
  const [readyVideos, setReadyVideos] = useState(() => hero.videos.map(() => false));
  const [preloadRemainingVideos, setPreloadRemainingVideos] = useState(false);
  const [datePart, dayPart = 'SAT'] = hero.dateLabel.split(' ');
  const displayDate = datePart.replaceAll('.', ' / ');

  useEffect(() => {
    const selectTimer = window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * hero.videos.length);
      setActiveVideoIndex(randomIndex);
    }, 0);

    return () => window.clearTimeout(selectTimer);
  }, [hero.videos]);

  useEffect(() => {
    if (activeVideoIndex === undefined || !showVideo) return;

    const slider = sliderRef.current;
    if (slider && !hasPositionedSliderRef.current) {
      slider.scrollLeft = slider.clientWidth * activeVideoIndex;
      hasPositionedSliderRef.current = true;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeVideoIndex) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeVideoIndex, showVideo]);

  useEffect(() => {
    if (!preloadRemainingVideos) return;

    videoRefs.current.forEach((video) => {
      if (!video || video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return;

      video.preload = 'auto';
      video.load();
    });
  }, [preloadRemainingVideos]);

  useEffect(() => {
    const stageElement = stageRef.current;

    if (activeVideoIndex === undefined || !stageElement) return;

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
  }, [activeVideoIndex]);

  const moveToVideo = (nextIndex: number) => {
    const videoCount = hero.videos.length;
    if (videoCount === 0) return;

    const wrappedIndex = (nextIndex + videoCount) % videoCount;
    setActiveVideoIndex(wrappedIndex);
    sliderRef.current?.scrollTo({
      left: sliderRef.current.clientWidth * wrappedIndex,
      behavior: 'smooth'
    });
  };

  const handleVideoScroll = () => {
    const slider = sliderRef.current;
    if (!slider || slider.clientWidth === 0) return;

    const nextIndex = Math.round(slider.scrollLeft / slider.clientWidth);
    if (nextIndex !== activeVideoIndex && nextIndex >= 0 && nextIndex < hero.videos.length) {
      setActiveVideoIndex(nextIndex);
    }
  };

  const handleVideoReady = (index: number) => {
    setReadyVideos((currentReadyVideos) => {
      if (currentReadyVideos[index]) return currentReadyVideos;

      const nextReadyVideos = [...currentReadyVideos];
      nextReadyVideos[index] = true;
      return nextReadyVideos;
    });
    setPreloadRemainingVideos(true);
  };

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
              {activeVideoIndex !== undefined && showVideo ? (
                <>
                  <div
                    className="cover-video-slider"
                    ref={sliderRef}
                    onScroll={handleVideoScroll}
                    aria-label={`커버 영상 ${hero.videos.length}개`}
                  >
                    {hero.videos.map((video, index) => (
                      <div className="cover-video-slide" key={video} aria-hidden={index !== activeVideoIndex}>
                        <Image
                          src={hero.image}
                          alt=""
                          fill
                          sizes="(max-width: 430px) 100vw, 430px"
                          className="cover-video-placeholder"
                          priority={index === activeVideoIndex}
                          aria-hidden="true"
                        />
                        <video
                          ref={(element) => {
                            videoRefs.current[index] = element;
                          }}
                          className={`cover-photo cover-video-media ${readyVideos[index] ? 'is-ready' : ''}`}
                          src={video}
                          preload={index === activeVideoIndex || preloadRemainingVideos ? 'auto' : 'none'}
                          autoPlay={index === activeVideoIndex}
                          muted
                          loop
                          playsInline
                          onCanPlay={() => handleVideoReady(index)}
                        />
                        <div
                          className={`cover-video-loading ${readyVideos[index] ? 'is-hidden' : ''}`}
                          role={index === activeVideoIndex && !readyVideos[index] ? 'status' : undefined}
                          aria-hidden={index !== activeVideoIndex || readyVideos[index]}
                        >
                          <span className="cover-video-spinner" aria-hidden="true" />
                          <span>영상을 준비하고 있어요</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="cover-video-arrow cover-video-arrow-left"
                    onClick={() => moveToVideo(activeVideoIndex - 1)}
                    aria-label="이전 커버 영상"
                  >
                    <ChevronLeft aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="cover-video-arrow cover-video-arrow-right"
                    onClick={() => moveToVideo(activeVideoIndex + 1)}
                    aria-label="다음 커버 영상"
                  >
                    <ChevronRight aria-hidden />
                  </button>
                  <div className="cover-video-dots" aria-label="커버 영상 선택">
                    {hero.videos.map((video, index) => (
                      <button
                        type="button"
                        className={index === activeVideoIndex ? 'is-active' : ''}
                        onClick={() => moveToVideo(index)}
                        aria-label={`${index + 1}번째 커버 영상 보기`}
                        aria-current={index === activeVideoIndex ? 'true' : undefined}
                        key={video}
                      />
                    ))}
                  </div>
                </>
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
