'use client';

import { Music2, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './MusicToggle.module.css';

type MusicToggleProps = {
  tracks: string[];
};

export default function MusicToggle({ tracks }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const promptTimerRef = useRef<number | undefined>(undefined);
  const promptExitTimerRef = useRef<number | undefined>(undefined);
  const hasPromptShownRef = useRef(false);
  const [trackSrc, setTrackSrc] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [promptPhase, setPromptPhase] = useState<'hidden' | 'visible' | 'leaving'>('hidden');

  useEffect(() => {
    if (tracks.length === 0) return;

    const selectionTimer = window.setTimeout(() => {
      const nextTrack = tracks[Math.floor(Math.random() * tracks.length)];

      setTrackSrc(nextTrack);
    }, 0);

    return () => window.clearTimeout(selectionTimer);
  }, [tracks]);

  useEffect(() => {
    const showMusicPrompt = () => {
      if (hasPromptShownRef.current || tracks.length === 0) return;

      hasPromptShownRef.current = true;
      setPromptPhase('visible');
      promptTimerRef.current = window.setTimeout(() => {
        setPromptPhase('leaving');
        promptExitTimerRef.current = window.setTimeout(() => setPromptPhase('hidden'), 420);
      }, 5600);
    };

    window.addEventListener('wedding-opening-complete', showMusicPrompt);

    return () => {
      window.removeEventListener('wedding-opening-complete', showMusicPrompt);
      window.clearTimeout(promptTimerRef.current);
      window.clearTimeout(promptExitTimerRef.current);
    };
  }, [tracks.length]);

  const dismissPrompt = () => {
    window.clearTimeout(promptTimerRef.current);
    window.clearTimeout(promptExitTimerRef.current);
    setPromptPhase('leaving');
    promptExitTimerRef.current = window.setTimeout(() => setPromptPhase('hidden'), 420);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (promptPhase !== 'hidden') dismissPrompt();

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
    <>
      {trackSrc && (
        <audio
          ref={audioRef}
          src={trackSrc}
          loop
          preload="none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
      {promptPhase !== 'hidden' && (
        <button
          type="button"
          className={`${styles.musicPrompt} ${promptPhase === 'leaving' ? styles.musicPromptLeaving : ''}`}
          onClick={toggleMusic}
          aria-label="신랑 신부가 고른 배경음악 재생하기"
        >
          <span className={styles.promptIcon} aria-hidden="true">
            <Music2 />
          </span>
          <span className={styles.promptCopy}>
            <strong>신랑 신부가 고른 배경음악이 있어요</strong>
            <span>음악과 함께 저희의 추억을 감상해 주세요</span>
          </span>
          <span className={styles.promptAction} aria-hidden="true">재생</span>
        </button>
      )}
      <div className={styles.control}>
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
    </>
  );
}
