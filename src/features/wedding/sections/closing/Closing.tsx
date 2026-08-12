import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import ShareActions from '../../components/ShareActions';

export default function Closing() {
  const { closing, hero, weddingInfo } = weddingData;
  const closingPhotos = [
    { src: '/images/closing/final/1.jpg', alt: '은진과 동균의 마지막 인사 사진 1' },
    { src: '/images/closing/final/2.jpg', alt: '은진과 동균의 마지막 인사 사진 2' },
    { src: '/images/closing/final/3.jpg', alt: '은진과 동균의 마지막 인사 사진 3' }
  ];
  const closingTime = hero.timeLabel.endsWith('PM') ? `PM ${hero.timeLabel.replace(' PM', '')}` : hero.timeLabel;

  return (
    <section className="section closing" id="closing">
      <span className="section-kicker">THANK YOU</span>
      <div className="closing-card">
        <div className="closing-photo-stack" aria-label="은진과 동균의 사진">
          {closingPhotos.map((photo) => (
            <figure className="closing-mini-photo" key={photo.src}>
              <Image src={photo.src} alt={photo.alt} width={520} height={360} />
              <figcaption>
                love story is
                <br />
                beautiful, you are
                <br />
                my favorite
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="closing-date-panel">
          <p className="closing-save-date">
            Save
            <br />
            the Date
          </p>
          <dl className="closing-date-table">
            <div className="closing-date-heading">
              <dt>DATE</dt>
              <dt>TIME</dt>
            </div>
            <div className="closing-date-values">
              <dd>{closing.dateLabel}</dd>
              <dd>{closingTime}</dd>
            </div>
            <div className="closing-date-address">
              <dd>{weddingInfo.address}</dd>
            </div>
          </dl>
        </div>

        <figure className="closing-hero-photo-wrap">
          <Image
            src={closing.image}
            alt={closing.imageAlt}
            width={900}
            height={1320}
            className="closing-hero-photo"
          />
          <figcaption>
            <p className="multiline">{closing.message}</p>
          </figcaption>
        </figure>
        <div className="closing-kakao-share">
          <ShareActions kakaoOnly />
        </div>
        <p className="closing-copyright">{closing.copyright}</p>
      </div>
    </section>
  );
}
