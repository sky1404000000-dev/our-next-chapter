'use client';

import Image from 'next/image';
import { Bus, Car, CircleParking, Copy, Map, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { weddingData } from '@/data/weddingData';
import NaverMap from './NaverMap';
import styles from './Location.module.css';

const closeAnimationDuration = 360;

export default function Location() {
  const { location, weddingInfo } = weddingData;
  const [isMapImageOpen, setIsMapImageOpen] = useState(false);
  const [isMapImageClosing, setIsMapImageClosing] = useState(false);
  const [isAddressToastOpen, setIsAddressToastOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMapImage = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsMapImageClosing(false);
    setIsMapImageOpen(true);
  };

  const closeMapImage = useCallback(() => {
    if (isMapImageClosing) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsMapImageOpen(false);
      return;
    }

    setIsMapImageClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsMapImageOpen(false);
      setIsMapImageClosing(false);
      closeTimerRef.current = null;
    }, closeAnimationDuration);
  }, [isMapImageClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (addressToastTimerRef.current) clearTimeout(addressToastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMapImageOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMapImage();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [closeMapImage, isMapImageOpen]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(weddingInfo.address);
    if (addressToastTimerRef.current) clearTimeout(addressToastTimerRef.current);

    setIsAddressToastOpen(true);
    addressToastTimerRef.current = setTimeout(() => {
      setIsAddressToastOpen(false);
      addressToastTimerRef.current = null;
    }, 1500);
  };

  const openTmap = () => {
    const { lat, lng } = location.coordinates;
    const destination = encodeURIComponent(`${weddingInfo.venue} ${weddingInfo.venueSub}`);
    const userAgent = navigator.userAgent;

    if (/Android/i.test(userAgent)) {
      const fallbackUrl = encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku');
      window.location.href = `intent://route?goalname=${destination}&goalx=${lng}&goaly=${lat}#Intent;scheme=tmap;package=com.skt.tmap.ku;S.browser_fallback_url=${fallbackUrl};end`;
      return;
    }

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const appStoreUrl = 'https://apps.apple.com/kr/app/id431589174';
      const fallbackTimer = window.setTimeout(() => {
        if (document.visibilityState === 'visible') window.location.href = appStoreUrl;
      }, 2200);

      document.addEventListener(
        'visibilitychange',
        () => {
          if (document.visibilityState === 'hidden') window.clearTimeout(fallbackTimer);
        },
        { once: true }
      );

      window.location.href = `tmap://route?rGoName=${destination}&rGoX=${lng}&rGoY=${lat}`;
      return;
    }

    void navigator.clipboard.writeText(weddingInfo.address);
    window.alert('티맵 길안내는 휴대폰에서 이용해 주세요. 예식장 주소를 복사했습니다.');
  };

  return (
    <section className="section" id="location">
      <span className="section-kicker">LOCATION</span>
      <h2>{location.title}</h2>
      <div className={styles.mapCard}>
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

        <button type="button" className={`${styles.mapActionButton} ${styles.mapImageButton}`} onClick={openMapImage}>
          <Map aria-hidden className={styles.mapImageIcon} />
          약도 이미지 보기
        </button>

        <div className={styles.navigationPanel}>
          <h3>네비게이션</h3>
          <p className={styles.mapAppGuide}>원하시는 앱을 선택하시면 길안내가 시작됩니다.</p>
          <div className={styles.linkBar} aria-label="지도 앱으로 길찾기">
            <a href={location.links.naver} target="_blank" rel="noreferrer" className={styles.mapActionButton}>
              <Image src="/images/map/naver.webp" alt="" width={20} height={20} className={styles.mapAppIcon} />
              네이버 지도
            </a>
            <button type="button" onClick={openTmap} className={styles.mapActionButton}>
              <Image src="/images/map/tmap.webp" alt="" width={20} height={20} className={`${styles.mapAppIcon} ${styles.tmapIcon}`} />
              티맵
            </button>
            <a href={location.links.kakao} target="_blank" rel="noreferrer" className={styles.mapActionButton}>
              <Image src="/images/map/kakao.webp" alt="" width={20} height={20} className={styles.mapAppIcon} />
              카카오내비
            </a>
          </div>
        </div>
      </div>

      <div className={styles.guide}>
        <article className={styles.guideItem}>
          <h3 className={styles.guideTitle}>
            <span className={styles.guideIcon} aria-hidden>
              <Bus />
            </span>
            시내버스로 오시는 경우
          </h3>

          <div className={styles.guideContent}>
            <div className={styles.guidePoint}>
              <p className={styles.guidePointTitle}>
                <strong>이용 가능 버스</strong>
              </p>
              <p className={styles.guidePointBody}>700, 306, 216, 110(111)번</p>
            </div>

            <p className={styles.guideNote}>
              포항시청 정류장에서 하차 후,
              <br />
              더퀸호텔 앞 횡단보도를 이용해 주세요.
            </p>
          </div>
        </article>

        <article className={styles.guideItem}>
          <h3 className={styles.guideTitle}>
            <span className={styles.guideIcon} aria-hidden>
              <Car />
            </span>
            자가용으로 오시는 경우
          </h3>

          <div className={styles.guideContent}>
            <div className={styles.routeItem}>
              <p className={styles.guidePointTitle}>
                <strong>대구·포항고속도로 이용 시</strong>
              </p>
              <p className={styles.guidePointBody}>
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
              <p className={styles.guidePointTitle}>
                <strong>경주 → 포항 도로 이용 시</strong>
              </p>
              <p className={styles.guidePointBody}>
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
            <span className={styles.guideIcon} aria-hidden>
              <CircleParking />
            </span>
            주차 안내
          </h3>

          <div className={styles.guideContent}>
            <div className={styles.guidePoint}>
              <p className={styles.guidePointTitle}>
                <strong>포항시청 주차장 이용 가능</strong>
              </p>
              <p className={styles.guidePointBody}>지하주차장 및 노면주차장을 이용해 주세요.</p>
            </div>

            <p className={styles.guideNote}>
              더퀸 전용 주차장은 혼주 및 행사 관계자 우선으로 운영됩니다.
              <br />
              주말에는 주차장이 혼잡할 수 있으니 여유 있게 도착해 주세요.
            </p>
          </div>
        </article>
      </div>

      {isMapImageOpen && typeof document !== 'undefined' && createPortal(
        <div
          className={`${styles.mapImageModal} ${isMapImageClosing ? styles.mapImageModalClosing : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="약도 이미지"
        >
          <button type="button" className={styles.modalBackdrop} onClick={closeMapImage} aria-label="닫기" />
          <div className={styles.modalCard}>
            <button type="button" className={styles.modalClose} onClick={closeMapImage} aria-label="약도 이미지 닫기">
              <X aria-hidden />
            </button>
            <Image src={location.mapImage} alt={location.mapAlt} width={900} height={620} className={styles.modalImage} />
          </div>
        </div>,
        document.body
      )}

      <p className={`${styles.addressCopyToast} ${isAddressToastOpen ? styles.addressCopyToastVisible : ''}`} role="status" aria-live="polite">
        주소가 복사되었습니다
      </p>
    </section>
  );
}
