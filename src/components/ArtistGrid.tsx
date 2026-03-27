import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ArtistGrid.css';

interface Artist {
  id: number;
  name: string;
  genre: string;
  initial: string;
  color: string;
}

const placeholderArtists: Artist[] = [
  { id: 1, name: 'DJ Phantom', genre: 'Tech House', initial: 'PH', color: '#f09410' },
  { id: 2, name: 'Luna Waves', genre: 'Melodic Techno', initial: 'LW', color: '#D96A1E' },
  { id: 3, name: 'Bass Theory', genre: 'Drum & Bass', initial: 'BT', color: '#BC403D' },
  { id: 4, name: 'Echo Chamber', genre: 'Deep House', initial: 'EC', color: '#f09410' },
  { id: 5, name: 'Neon Pulse', genre: 'Progressive House', initial: 'NP', color: '#D96A1E' },
  { id: 6, name: 'Volt', genre: 'Techno', initial: 'VT', color: '#BC403D' },
];

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <motion.div
      ref={ref}
      className="artist-card"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="artist-card__visual">
        <motion.div
          className="artist-card__image"
          style={{ y }}
        >
          <div
            className="artist-card__placeholder"
            style={{ background: `linear-gradient(135deg, ${artist.color}22, ${artist.color}08)` }}
          >
            <span
              className="artist-card__initials"
              style={{ color: artist.color }}
            >
              {artist.initial}
            </span>
          </div>
        </motion.div>

        {/* Hover overlay */}
        <div className="artist-card__hover">
          <div className="artist-card__hover-line" />
          <span className="artist-card__genre">{artist.genre}</span>
          <div className="artist-card__hover-cta">View Profile</div>
        </div>

        {/* Corner accent */}
        <div className="artist-card__corner" style={{ background: artist.color }} />
      </div>

      <div className="artist-card__info">
        <h3 className="artist-card__name">{artist.name}</h3>
        <span className="artist-card__genre-tag">{artist.genre}</span>
      </div>
    </motion.div>
  );
}

export default function ArtistGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const titleX = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  return (
    <section className="artists-section" id="artists" ref={sectionRef}>
      {/* Section header */}
      <div className="container">
        <div className="section-header">
          <motion.span
            className="section-header__label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The Roster
          </motion.span>
          <motion.h2
            className="section-header__title"
            style={{ x: titleX }}
          >
            Our Artists
          </motion.h2>
          <motion.div className="section-header__line" style={{ width: lineWidth }} />
        </div>

        {/* Grid */}
        <div className="artists-grid">
          {placeholderArtists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="artists-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a href="/artists" className="btn btn--outline btn--large">
            View All Artists
          </a>
        </motion.div>
      </div>
    </section>
  );
}
