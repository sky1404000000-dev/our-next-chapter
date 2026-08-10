'use client';

import Image from 'next/image';
import { ExternalLink, MapPin, X } from 'lucide-react';
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
  tags?: string[];
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
        label: '물회',
        title: '죽천회타운',
        description: '포항 바다 쪽으로 왔다면 시원하게 한 그릇 먹고 가기 좋은 곳.',
        feature: '오빠랑 저는 항상 참가자미 물회를 먹어요.',
        image: '/images/guide/places/jukcheon.jpg',
        pickedBy: '광양남자 픽',
        pickNote: '광양남자도 고개 끄덕인 포항식 물회.',
        tags: ['광양남자픽', '포항물회', '참가자미물회', '포항맛집'],
        link: 'https://naver.me/54LFfj02'
      },
      {
        label: '피자',
        title: '논스탠다드 양덕점',
        description: '가볍게 먹고 싶은데 맛은 놓치고 싶지 않을 때 좋은 선택.',
        feature: '아보리코 샐러드 피자는 꼭 한 번 먹어봤으면 하는 메뉴예요.',
        image: '/images/guide/places/nonstandard.jpg',
        pickedBy: '신부 픽',
        pickNote: '야채 싫어 신부도 반한 아보리코 샐러드 피자.',
        tags: ['신부픽', '아보리코샐러드피자', '포항피자', '양덕맛집'],
        link: 'https://naver.me/F0zWLC5F'
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
        description: '포항 분위기를 가장 빠르게 느낄 수 있는 대표 시장.',
        feature: '해산물이나 간단한 먹거리 둘러보기 좋아요.',
        image: '/images/guide/market.svg',
        pickedBy: '포항 거주민 픽',
        pickNote: '멀리서 오신 분들이 포항을 구경하기 좋은 기본 코스.',
        tags: ['로컬시장', '해산물', '포항구경', '죽도시장'],
        link: 'https://map.naver.com/p/search/죽도시장'
      },
      {
        label: '밥집',
        title: '포항 로컬 한 끼',
        description: '예식 전후로 부담 없이 들르기 좋은 식사 후보.',
        feature: '실제 추천 장소가 정해지면 이름과 링크만 바꾸면 돼요.',
        image: '/images/guide/food.svg',
        pickedBy: '지인 추천 픽',
        pickNote: '포항 사람들이 자주 가는 밥집 위주로 채워둘 자리.',
        tags: ['로컬맛집', '식사추천', '포항밥집'],
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
        title: '오션뷰 카페',
        description: '바다 보면서 잠깐 숨 고르기 좋은 카페 후보.',
        feature: '식 전후 시간이 애매할 때 쉬어가기 좋아요.',
        image: '/images/guide/cafe.svg',
        pickedBy: '신부 픽',
        pickNote: '사진도 남기고 커피도 마시기 좋은 쉬는 코스.',
        tags: ['오션뷰카페', '커피한잔', '포항카페'],
        link: 'https://map.naver.com/'
      },
      {
        label: '디저트',
        title: '디저트 카페',
        description: '가볍게 앉아서 이야기 나누기 좋은 달달한 코스.',
        feature: '커피보다 디저트가 당기는 분들께 추천할 자리예요.',
        image: '/images/guide/cafe.svg',
        pickedBy: '둘이 고른 픽',
        pickNote: '예식 끝나고 바로 돌아가기 아쉬울 때 들르기 좋은 곳.',
        tags: ['디저트', '카페추천', '쉬어가기'],
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
        description: '바다와 오래된 골목 분위기를 같이 볼 수 있는 곳.',
        feature: '시간 여유가 있을 때 드라이브 코스로 좋아요.',
        image: '/images/guide/guryongpo.svg',
        pickedBy: '둘의 픽',
        pickNote: '포항 바다를 조금 더 오래 보고 싶은 분들께 추천.',
        tags: ['구룡포', '바다드라이브', '포항산책'],
        link: 'https://map.naver.com/p/search/구룡포'
      },
      {
        label: '코스',
        title: '바다 드라이브',
        description: '차로 움직이기 편한 포항 바다 코스.',
        feature: '주차와 이동 시간이 편한 곳 위주로 더 채워두면 좋아요.',
        image: '/images/guide/spacewalk.svg',
        pickedBy: '둘이 함께 픽',
        pickNote: '식 전후로 바람 쐬고 싶을 때 부담 없는 선택.',
        tags: ['드라이브', '바다코스', '사진남기기'],
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
      <p className="section-description">포항에서 잠깐 열어보면 좋을 추천 폴더를 모아두었습니다.</p>

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
                        {item.tags?.length ? (
                          <div className={styles.placeTags} aria-label={`${item.title} 추천 태그`}>
                            {item.tags.map((tag) => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <span className={styles.placeMeta}>{item.pickedBy}</span>
                        )}
                        <h4>{item.title}</h4>
                        <p className={styles.placeReason}>{item.pickNote}</p>
                        {item.feature && (
                          <p className={styles.placeTip}>
                            <strong>꿀팁</strong>
                            {item.feature}
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
