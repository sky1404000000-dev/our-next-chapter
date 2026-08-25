import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

export default function Invitation() {
  const { invitation } = weddingData;

  return (
    <section className="section invitation-section" id="invitation">
      <span className="section-kicker">INVITATION</span>
      <h2>{invitation.title}</h2>
      <div className="invitation-card text-center">
        <p className="multiline">{invitation.brideMessage}</p>
        <p className="invitation-signature">-은진-</p>
        <p className="multiline invitation-repeat">{invitation.groomMessage}</p>
        <p className="invitation-signature">-동균-</p>
      </div>
      <Image
        src={invitation.image}
        alt={invitation.imageAlt}
        width={720}
        height={480}
        className="invitation-image"
      />
    </section>
  );
}
