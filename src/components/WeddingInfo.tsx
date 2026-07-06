import Image from 'next/image';
import { CalendarDays, Clock3, MapPin, Utensils } from 'lucide-react';
import { weddingData } from '@/data/weddingData';

export default function WeddingInfo() {
  const { weddingInfo } = weddingData;

  const items = [
    { label: '날짜', value: weddingInfo.date, icon: CalendarDays },
    { label: '시간', value: weddingInfo.time, icon: Clock3 },
    { label: '장소', value: `${weddingInfo.venue} (${weddingInfo.venueSub})`, icon: MapPin },
    { label: '식사 안내', value: '예식 후 식사가 준비되어 있습니다', icon: Utensils }
  ];

  return (
    <section className="section" id="wedding-info">
      <span className="section-kicker">wedding info</span>
      <h2>예식 안내</h2>
      <div className="info-layout">
        <div className="info-list card">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div className="info-item" key={item.label}>
                <Icon aria-hidden />
                <span>
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="venue-photo card">
          <Image
            src="/images/venue.svg"
            alt={`${weddingInfo.venue} 예식장 이미지`}
            width={260}
            height={340}
          />
        </div>
      </div>
      <p className="arrival-note">여유 있게 도착하셔서 함께 축복해 주세요.</p>
    </section>
  );
}
