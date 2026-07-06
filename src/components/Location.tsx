'use client';

import Image from 'next/image';
import { Bus, Car, ImageIcon, MapPin, Navigation, X } from 'lucide-react';
import { useState } from 'react';
import { weddingData } from '@/data/weddingData';
import NaverMap from '@/components/NaverMap';

export default function Location() {
  const { location, weddingInfo } = weddingData;
  const [isMapImageOpen, setIsMapImageOpen] = useState(false);

  return (
    <section className="section" id="location">
      <span className="section-kicker">LOCATION</span>
      <h2>{location.title}</h2>
      <div className="map-card card">
        <div className="venue-heading">
          <p>{weddingInfo.venue} {weddingInfo.venueSub}</p>
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
            네이버지도
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
            시내버스로 오시는 경우
          </h3>
          <p>
            <strong>700, 306, 216, 110(111)번</strong>
            포항시청 좌측편, 대이동 주민센터 맞은편
          </p>
        </article>

        <article className="location-guide-item">
          <h3>
            <Car aria-hidden />
            자가용으로 오시는 경우
          </h3>
          <p>
            <strong>대구-포항 고속도로 이용시</strong>
            포항 요금소 직진 이동 &gt; 시청 방향으로 직진 &gt; SK·GS 이동주유소 사거리 직진 &gt; 포항시청 삼거리 좌회전 &gt; 시청 앞 삼거리 우회전 &gt; THE QUEEN
          </p>
          <p>
            <strong>경주-포항 도로 이용 시</strong>
            경주IC 직진 &gt; 7번 국도와 만나는 사거리에서 포항 방면으로 우회전 후 포항까지 진입 &gt; 대잠사거리 좌회전 후 직진 &gt; 포항시청 삼거리 우회전 &gt; 시청 앞 삼거리 우회전 &gt; THE QUEEN
          </p>
        </article>

        <article className="location-guide-item">
          <h3>
            <MapPin aria-hidden />
            주차 안내
          </h3>
          <p>
            <strong>THE QUEEN 주차장 이용</strong>
            포항시청 지하주차장, 노면주차장 이용 가능
          </p>
        </article>
      </div>

      {isMapImageOpen && (
        <div className="map-image-modal" role="dialog" aria-modal="true" aria-label="약도 이미지">
          <button type="button" className="map-modal-backdrop" onClick={() => setIsMapImageOpen(false)} aria-label="닫기" />
          <div className="map-modal-card">
            <button type="button" className="map-modal-close" onClick={() => setIsMapImageOpen(false)} aria-label="약도 이미지 닫기">
              <X aria-hidden />
            </button>
            <Image
              src={location.mapImage}
              alt={location.mapAlt}
              width={900}
              height={620}
              className="map-modal-image"
            />
          </div>
        </div>
      )}
    </section>
  );
}
