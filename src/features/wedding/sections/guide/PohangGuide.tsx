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
    title: '우리가 아껴둔 포항 맛집',
    subtitle: '저희가 좋아하는 곳부터 맛잘알 가족들의 추천까지 야무지게 담았습니다 :)',
    color: '#CFEFD6',
    accent: '#8c5f55',
    recommendedBy: '우리의 추천',
    items: [
      {
        label: '물회',
        title: '죽천회타운',
        description: '포항 바다를 봤다면 물회 한 그릇은 꽤 그럴듯한 마무리.',
        feature: '오빠랑 저는 여기 가면 늘 참가자미 물회를 먹어요.',
        image: '/images/guide/places/jukcheon.jpg',
        pickedBy: '광양남자 픽',
        pickNote: '광양남자도 고개 끄덕인 포항식 물회.',
        tags: ['광양남자픽', '포항물회', '참가자미물회', '포항맛집'],
        link: 'https://naver.me/54LFfj02'
      },
      {
        label: '피자',
        title: '논스탠다드 양덕점',
        description: '무겁지 않게 먹고 싶은데 맛은 절대 포기 못 할 때.',
        feature: '야채 싫어하는 신부도 아보리코 샐러드 피자에는 마음을 열었어요.',
        image: '/images/guide/places/nonstandard.jpg',
        pickedBy: '신부 픽',
        pickNote: '야채 싫어 신부도 반한 아보리코 샐러드 피자.',
        tags: ['신부픽', '아보리코샐러드피자', '포항피자', '양덕맛집'],
        link: 'https://naver.me/F0zWLC5F'
      },
      {
        label: '짬뽕',
        title: '꼬막짬뽕',
        description: '먼 길 오느라 쌓인 피로를 얼큰하게 풀고 싶다면.',
        feature: '꼬막이 듬뿍 들어간 시원한 짬뽕이라 해장 코스로도 추천해요.',
        image: '/images/guide/places/kkomak.png',
        pickedBy: '신부 어머님·아버님 픽',
        pickNote: '꼬막 듬뿍 들어간 얼큰한 해장 추천 한 그릇.',
        tags: ['신부부모님픽', '꼬막짬뽕', '해장추천', '포항맛집'],
        link: 'https://naver.me/5ISzbqIv'
      },
      {
        label: '장어',
        title: '미남장어',
        description: '방문하는 순간 미남미녀가 된다는 기분 좋은 이름의 장어집.',
        feature: '수산물 직판장처럼 신선한 장어를 바로 받아 구워 먹는 듯한 느낌이에요.',
        image: '/images/guide/places/minam-eel.jpg',
        pickedBy: '신부 가족 픽',
        pickNote: '오동통한 장어를 바로 구워 든든하게 채우는 한 끼.',
        tags: ['신부가족픽', '미남장어', '장어맛집', '든든한한끼'],
        link: 'https://naver.me/GHv0s3xh'
      }
    ]
  },
  {
    title: '배고프면 펼쳐보기',
    subtitle: '포항 지인이 알려준 실패 확률 낮은 밥집',
    color: '#FDF6C9',
    accent: '#8a6b37',
    recommendedBy: '지인 추천',
    items: [
      {
        label: '카츠',
        title: '카츠닉',
        description: '바삭한 한 입이 필요할 때 떠올리기 좋은 돈카츠집.',
        feature: '도톰한 돈카츠가 맛있다고 추천받아, 저희도 다음 포항 코스로 저장해뒀어요.',
        image: '/images/guide/places/katsunik.png',
        pickedBy: '신부 친구 픽',
        pickNote: '겉은 바삭하고 속은 촉촉한 돈카츠 맛집으로 추천받은 곳.',
        tags: ['신부친구픽', '카츠닉', '돈카츠맛집', '포항맛집'],
        link: 'https://naver.me/5T0X5Iw6'
      }
    ]
  },
  {
    title: '달달한 후식 후보',
    subtitle: '식 전후로 잠깐 쉬어가기 좋은 카페 메모',
    color: '#FFD9B5',
    accent: '#607f77',
    recommendedBy: '지인 추천',
    items: [
      {
        label: '디저트',
        title: '원스페이보릿 나타',
        description: '커피 옆에 바삭한 에그타르트 하나 올리고 싶은 날.',
        feature: '신부 친구에게 추천받아 저장해둔 곳이라 저희도 궁금한 디저트 코스예요.',
        image: '/images/guide/places/egg-tart.png',
        pickedBy: '신부 친구 추천',
        pickNote: '에그타르트 맛집으로 추천받아 저장해둔 곳.',
        tags: ['신부친구추천', '에그타르트', '디저트카페', '포항카페'],
        link: 'https://naver.me/GsjksrQr'
      },
      {
        label: '푸딩',
        title: '그린어스',
        description: '식사 뒤 달달한 여운을 조금 더 붙잡고 싶다면.',
        feature: '시그니처 푸딩이 좋다고 추천받아 적어둔, 살짝 궁금한 카페예요.',
        image: '/images/guide/places/greenearth.png',
        pickedBy: '신부 친구 추천',
        pickNote: '시그니처 푸딩 추천을 받아 적어둔 카페.',
        tags: ['신부친구추천', '그린어스', '시그니처푸딩', '포항카페'],
        link: 'https://naver.me/FQVDcjSf'
      }
    ]
  },
  {
    title: '포항 바람 쐬기',
    subtitle: '밥 먹고 바로 가기 아쉬운 분들을 위한 짧은 코스',
    color: '#DEE3FD',
    accent: '#7b6a82',
    recommendedBy: '둘이 함께 추천',
    items: [
      {
        label: '산책',
        title: '스페이스 워크',
        description: '포항 바다 위를 걷는 듯한 기분으로 짧게 들르기 좋은 곳.',
        feature: '바람 불면 살짝 흔들린다고 해서 고소공포증 있는 분들은 마음의 준비를!',
        image: '/images/guide/places/spacewalk.jpg',
        pickedBy: '둘이 함께 픽',
        pickNote: '밥 먹고 바로 가기 아쉬울 때 바람 쐬기 좋은 포항 대표 코스.',
        tags: ['스페이스워크', '포항산책', '고소공포증주의', '사진남기기'],
        link: 'https://naver.me/IDFUxVu0'
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
