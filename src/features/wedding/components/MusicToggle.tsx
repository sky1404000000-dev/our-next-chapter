'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './MusicToggle.module.css';

type MusicToggleProps = {
  tracks: string[];
};

export default function MusicToggle({ tracks }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackSrc, setTrackSrc] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (tracks.length === 0) return;

    const selectionTimer = window.setTimeout(() => {
      const nextTrack = tracks[Math.floor(Math.random() * tracks.length)];

      setTrackSrc(nextTrack);
    }, 0);

    return () => window.clearTimeout(selectionTimer);
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackSrc) return;

    const interactionEvents = ['pointerdown', 'touchstart', 'keydown'] as const;

    const removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        document.removeEventListener(eventName, startAfterInteraction, true);
      });
    };

    const startAfterInteraction = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-music-toggle]')) return;

      removeInteractionListeners();
      void audio.play().catch(() => setIsPlaying(false));
    };

    const addInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        document.addEventListener(eventName, startAfterInteraction, { capture: true, passive: true });
      });
    };

    audio.load();
    void audio.play().catch(() => {
      setIsPlaying(false);
      addInteractionListeners();
    });

    return removeInteractionListeners;
  }, [trackSrc]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.control}>
      {trackSrc && (
        <audio
          ref={audioRef}
          src={trackSrc}
          autoPlay
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
      <button
        type="button"
        className={styles.button}
        data-music-toggle
        onClick={toggleMusic}
        aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
      >
        {isPlaying ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
      </button>
    </div>
  );
}
