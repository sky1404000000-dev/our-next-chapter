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
            imageWidth: number;
            imageHeight: number;
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
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = '';
  pageUrl.search = '';
  return pageUrl.toString();
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
  kakaoOnly?: boolean;
};

export default function ShareActions({ compact = false, kakaoOnly = false }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [kakaoFallback, setKakaoFallback] = useState(false);
  const [needsKakaoKey, setNeedsKakaoKey] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(getPageUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const shareToKakao = async () => {
    if (!hasKakaoKey) {
      if (kakaoOnly) {
        setNeedsKakaoKey(true);
        window.setTimeout(() => setNeedsKakaoKey(false), 2200);
      } else {
        await copyLink();
        setKakaoFallback(true);
        window.setTimeout(() => setKakaoFallback(false), 1800);
      }
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
        imageWidth: 1080,
        imageHeight: 1080,
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
    <div className={`share-actions ${compact ? 'share-actions-compact' : ''} ${kakaoOnly ? 'share-actions-kakao-only' : ''}`} aria-label="청첩장 공유">
      {!kakaoOnly && (
        <button type="button" className="share-btn" onClick={copyLink}>
          <Link aria-hidden />
          <span className="share-btn-label">
            <span>{copied ? '복사 완료' : '청첩장'}</span>
            {!copied && <span>링크복사</span>}
          </span>
        </button>
      )}
      <button type="button" className="share-btn" onClick={shareToKakao}>
        <MessageCircle aria-hidden />
        <span className="share-btn-label">
          <span>{needsKakaoKey ? '카카오 키를 설정해 주세요' : kakaoFallback ? '링크 복사 완료' : kakaoOnly ? '카카오톡으로 초대장 보내기' : '카카오톡'}</span>
          {!kakaoFallback && !kakaoOnly && <span>공유하기</span>}
        </span>
      </button>
    </div>
  );
}
