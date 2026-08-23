import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

export default function AboutUs() {
  const { aboutUs } = weddingData;
  const subtitle = 'subtitle' in aboutUs && typeof aboutUs.subtitle === 'string' ? aboutUs.subtitle : undefined;

  return (
    <section className="section about-section" id="about-us">
      <span className="section-kicker">{aboutUs.kicker}</span>
      <h2>{aboutUs.title}</h2>
      {subtitle && <p className="section-description">{subtitle}</p>}

      <div className="about-profile-card">
        {aboutUs.people.map((person) => (
          <article className="about-person" key={`${person.role}-${person.name}`}>
            <Image
              src={person.image}
              alt={person.imageAlt}
              width={390}
              height={520}
              sizes="(max-width: 520px) 50vw, 240px"
              className="about-photo"
            />
            <div className="about-person-details">
              <h3>
                <span>{person.role}</span> {person.name}
              </h3>
              <p className="about-profile-meta">{person.parents}</p>
              <p className="about-profile-text">
                {person.birth}
                <br />
                <span>{person.note}</span>
                {person.note2 && <span className="about-profile-note2">{person.note2}</span>}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
