'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './Location.module.css';

type NaverMapProps = {
  lat: number;
  lng: number;
  title: string;
  fallbackImage: string;
  fallbackAlt: string;
};

declare global {
  interface Window {
    naver?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          element: HTMLElement,
          options: {
            center: unknown;
            zoom: number;
            zoomControl: boolean;
            mapDataControl: boolean;
            scaleControl: boolean;
          }
        ) => unknown;
        Event: {
          once: (target: unknown, eventName: string, listener: () => void) => void;
        };
        Marker: new (options: { position: unknown; map: unknown; title: string }) => unknown;
      };
    };
  }
}

const naverMapKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

function loadNaverMapScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.naver?.maps) {
      resolve();
      return;
    }

    if (!naverMapKey) {
      reject(new Error('Missing Naver map client id'));
      return;
    }

    const scriptUrl = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapKey}`;

    const existingScript =
      document.querySelector<HTMLScriptElement>(
        `script[src="${scriptUrl}"]`
      );

    if (existingScript) {
      if (window.naver?.maps) {
        resolve();
        return;
      }

      existingScript.addEventListener(
        'load',
        () => {
          resolve();
        },
        { once: true }
      );

      existingScript.addEventListener(
        'error',
        () => {
          reject(new Error('Naver map script failed'));
        },
        { once: true }
      );

      return;
    }

    const script = document.createElement('script');

    script.src = scriptUrl;
    script.async = true;

    script.onload = () => resolve();

    script.onerror = () => reject(new Error('Naver map script failed'));

    document.head.appendChild(script);
  });
}

export default function NaverMap({ lat, lng, title, fallbackImage, fallbackAlt }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadNaverMapScript()
      .then(() => {
        if (!isMounted || !mapRef.current || !window.naver?.maps) return;

        const position = new window.naver.maps.LatLng(lat, lng);
        const map = new window.naver.maps.Map(mapRef.current, {
          center: position,
          zoom: 16,
          zoomControl: true,
          mapDataControl: false,
          scaleControl: true
        });

        new window.naver.maps.Marker({ position, map, title });
        setIsMapReady(true);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Naver map failed to load';
        if (process.env.NODE_ENV === 'development') {
          console.warn('[NaverMap]', message);
        }
        setIsMapReady(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lng, title]);

  return (
    <div className={styles.naverMapWrap}>
      <div ref={mapRef} className={styles.naverMap} aria-label={`${title} 네이버 지도`} />
      {!isMapReady && (
        <div className={styles.mapFallback}>
          <Image src={fallbackImage} alt={fallbackAlt} width={720} height={440} className={styles.mapImage} priority={false} />
          <span>지도가 보이지 않으면 아래 지도 앱 버튼을 눌러 확인해 주세요.</span>
        </div>
      )}
    </div>
  );
}
