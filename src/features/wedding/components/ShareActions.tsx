'use client';

import { Link, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { weddingData } from '@/data/weddingData';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (options: {
          objectType: 'feed';
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

const kakaoSdkUrl = 'https://developers.kakao.com/sdk/js/kakao.js';
const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
const hasKakaoKey = Boolean(kakaoKey && kakaoKey !== 'your-kakao-javascript-key');

function getPageUrl() {
  return window.location.href;
}

function loadKakaoSdk() {
  return new Promise<void>((resolve, reject) => {
    if (window.Kakao) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${kakaoSdkUrl}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = kakaoSdkUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

type ShareActionsProps = {
  compact?: boolean;
};

export default function ShareActions({ compact = false }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [kakaoFallback, setKakaoFallback] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(getPageUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const shareToKakao = async () => {
    if (!hasKakaoKey) {
      await copyLink();
      setKakaoFallback(true);
      window.setTimeout(() => setKakaoFallback(false), 1800);
      return;
    }

    await loadKakaoSdk();

    if (!window.Kakao) {
      await copyLink();
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey as string);
    }

    const pageUrl = getPageUrl();
    const imageUrl = new URL(weddingData.share.image, pageUrl).toString();

    window.Kakao.Share?.sendDefault({
      objectType: 'feed',
      content: {
        title: weddingData.share.title,
        description: weddingData.share.description,
        imageUrl,
        link: {
          mobileWebUrl: pageUrl,
          webUrl: pageUrl
        }
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: pageUrl,
            webUrl: pageUrl
          }
        }
      ]
    });
  };

  return (
    <div className={`share-actions ${compact ? 'share-actions-compact' : ''}`} aria-label="청첩장 공유">
      <button type="button" className="share-btn" onClick={shareToKakao}>
        <MessageCircle aria-hidden />
        {kakaoFallback ? '링크 복사 완료' : '카카오톡 공유하기'}
      </button>
      <button type="button" className="share-btn" onClick={copyLink}>
        <Link aria-hidden />
        {copied ? '복사 완료' : '링크주소 복사하기'}
      </button>
    </div>
  );
}
