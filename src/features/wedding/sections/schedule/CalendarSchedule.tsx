'use client';

import { useEffect, useState } from 'react';
import { weddingData } from '@/data/weddingData';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

function getRemainingTime(targetDate: string): RemainingTime {
  const diffFromTarget = new Date(targetDate).getTime() - Date.now();
  const isPast = diffFromTarget < 0;
  const diff = Math.abs(diffFromTarget);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast
  };
}

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export default function CalendarSchedule() {
  const { calendar } = weddingData;
  const [remaining, setRemaining] = useState<RemainingTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const updateRemaining = () => setRemaining(getRemainingTime(calendar.date));

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);

    return () => window.clearInterval(timer);
  }, [calendar.date]);

  return (
    <section className="section schedule-section" id="schedule">
      <span className="section-kicker">CALENDAR</span>
      <h2>예식일</h2>
      <div className="schedule-card card">
        <p className="schedule-date">{calendar.displayDate}</p>
        <p className="schedule-time">{calendar.displayTime}</p>

        <div className="calendar-grid" aria-label={`${calendar.displayDate} 결혼식 달력`}>
          {weekDays.map((day, index) => (
            <span key={day} className={index === 0 ? 'calendar-sunday' : undefined}>
              {day}
            </span>
          ))}
          {calendar.days.map((day, index) => {
            const isWeddingDay = day.currentMonth && day.date === 10;

            return (
              <span
                key={`${day.currentMonth ? 'current' : 'prev'}-${day.date}-${index}`}
                className={[
                  !day.currentMonth ? 'calendar-muted' : '',
                  index % 7 === 0 ? 'calendar-sunday' : '',
                  isWeddingDay ? 'calendar-wedding-day' : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {day.date}
              </span>
            );
          })}
        </div>

        <div className="countdown" aria-label={remaining.isPast ? '예식 이후 지난 시간' : '예식까지 남은 시간'}>
          <span>
            <strong>{remaining.days}</strong>
            <small>DAYS</small>
          </span>
          <i>:</i>
          <span>
            <strong>{pad(remaining.hours)}</strong>
            <small>HOUR</small>
          </span>
          <i>:</i>
          <span>
            <strong>{pad(remaining.minutes)}</strong>
            <small>MIN</small>
          </span>
          <i>:</i>
          <span>
            <strong>{pad(remaining.seconds)}</strong>
            <small>SEC</small>
          </span>
        </div>

        <p className="schedule-note">
          {remaining.isPast ? (
            remaining.days > 0 ? (
              <>
                {calendar.coupleLabel}의 결혼식이 <strong>{remaining.days}일</strong> 지났습니다.
              </>
            ) : (
              <>{calendar.coupleLabel}의 결혼식이 오늘입니다.</>
            )
          ) : (
            <>
              {calendar.coupleLabel}의 결혼식이 <strong>{remaining.days}일</strong> 남았습니다.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
