'use client';

import Image from 'next/image';
import { ExternalLink, MapPin, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { guideFolders, type PohangFolder } from '@/data/editableContent';
import { weddingData } from '@/data/weddingData';
import styles from './PohangGuide.module.css';

type FolderStyle = CSSProperties & {
  '--folder-color': string;
  '--folder-accent': string;
};

const closeAnimationDuration = 300;

function getFolderStyle(folder: PohangFolder): FolderStyle {
  return {
    '--folder-color': folder.color,
    '--folder-accent': folder.accent
  };
}

export default function PohangGuide() {
  const { pohangGuide } = weddingData;
  const [selectedFolder, setSelectedFolder] = useState<PohangFolder | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFolder = (folder: PohangFolder) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setSelectedFolder(folder);
  };

  const closeFolder = useCallback(() => {
    if (isClosing) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSelectedFolder(null);
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setSelectedFolder(null);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, closeAnimationDuration);
  }, [isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedFolder) return;

    const originalOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFolder();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [closeFolder, selectedFolder]);

  return (
    <section className="section" id="pohang-guide">
      <span className="section-kicker">GUIDE</span>
      <h2>{pohangGuide.title}</h2>
      <p className="section-description">{pohangGuide.intro}</p>

      <div className={styles.folderCard}>
        <div className={styles.folderGrid} aria-label="포항 추천 폴더">
          {guideFolders.map((folder) => (
            <button
              type="button"
              className={styles.folderButton}
              style={getFolderStyle(folder)}
              key={folder.title}
              onClick={() => openFolder(folder)}
              aria-label={`${folder.title} 열기`}
            >
              <span className={styles.folderIcon}>
                <em>{folder.items.length}</em>
              </span>
              <span className={styles.folderLabel}>
                <strong>{folder.title}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedFolder &&
        createPortal(
          <div
            className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedFolder.title} 상세 보기`}
          >
            <button type="button" className={styles.backdrop} onClick={closeFolder} aria-label="포항 가이드 닫기" />
            <article className={styles.panel}>
              <header className={styles.panelHeader} style={getFolderStyle(selectedFolder)}>
                <span className={styles.panelTabLabel}>POHANG GUIDE</span>
                <div>
                  <h3>{selectedFolder.title}</h3>
                  <p>{selectedFolder.subtitle}</p>
                </div>
                <button type="button" onClick={closeFolder} aria-label="포항 가이드 닫기">
                  <X aria-hidden />
                </button>
              </header>

              <div className={styles.modalContent}>
                <div className={styles.placeGrid}>
                  {selectedFolder.items.map((item, index) => (
                    <article className={styles.placeFile} key={`${item.title}-${index}`}>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.placeImageWrap}
                          aria-label={`${item.title} 지도 보기`}
                        >
                          <Image
                            src={item.image}
                            alt={`${item.title} 이미지`}
                            width={420}
                            height={300}
                            className={styles.placeImage}
                          />
                          <span className={styles.placeNumber}>{String(index + 1).padStart(2, '0')}</span>
                        </a>
                      ) : (
                        <div className={styles.placeImageWrap}>
                          <Image
                            src={item.image}
                            alt={`${item.title} 이미지`}
                            width={420}
                            height={300}
                            className={styles.placeImage}
                          />
                          <span className={styles.placeNumber}>{String(index + 1).padStart(2, '0')}</span>
                        </div>
                      )}
                      <div className={styles.placeText}>
                        {item.tags?.length && (
                          <div className={styles.placeTags} aria-label={`${item.title} 추천 태그`}>
                            {item.tags.map((tag) => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </div>
                        )}
                        <h4>{item.title}</h4>
                        <p className={styles.placeReason}>{item.description}</p>
                        {item.tip && (
                          <p className={styles.placeTip}>
                            <strong>꿀팁</strong>
                            {item.tip}
                          </p>
                        )}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer">
                            <MapPin aria-hidden />
                            지도 보기
                            <ExternalLink aria-hidden />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </article>
          </div>,
          document.body
        )}
    </section>
  );
}
