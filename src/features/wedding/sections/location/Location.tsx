'use client';

import Image from 'next/image';
import { Bus, Car, ImageIcon, MapPin, Navigation, X } from 'lucide-react';
import { useState } from 'react';
import { weddingData } from '@/data/weddingData';
import NaverMap from './NaverMap';

export default function Location() {
  const { location, weddingInfo } = weddingData;
  const [isMapImageOpen, setIsMapImageOpen] = useState(false);

  return (
    <section className="section" id="location">
      <span className="section-kicker">LOCATION</span>
      <h2>{location.title}</h2>
      <div className="map-card card">
        <div className="venue-heading">
          <p>
            {weddingInfo.venue} {weddingInfo.venueSub}
          </p>
          <span>{weddingInfo.address}</span>
          <small>{location.phone}</small>
        </div>

        <div className="map-placeholder">
          <NaverMap
            lat={location.coordinates.lat}
            lng={location.coordinates.lng}
            title={location.mapDescription}
            fallbackImage={location.mapImage}
            fallbackAlt={location.mapAlt}
          />
        </div>

        <div className="map-link-bar" aria-label="지도 앱으로 길찾기">
          <a href={location.links.naver} target="_blank" rel="noreferrer">
            <Navigation aria-hidden />
            네이버 지도
          </a>
          <a href={location.links.kakao} target="_blank" rel="noreferrer">
            <MapPin aria-hidden />
            카카오맵
          </a>
        </div>

        <button type="button" className="map-image-button" onClick={() => setIsMapImageOpen(true)}>
          <ImageIcon aria-hidden />
          약도 이미지 보기
        </button>
      </div>

      <div className="location-guide">
        <article className="location-guide-item">
          <h3>
            <Bus aria-hidden />
            대중교통으로 오시는 경우
          </h3>
          <p>
            <strong>포항시청 인근 정류장</strong>
            예식장 주변 정류장에서 하차 후 도보로 이동하실 수 있습니다.
          </p>
        </article>

        <article className="location-guide-item">
          <h3>
            <Car aria-hidden />
            자가용으로 오시는 경우
          </h3>
          <p>
            <strong>포항 더퀸</strong>
            내비게이션에 예식장명 또는 주소를 입력해 주세요.
          </p>
        </article>

        <article className="location-guide-item">
          <h3>
            <MapPin aria-hidden />
            주차 안내
          </h3>
          <p className="multiline">{location.parking}</p>
        </article>
      </div>

      {isMapImageOpen && (
        <div className="map-image-modal" role="dialog" aria-modal="true" aria-label="약도 이미지">
          <button type="button" className="map-modal-backdrop" onClick={() => setIsMapImageOpen(false)} aria-label="닫기" />
          <div className="map-modal-card">
            <button type="button" className="map-modal-close" onClick={() => setIsMapImageOpen(false)} aria-label="약도 이미지 닫기">
              <X aria-hidden />
            </button>
            <Image src={location.mapImage} alt={location.mapAlt} width={900} height={620} className="map-modal-image" />
          </div>
        </div>
      )}
    </section>
  );
}
