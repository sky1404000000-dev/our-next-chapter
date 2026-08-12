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
    title: '여긴 저희가 책임집니다',
    subtitle: '광양남자도 인정한 곳부터 맛잘알 가족들의 추천까지 야무지게 담았습니다 :)',
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
      },
      {
        label: '요리주점',
        title: '사슴',
        description: '영일대 메인 거리의 북적임에서 살짝 벗어나 분위기 좋게 한잔하기 좋은 요리주점.',
        feature: '매콤한 끝맛과 진하고 꾸덕한 크림이 잘 어우러진 관자 수제비가 핵심이에요. 분위기 좋은 실내에서 술과 안주를 천천히 즐겨보세요.',
        image: '/images/guide/places/saseum-pub.jpg',
        pickedBy: '신부 동생 픽',
        pickNote: '진하고 꾸덕한 매콤 크림 관자 수제비와 감성적인 분위기를 신부 동생이 추천한 곳.',
        tags: ['신부동생픽', '사슴', '매콤크림관자수제비', '영일대술집'],
        link: 'https://naver.me/5VmtfVi5'
      }
    ]
  },
  {
    title: '포항인에게 물어봤습니다',
    subtitle: '“너만 아는 데 있지?” 하고 포항 지인들에게 슬쩍 압박(?)해서 얻어낸 맛집 리스트',
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
      },
      {
        label: '뇨끼',
        title: '조셉',
        description: '효자동에서 부드럽고 꾸덕한 뇨끼가 당길 때 펼쳐보는 양식 카드.',
        feature: '뇨끼와 생면 파스타가 잘 어울리는 아담한 식당이에요. 자리가 많지 않아 네이버 예약 후 방문하는 걸 추천해요.',
        image: '/images/guide/places/joseph-gnocchi.jpg',
        pickedBy: '신부 친구 추천',
        pickNote: '부드러운 뇨끼와 고소한 소스가 잘 어울린다고 신부 친구가 꼽은 효자동 양식 맛집.',
        tags: ['신부친구픽', '조셉', '뇨끼', '효자동맛집'],
        link: 'https://naver.me/5yPJIh8j'
      },
      {
        label: '주물럭',
        title: '고바우식당',
        description: '매콤한 돼지주물럭에 밥 한 공기가 생각나는 포항 현지인 노포.',
        feature: '양념이 진하게 밴 돼지주물럭을 쌈과 함께 즐기기 좋은 곳이에요. 오래된 식당 특유의 편안한 분위기라 든든한 한 끼나 술자리 모두 잘 어울려요.',
        image: '/images/guide/places/gobawoo-jumulleok.jpg',
        pickedBy: '신부 친구 추천',
        pickNote: '포항 현지인들이 주물럭 생각날 때 찾는 노포 감성 맛집으로 신부 친구가 추천한 곳.',
        tags: ['신부친구픽', '고바우식당', '돼지주물럭', '포항노포'],
        link: 'https://naver.me/5chyXO3G'
      },
      {
        label: '간짜장',
        title: '해동반점',
        description: '오래된 간판부터 동네 단골집 분위기가 느껴지는 포항의 옛날식 중화요리집.',
        feature: '고소한 간짜장과 옛날식 탕수육을 함께 즐기기 좋은 오래된 식당이에요. 화려함보다 익숙하고 편안한 노포의 맛을 좋아한다면 들러보세요.',
        image: '/images/guide/places/haedong-banjeom.jpg',
        pickedBy: '친구 추천',
        pickNote: '오랜 시간 동네를 지켜온 듯한 분위기와 정겨운 중화요리가 좋아 친구가 추천한 곳.',
        tags: ['친구추천픽', '해동반점', '간짜장', '포항노포'],
        link: 'https://naver.me/IItc21qH'
      },
      {
        label: '물회',
        title: '여남 동해횟집',
        description: '죽천회타운 못지않게 맛있다는 친구의 추천을 받은 여남동 물회 맛집.',
        feature: '시원한 물회와 따뜻한 매운탕을 함께 즐기기 좋다고 해요. 물회를 좋아하는 신부도 친구의 강력 추천을 받고 곧 방문해볼 예정이에요.',
        image: '/images/guide/places/yeonam-donghae-hoe.jpg',
        pickedBy: '신부 친구 추천',
        pickNote: '죽천회타운과 비교해도 손색없다며 신부 친구가 강력 추천한, 신부의 다음 물회 후보.',
        tags: ['신부친구픽', '여남동해횟집', '포항물회', '신부방문예정'],
        link: 'https://naver.me/F1rxxamN'
      }
    ]
  },
  {
    title: '디저트 배는 따로에요!',
    subtitle: '밥집만 물어보기 아쉬워 카페와 디저트까지 야무지게 받아 적었습니다.',
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
      },
      {
        label: '카페',
        title: '하이퍼리얼',
        description: '통유리 너머 초록을 바라보며 잠시 쉬어가기 좋은 환호공원 근처 카페.',
        feature: '환호공원과 스페이스 워크를 둘러본 뒤 연결하기 좋은 코스예요. 넓은 창가와 테라스에서 계절의 풍경을 보며 커피 한잔을 즐겨보세요.',
        image: '/images/guide/places/hyperreal-coffee.jpg',
        pickedBy: '신부 친구 추천',
        pickNote: '나무를 품은 통유리 공간과 편안한 분위기가 좋다며 신부 친구가 추천한 카페.',
        tags: ['신부친구픽', '하이퍼리얼', '환호공원카페', '통유리카페'],
        link: 'https://naver.me/5jJrr7tJ'
      }
    ]
  },
  {
    title: '소화도 시킬 겸 한 바퀴',
    subtitle: '바다도 보고 걷기도 하고, 조금 더 포항을 즐기고 싶은 분들을 위한 코스',
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
      },
      {
        label: '야장',
        title: '송도해수욕장 치킨거리',
        description: '바다를 마주한 야장에 앉아 치킨과 시원한 생맥주를 즐기기 좋은 요즘 포항 핫플.',
        feature: '해 질 무렵 송도 해안길을 따라 늘어선 치킨집 중 마음에 드는 곳을 골라보세요. 바닷바람 맞으며 밖에서 마시는 첫 생맥주가 이 코스의 핵심이에요.',
        image: '/images/guide/places/songdo-chicken-street.png',
        pickedBy: '요즘 뜨는 코스',
        pickNote: '송도 바다와 포항의 밤풍경을 안주 삼아 치맥하기 좋은 야장 거리.',
        tags: ['송도해수욕장', '포항야장', '바다보며치맥', '포항핫플'],
        link: 'https://naver.me/5ssJdGQI'
      },
      {
        label: '바다 산책',
        title: '영일대 해상누각',
        description: '해변을 천천히 걷다가 바다 위 누각에서 시원한 포항 바람을 만나는 산책 코스.',
        feature: '영일대 해변을 따라 가볍게 걷고, 해상누각에 올라 탁 트인 바다를 바라보세요. 낮에는 청량한 바다를, 해가 진 뒤에는 누각과 포항의 밤풍경을 즐길 수 있어요.',
        image: '/images/guide/places/yeongildae-pavilion.jpg',
        pickedBy: '둘이 함께 픽',
        pickNote: '식사 전후 바닷바람을 쐬며 포항다운 풍경을 편안하게 즐기기 좋은 곳.',
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
