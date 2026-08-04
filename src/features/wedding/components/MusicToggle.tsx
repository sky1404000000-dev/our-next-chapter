'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';
import { weddingData } from '@/data/weddingData';
import styles from './MusicToggle.module.css';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.control}>
      <audio ref={audioRef} src={weddingData.music.src} loop preload="none" />
      <button type="button" className={styles.button} onClick={toggleMusic} aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}>
        {isPlaying ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
      </button>
    </div>
  );
}
