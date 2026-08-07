'use client';

import Image from 'next/image';
import { ExternalLink, FolderOpen, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type PohangTip, weddingData } from '@/data/weddingData';
import styles from './PohangGuide.module.css';

type FolderStyle = CSSProperties & {
  '--folder-color': string;
  '--folder-accent': string;
};

type PohangPlace = PohangTip & {
  image: string;
  pickedBy: string;
  pickNote: string;
};

type PohangFolder = {
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  recommendedBy: string;
  items: PohangPlace[];
};

const closeAnimationDuration = 300;

const guideFolders: PohangFolder[] = [
  {
    title: '광양남자도 반한 포항',
    subtitle: '처음 와도 실패 없는 포항 대표 코스',
    color: '#f9f2b2',
    accent: '#8c5f55',
    recommendedBy: '신랑 추천',
    items: [
      {
        label: '바다',
        title: '영일대 해수욕장',
        description: '예식 전후로 산책하기 좋은 포항 대표 바다입니다.',
        feature: '바다, 산책, 사진',
        image: '/images/guide/yeongildae.svg',
        pickedBy: '광양남자 픽',
        pickNote: '포항을 잘 몰라도 가장 포항답게 느껴지는 바다 코스예요.',
        link: 'https://map.naver.com/'
      },
      {
        label: '풍경',
        title: '스페이스워크',
        description: '포항까지 왔다면 한 번쯤 들러보기 좋은 전망 명소입니다.',
        feature: '전망, 산책, 사진',
        image: '/images/guide/spacewalk.svg',
        pickedBy: '신랑 픽',
        pickNote: '사진 남기기 좋고, 식 전후 짧게 들르기에도 부담 없는 곳입니다.',
        link: 'https://map.naver.com/'
      }
    ]
  },
  {
    title: '포항 거주민들의 찐추천',
    subtitle: '로컬이 아껴둔 밥집과 시장 코스',
    color: '#CFECF3',
    accent: '#8a6b37',
    recommendedBy: '포항 지인 추천',
    items: [
      {
        label: '시장',
        title: '죽도시장',
        description: '포항의 활기와 해산물을 함께 느낄 수 있는 전통 시장입니다.',
        feature: '해산물, 로컬 맛집',
        image: '/images/guide/market.svg',
        pickedBy: '포항 거주민 픽',
        pickNote: '멀리서 오신 분들이 포항의 분위기를 가장 쉽게 느끼기 좋아요.',
        link: 'https://map.naver.com/'
      },
      {
        label: '밥집',
        title: '로컬 맛집 후보',
        description: '추천 리스트를 받으면 가장 먼저 채워 넣을 자리입니다.',
        feature: '식사, 포항 사람 추천',
        image: '/images/guide/food.svg',
        pickedBy: '지인 추천 대기',
        pickNote: '실제 맛집 이름과 메뉴를 받으면 이 카드에 바로 넣어둘게요.',
        link: 'https://map.naver.com/'
      }
    ]
  },
  {
    title: '커피 한잔 하고 가요',
    subtitle: '식 전후로 잠깐 쉬어가기 좋은 카페',
    color: '#bce4bc',
    accent: '#607f77',
    recommendedBy: '신부 추천',
    items: [
      {
        label: '카페',
        title: '오션뷰 카페 후보',
        description: '바다를 보면서 천천히 쉬어가기 좋은 카페를 넣을 예정입니다.',
        feature: '커피, 오션뷰, 휴식',
        image: '/images/guide/cafe.svg',
        pickedBy: '신부 픽',
        pickNote: '식 전후로 시간이 애매할 때 잠깐 쉬어가기 좋은 분위기로 채울게요.',
        link: 'https://map.naver.com/'
      },
      {
        label: '디저트',
        title: '디저트 카페 후보',
        description: '달달한 디저트와 함께 들르기 좋은 곳을 적어둘 공간입니다.',
        feature: '디저트, 대화, 쉬는 시간',
        image: '/images/guide/cafe.svg',
        pickedBy: '둘이 고르는 중',
        pickNote: '커피보다 디저트가 기억에 남는 곳을 넣으면 이 폴더가 살아나요.',
        link: 'https://map.naver.com/'
      }
    ]
  },
  {
    title: '포항 한 바퀴',
    subtitle: '시간이 조금 남는 분들을 위한 가벼운 드라이브',
    color: '#98b14f',
    accent: '#7b6a82',
    recommendedBy: '둘이 함께 추천',
    items: [
      {
        label: '마을',
        title: '구룡포',
        description: '시간이 천천히 흐르는 듯한 해안 마을입니다.',
        feature: '드라이브, 바다',
        image: '/images/guide/guryongpo.svg',
        pickedBy: '둘의 픽',
        pickNote: '시간이 조금 남는 분들께 포항 바다와 마을 분위기를 같이 추천하기 좋아요.',
        link: 'https://map.naver.com/'
      },
      {
        label: '코스',
        title: '바다 드라이브 후보',
        description: '여유가 있는 하객분들께 추천할 짧은 이동 코스를 넣을 자리입니다.',
        feature: '드라이브, 사진, 바람 쐬기',
        image: '/images/guide/spacewalk.svg',
        pickedBy: '코스 추천 대기',
        pickNote: '이동 시간과 주차가 편한 코스로 정리하면 하객분들이 보기 편해요.',
        link: 'https://map.naver.com/'
      }
    ]
  }
];

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
      <p className={styles.intro}>포항에서 잠깐 열어보면 좋을 추천 폴더를 모아두었습니다.</p>

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
                <em>{folder.items.length}개</em>
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
                <div>
                  <span>POHANG GUIDE</span>
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
                    <article className={styles.placeFile} key={`${item.label}-${item.title}-${index}`}>
                      <div className={styles.placeImageWrap}>
                        <Image
                          src={item.image}
                          alt={`${item.title} 이미지`}
                          width={420}
                          height={300}
                          className={styles.placeImage}
                        />
                        <span>{item.pickedBy}</span>
                      </div>
                      <div className={styles.placeText}>
                        <span>
                          <FolderOpen aria-hidden />
                          {String(index + 1).padStart(2, '0')} · {item.label}
                        </span>
                        <h4>{item.title}</h4>
                        <strong>{item.pickNote}</strong>
                        <p>{item.description}</p>
                        <dl>
                          <dt>어떤 곳?</dt>
                          <dd>{item.feature}</dd>
                        </dl>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer">
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
