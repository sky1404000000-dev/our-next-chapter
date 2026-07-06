import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import ShareActions from '@/components/ShareActions';

export default function Closing() {
  const { closing } = weddingData;

  return (
    <section className="section closing" id="closing">
      <div className="closing-card">
        <figure className="closing-photo-wrap">
          <Image
            src={closing.image}
            alt={closing.imageAlt}
            width={900}
            height={480}
            className="closing-photo"
          />
          <figcaption className="multiline">{closing.message}</figcaption>
        </figure>
        <ShareActions />
        <p className="closing-copyright">{closing.copyright}</p>
      </div>
    </section>
  );
}
