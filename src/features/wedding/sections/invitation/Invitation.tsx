import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

export default function Invitation() {
  const { invitation } = weddingData;

  return (
    <section className="section" id="invitation">
      <div className="invitation-card card text-center">
        <span className="section-kicker">INVITATION</span>
        <h2>{invitation.title}</h2>
        <p className="multiline">{invitation.message}</p>
        <Image
          src={invitation.image}
          alt={invitation.imageAlt}
          width={720}
          height={820}
          className="invitation-image"
        />
      </div>
    </section>
  );
}
