'use client';

import Image from 'next/image';
import { Bus, Car, Copy, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';
import NaverMap from './NaverMap';
import styles from './Location.module.css';

export default function Location() {
  const { location, weddingInfo } = weddingData;
  const [isMapImageOpen, setIsMapImageOpen] = useState(false);

  useEffect(() => {
    if (!isMapImageOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMapImageOpen]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(weddingInfo.address);
  };

  return (
    <section className="section" id="location">
      <span className="section-kicker">LOCATION</span>
      <h2>{location.title}</h2>
      <div className={`${styles.mapCard} card`}>
        <div className={styles.venueHeading}>
          <p>
            {weddingInfo.venue} {weddingInfo.venueSub}
          </p>
          <span className={styles.addressLine}>
            {weddingInfo.address}
            <button type="button" className={styles.copyAddressButton} onClick={copyAddress} aria-label="주소 복사">
              <Copy aria-hidden />
            </button>
          </span>
          <small>{location.phone}</small>
        </div>

        <div className={styles.mapPlaceholder}>
          <NaverMap
            lat={location.coordinates.lat}
            lng={location.coordinates.lng}
            title={location.mapDescription}
            fallbackImage={location.mapImage}
            fallbackAlt={location.mapAlt}
          />
        </div>

        <div className={styles.linkBar} aria-label="지도 앱으로 길찾기">
          <a href={location.links.naver} target="_blank" rel="noreferrer">
            네이버 지도
          </a>
          <a href={location.links.tmap} target="_blank" rel="noreferrer">
            티맵
          </a>
          <a href={location.links.kakao} target="_blank" rel="noreferrer">
            카카오맵
          </a>
        </div>

        <button type="button" className={styles.mapImageButton} onClick={() => setIsMapImageOpen(true)}>
          약도 이미지 보기
        </button>
      </div>

      <div className={styles.guide}>
        <article className={styles.guideItem}>
          <h3 className={styles.guideTitle}>
            <Bus aria-hidden />
            시내버스로 오시는 경우
          </h3>

          <div className={styles.guideContent}>
            <p className={styles.guideMain}>
              <strong>이용 가능 버스</strong>
              <span>700, 306, 216, 110(111)번</span>
            </p>

            <p className={styles.guideDescription}>
              포항시청 정류장에서 하차 후,
              <br />
              더퀸호텔 앞 횡단보도를 이용해 주세요.
            </p>
          </div>
        </article>

        <article className={styles.guideItem}>
          <h3 className={styles.guideTitle}>
            <Car aria-hidden />
            자가용으로 오시는 경우
          </h3>

          <div className={styles.guideContent}>
            <div className={styles.routeItem}>
              <strong>대구·포항고속도로 이용 시</strong>
              <p>
                포항 요금소 직진 → 시청 방향 직진 →
                <br />
                SK·GS 이동주유소 사거리 직진 →
                <br />
                포항시청 사거리 직진 →
                <br />
                시청 앞 삼거리 우회전 → THE QUEEN
              </p>
            </div>

            <div className={styles.routeDivider} />

            <div className={styles.routeItem}>
              <strong>경주 → 포항 도로 이용 시</strong>
              <p>
                경주IC 직진 → 7번 국도 사거리에서 포항 방면 우회전 →
                <br />
                포항 방면 직진 → 대잠사거리 좌회전 후 직진 →
                <br />
                포항시청 삼거리 우회전 →
                <br />
                시청 앞 삼거리 우회전 → THE QUEEN
              </p>
            </div>
          </div>
        </article>

        <article className={styles.guideItem}>
          <h3 className={styles.guideTitle}>
            <MapPin aria-hidden />
            주차 안내
          </h3>

          <div className={styles.guideContent}>
            <p className={styles.guideMain}>
              <strong>포항시청 주차장 이용 가능</strong>
              <span>지하주차장 및 노면주차장을 이용해 주세요.</span>
            </p>

            <p className={styles.guideDescription}>
              더퀸 전용 주차장은 혼주 및 행사 관계자 우선으로 운영됩니다.
              <br />
              주말에는 주차장이 혼잡할 수 있으니 여유 있게 도착해 주세요.
            </p>
          </div>
        </article>
      </div>

      {isMapImageOpen && typeof document !== 'undefined' && createPortal(
        <div className={styles.mapImageModal} role="dialog" aria-modal="true" aria-label="약도 이미지">
          <button type="button" className={styles.modalBackdrop} onClick={() => setIsMapImageOpen(false)} aria-label="닫기" />
          <div className={styles.modalCard}>
            <button type="button" className={styles.modalClose} onClick={() => setIsMapImageOpen(false)} aria-label="약도 이미지 닫기">
              <X aria-hidden />
            </button>
            <Image src={location.mapImage} alt={location.mapAlt} width={900} height={620} className={styles.modalImage} />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
