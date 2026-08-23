'use client';

import Image from 'next/image';
import { ExternalLink, MapPin, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';
import styles from './PohangGuide.module.css';

type FolderStyle = CSSProperties & {
  '--folder-color': string;
  '--folder-accent': string;
};

type PohangPlace = {
  title: string;
  image: string;
  description: string;
  tip?: string;
  tags?: string[];
  link?: string;
};

type PohangFolder = {
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  items: PohangPlace[];
};

const closeAnimationDuration = 300;

const guideFolders: PohangFolder[] = [
  {
    title: '신랑 & 신부 가족 픽',
    subtitle: '광양남자도 인정한 곳부터 맛잘알 가족들의 추천까지 야무지게 담았습니다 :)',
    color: '#CFEFD6',
    accent: '#8c5f55',
    items: [
      {
        title: '죽천회타운',
        image: '/images/guide/places/jukcheon.jpg',
        description: '광양남자도 고개 끄덕인 포항식 물회.',
        tip: '오빠랑 저는 여기 가면 늘 참가자미 물회를 먹어요.\n책상 위에 장을 조금 더 넣고, 꼭 “얼음 주세요!” 해서 얼음까지 넣어 시원하게 먹는 게 포인트예요 :)',
        tags: ['만인의 픽', '포항물회', '참가자미물회', '포항맛집'],
        link: 'https://naver.me/54LFfj02'
      },
      {
        title: '논스탠다드 양덕점',
        image: '/images/guide/places/nonstandard.jpg',
        description: '야채 싫어 신부도 반한 아보리코 샐러드 피자.',
        tip: '야채 싫어하는 신부도 아보리코 샐러드 피자에는\n마음을 열었어요.',
        tags: ['신부픽', '아보리코샐러드피자', '포항피자', '양덕맛집'],
        link: 'https://naver.me/F0zWLC5F'
      },
      {
        title: '꼬막짬뽕',
        image: '/images/guide/places/kkomak.png',
        description: '꼬막 듬뿍 들어간 얼큰한 해장 추천 한 그릇.',
        // tip: '꼬막이 듬뿍 들어간 시원한 짬뽕이라 해장 코스로도 추천해요.',
        tags: ['신부부모님픽', '꼬막짬뽕', '해장추천', '포항맛집'],
        link: 'https://naver.me/5ISzbqIv'
      },
      {
        title: '미남장어',
        image: '/images/guide/places/minam-eel.jpg',
        description: '오동통한 장어를 바로 구워 든든하게 채우는 한 끼',
        tip: '손질된 장어를 눈으로 직접보고 선택해 \n 구워먹을 수 있는 식육식당st의 식당이에요.',
        tags: ['신부가족픽', '미남장어', '장어맛집', '든든한한끼'],
        link: 'https://naver.me/GHv0s3xh'
      },
      {
        title: '사슴',
        image: '/images/guide/places/saseum-pub.jpg',
        description: '진하고 꾸덕한 매콤 크림 관자 수제비와 감성적인 분위기를 신부 동생이 추천한 곳.',
        // tip: '매콤한 끝맛과 진하고 꾸덕한 크림이 잘 어우러진 관자 수제비가 핵심이에요. 분위기 좋은 실내에서 술과 안주를 천천히 즐겨보세요.',
        tags: ['신부동생픽', '사슴', '매콤크림관자수제비', '영일대술집'],
        link: 'https://naver.me/5VmtfVi5'
      }
    ]
  },
  {
    title: '포항 토박이 픽',
    subtitle: '“너만 아는 데 있지?” 하고 포항 지인들에게 슬쩍 압박(?)해서 얻어낸 맛집 리스트',
    color: '#FDF6C9',
    accent: '#8a6b37',
    items: [
      {
        title: '카츠닉',
        image: '/images/guide/places/katsunik.png',
        description: '겉은 바삭하고 속은 촉촉한 돈카츠 맛집',
        tip: '도톰한 돈카츠가 맛있다고 추천받아, 저희도 다음 포항 코스로 저장해뒀어요.',
        tags: ['신부친구픽', '카츠닉', '돈카츠맛집', '포항맛집'],
        link: 'https://naver.me/5T0X5Iw6'
      },
      {
        title: '조셉',
        image: '/images/guide/places/joseph-gnocchi.jpg',
        description: '부드러운 뇨끼로 신부 친구가 꼽은 효자동 양식 맛집',
        tip: '뇨끼와 생면 파스타가 잘 어울리는 아담한 식당이에요. 자리가 많지 않아 네이버 예약 후 방문하는 걸 추천해요.',
        tags: ['신부친구픽', '조셉', '뇨끼', '효자동맛집'],
        link: 'https://naver.me/5yPJIh8j'
      },
      {
        title: '고바우식당',
        image: '/images/guide/places/gobawoo-jumulleok.jpg',
        description: '포항 현지인들이 주물럭 생각날 때 찾는\n 노포 감성 맛집',
        // tip: '양념이 진하게 밴 돼지주물럭을 쌈과 함께 즐기기 좋은 곳이에요. 오래된 식당 특유의 편안한 분위기라 든든한 한 끼나 술자리 모두 잘 어울려요.',
        tags: ['신부친구픽', '고바우식당', '돼지주물럭', '포항노포'],
        link: 'https://naver.me/5chyXO3G'
      },
      {
        title: '해동반점',
        image: '/images/guide/places/haedong-banjeom.jpg',
        description: '오랜 시간 동네를 지켜온 정겨운 중화요리 집',
        tip: '화려함보다 익숙하고 편안한\n 노포의 맛을 좋아한다면 들러보세요.',
        tags: ['친구추천픽', '해동반점', '간짜장', '포항노포'],
        link: 'https://naver.me/IItc21qH'
      },
      {
        title: '여남 동해횟집',
        image: '/images/guide/places/yeonam-donghae-hoe.jpg',
        description: '죽천회타운과 비교해도 손색없다는 신부 친구가 강력 추천한 물회',
        // tip: '시원한 물회와 따뜻한 매운탕을 함께 즐기기 좋다고 해요. 물회를 좋아하는 신부도 친구의 강력 추천을 받고 곧 방문해볼 예정이에요.',
        tags: ['신부친구픽', '여남동해횟집', '포항물회', '신부방문예정'],
        link: 'https://naver.me/F1rxxamN'
      },
      {
        title: '스시온',
        image: '/images/guide/places/susion.jpg',
        description: '사장님한테 뽀뽀해주고 싶은 맛이라고 신부 친구가 추천한 숙성회 초밥 맛집',
        tags: ['신부친구픽', '스시온', '숙성회', '초밥맛집'],
        link: 'https://naver.me/FEUaqGrj'
      },
      {
        title: '연일 개미집',
        image: '/images/guide/places/yeonil-gaemijip.jpg',
        description: '달큰매콤한 양념 맛이 제대로인 연일 맛집',
        tip: '감자사리는 꼭 추가하고 돈까스도 같이 시켜서 \n양념에 찍어 먹는 조합을 신부 친구가 강추했어요.',
        tags: ['신부친구픽', '연일개미집', '감자사리', '돈까스'],
        link: 'https://naver.me/x5Gok1EX'
      }
    ]
  },
  {
    title: '카페인 수혈은 여기',
    subtitle: '밥먹고 카페는 가셔야죠? 카페와 디저트까지 야무지게 받아 적었습니다.',
    color: '#FFD9B5',
    accent: '#607f77',
    items: [
      {
        title: '원스페이보릿 나타',
        image: '/images/guide/places/egg-tart.png',
        description: '에그타르트 맛집으로 추천받아 저장해둔 곳.',
        tip: '신부 친구에게 추천받아 저장해둔 곳이라 저희도 궁금한 디저트 코스예요.',
        tags: ['신부친구픽', '에그타르트', '디저트카페', '포항카페'],
        link: 'https://naver.me/GsjksrQr'
      },
      {
        title: '그린어스',
        image: '/images/guide/places/greenearth.png',
        description: '시그니처 푸딩 추천을 받아 적어둔 카페.',
        // tip: '시그니처 푸딩이 좋다고 추천받아 적어둔, 살짝 궁금한 카페예요.',
        tags: ['신부친구픽', '그린어스', '시그니처푸딩', '포항카페'],
        link: 'https://naver.me/FQVDcjSf'
      },
      {
        title: '하이퍼리얼',
        image: '/images/guide/places/hyperreal-coffee.jpg',
        description: '나무를 품은 통유리 공간과 편안한 분위기가 좋다며 신부 친구가 추천한 카페.',
        tip: '환호공원과 스페이스 워크를 둘러본 뒤 연결하기 좋은 코스예요. 넓은 창가와 테라스에서 계절의 풍경을 보며 커피 한잔을 즐겨보세요.',
        tags: ['신부친구픽', '하이퍼리얼', '환호공원카페', '통유리카페'],
        link: 'https://naver.me/5jJrr7tJ'
      }
    ]
  },
  {
    title: '산책 코스는 여기',
    subtitle: '바다를 보고 걷기도 하고, 조금 더 포항을 즐기고 싶은 분들을 위한 코스',
    color: '#DEE3FD',
    accent: '#7b6a82',
    items: [
      {
        title: '스페이스 워크',
        image: '/images/guide/places/spacewalk.jpg',
        description: '밥 먹고 바로 가기 아쉬울 때 바람 쐬기 좋은 포항 대표 코스.',
        tip: '바람 불면 살짝 흔들린다고 해서 고소공포증 있는 분들은 마음의 준비를!',
        tags: ['스페이스워크', '포항산책', '고소공포증주의', '사진남기기'],
        link: 'https://naver.me/IDFUxVu0'
      },
      {
        title: '송도해수욕장 치킨거리',
        image: '/images/guide/places/songdo-chicken-street.png',
        description: '송도 바다와 포항의 밤풍경을 안주 삼아 치맥하기 좋은 야장 거리.',
        tip: '해 질 무렵 송도 해안길을 따라 늘어선 치킨집 중 마음에 드는 곳을 골라보세요. 바닷바람 맞으며 밖에서 마시는 첫 생맥주가 이 코스의 핵심이에요.',
        tags: ['송도해수욕장', '포항야장', '바다보며치맥', '포항핫플'],
        link: 'https://naver.me/5ssJdGQI'
      },
      {
        title: '영일대 해상누각',
        image: '/images/guide/places/yeongildae-pavilion.jpg',
        description: '식사 전후 바닷바람을 쐬며 포항다운 풍경을 편안하게 즐기기 좋은 곳.',
        tip: '영일대 해변을 따라 가볍게 걷고, 해상누각에 올라 탁 트인 바다를 바라보세요. 낮에는 청량한 바다를, 해가 진 뒤에는 누각과 포항의 밤풍경을 즐길 수 있어요.',
        tags: ['영일대해상누각', '포항바다산책', '바람쐬기', '포항야경'],
        link: 'https://naver.me/G2E78HNw'
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
