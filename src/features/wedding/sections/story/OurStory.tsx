'use client';

import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';
import styles from './OurStory.module.css';

const storyStartDate = new Date(2019, 10, 3);

function getDaysTogether() {
  const today = new Date();
  const start = new Date(storyStartDate.getFullYear(), storyStartDate.getMonth(), storyStartDate.getDate());
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.floor((current.getTime() - start.getTime()) / 86400000) + 1;
}

export default function OurStory() {
  const { story } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const daysTogether = getDaysTogether();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <section className={`section ${styles.storySection}`} id="our-story">
      <span className="section-kicker">{story.kicker}</span>
      <h2>{story.title}</h2>

      <article className={styles.storyCard}>
        <div className={styles.storyHeader}>
          <p>함께 보낸 소중한 날</p>
          <strong className={styles.daysCount} suppressHydrationWarning>
            + {daysTogether.toLocaleString('ko-KR')}<small>일</small>
          </strong>
        </div>

        <Image
          src={story.coverImage}
          alt={story.coverAlt}
          width={720}
          height={720}
          className={styles.storyCover}
        />

        <div className={styles.storyArchive}>
          <p className={styles.archiveMeta}>
            <span>Collection :</span>
            <span>Ongoing Records</span>
          </p>
          <p className={styles.archiveScript}>Our story</p>
        </div>
        <p className={styles.archiveCaption}>Milestone Documentation. These moments, carefully documented and lovingly preserved.</p>

        <button type="button" className={styles.openButton} onClick={() => setIsOpen(true)}>
          이야기 시작하기
          <span aria-hidden>
            <ArrowRight />
          </span>
        </button>
      </article>

      {isOpen && createPortal(
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={story.title}>
          <button type="button" className={styles.backdrop} onClick={() => setIsOpen(false)} aria-label="인터뷰 닫기" />
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <h3>{story.title}</h3>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="인터뷰 닫기">
                <X aria-hidden />
              </button>
            </header>

            <div className={styles.content}>
              {story.questions.map((item, index) => (
                <section key={`${item.question}-${index}`} className={styles.question}>
                  <h4>{item.question}</h4>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.imageAlt ?? item.question}
                      width={720}
                      height={430}
                      className={styles.questionImage}
                    />
                  )}
                  <p className="multiline">{item.answer}</p>
                </section>
              ))}
            </div>
          </article>
        </div>,
        document.body
      )}
    </section>
  );
}
