import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

export default function AboutUs() {
  const { aboutUs } = weddingData;

  return (
    <section className="section about-section" id="about-us">
      <span className="section-kicker">{aboutUs.kicker}</span>
      <h2>{aboutUs.title}</h2>
      <p className="section-description">{aboutUs.subtitle}</p>

      <div className="about-profile-card">
        {aboutUs.people.map((person) => (
          <article className="about-person" key={`${person.role}-${person.name}`}>
            <Image
              src={person.image}
              alt={person.imageAlt}
              width={520}
              height={520}
              className="about-photo"
            />
            <h3>
              <span>{person.role}</span> {person.name}
            </h3>
            <p className="about-profile-meta">{person.parents}</p>
            <p className="about-profile-text">
              {person.birth}
              <br />
              {person.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
