'use client';

import Image from 'next/image';
import { Mail, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';

export default function OurStory() {
  const { story } = weddingData;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <section className="section interview-section" id="our-story">
      <span className="section-kicker">{story.kicker}</span>
      <h2>{story.title}</h2>
      <p className="interview-intro">{story.intro}</p>

      <Image
        src={story.coverImage}
        alt={story.coverAlt}
        width={720}
        height={720}
        className="interview-cover"
      />

      <button type="button" className="interview-open-btn" onClick={() => setIsOpen(true)}>
        <Mail aria-hidden />
        {story.buttonLabel}
      </button>

      {isOpen && createPortal(
        <div className="interview-modal" role="dialog" aria-modal="true" aria-label={story.title}>
          <button type="button" className="interview-backdrop" onClick={() => setIsOpen(false)} aria-label="인터뷰 닫기" />
          <article className="interview-panel">
            <header className="interview-panel-header">
              <h3>{story.title}</h3>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="인터뷰 닫기">
                <X aria-hidden />
              </button>
            </header>

            <div className="interview-content">
              {story.questions.map((item, index) => (
                <section key={`${item.question}-${index}`} className="interview-question">
                  <h4>{item.question}</h4>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.imageAlt ?? item.question}
                      width={720}
                      height={430}
                      className="interview-question-image"
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
