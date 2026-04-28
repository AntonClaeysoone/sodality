import { useEffect, useState, useRef, type ComponentType } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa';
import { SiApplemusic, SiBeatport } from 'react-icons/si';
import { supabase } from '../lib/supabase';
import './MusicPage.css';

interface Release {
  id: string;
  title: string;
  artist_name: string;
  type: string;
  release_date: string | null;
  artwork_url: string | null;
  description: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
  soundcloud_url: string | null;
  youtube_url: string | null;
  beatport_url: string | null;
}

interface Producer {
  id: string;
  name: string;
  role: string | null;
  image_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  spotify_url: string | null;
  soundcloud_url: string | null;
}

const streamingPlatforms: Record<
  string,
  { label: string; Icon: ComponentType<{ size?: number }> }
> = {
  spotify: { label: 'Spotify', Icon: FaSpotify },
  apple_music: { label: 'Apple Music', Icon: SiApplemusic },
  soundcloud: { label: 'SoundCloud', Icon: FaSoundcloud },
  youtube: { label: 'YouTube', Icon: FaYoutube },
  beatport: { label: 'Beatport', Icon: SiBeatport },
};

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  const links = [
    { key: 'spotify', url: release.spotify_url },
    { key: 'apple_music', url: release.apple_music_url },
    { key: 'soundcloud', url: release.soundcloud_url },
    { key: 'youtube', url: release.youtube_url },
    { key: 'beatport', url: release.beatport_url },
  ].filter((l) => l.url);

  return (
    <motion.div
      className="release-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="release-card__artwork">
        <div className="release-card__artwork-inner">
          {release.artwork_url ? (
            <img src={release.artwork_url} alt={release.title} />
          ) : (
            <div className="release-card__artwork-placeholder">
              <span>{release.title.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="release-card__type-badge">{release.type}</div>
      </div>

      <div className="release-card__info">
        <h3 className="release-card__title">{release.title}</h3>
        <span className="release-card__artist">{release.artist_name}</span>
        {release.release_date && (
          <span className="release-card__date">
            {new Date(release.release_date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
            })}
          </span>
        )}
      </div>

      {links.length > 0 && (
        <div className="release-card__links">
          {links.map((l) => (
            (() => {
              const platform = streamingPlatforms[l.key];
              if (!platform) return null;
              const PlatformIcon = platform.Icon;

              return (
                <a
                  key={l.key}
                  href={l.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-card__link"
                  title={platform.label}
                  aria-label={platform.label}
                >
                  <PlatformIcon size={16} />
                </a>
              );
            })()
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProducerCard({ producer, index }: { producer: Producer; index: number }) {
  const socials = [
    { url: producer.instagram_url, label: 'Instagram' },
    { url: producer.spotify_url, label: 'Spotify' },
    { url: producer.soundcloud_url, label: 'SoundCloud' },
  ].filter((s) => s.url);

  return (
    <motion.div
      className="producer-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="producer-card__image">
        {producer.image_url ? (
          <img src={producer.image_url} alt={producer.name} />
        ) : (
          <div className="producer-card__image-placeholder">
            <span>{producer.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="producer-card__info">
        <h3 className="producer-card__name">{producer.name}</h3>
        {producer.role && (
          <span className="producer-card__role">{producer.role}</span>
        )}
        {producer.bio && (
          <p className="producer-card__bio">{producer.bio}</p>
        )}
        {socials.length > 0 && (
          <div className="producer-card__socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="producer-card__social"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MusicPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const titleX = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!supabase) return;

    Promise.all([
      supabase
        .from('releases')
        .select('*')
        .eq('visible', true)
        .order('release_date', { ascending: false }),
      supabase
        .from('producers')
        .select('*')
        .eq('visible', true)
        .order('sort_order'),
    ]).then(([releasesRes, producersRes]) => {
      if (releasesRes.data) setReleases(releasesRes.data);
      if (producersRes.data) setProducers(producersRes.data);
    });
  }, []);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Releases */}
      <section className="music-section" ref={sectionRef}>
        <div className="container">
          <div className="section-header">
            <motion.span
              className="section-header__label"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Music & Production
            </motion.span>
            <motion.h2
              className="section-header__title"
              style={{ x: titleX }}
            >
              Releases
            </motion.h2>
            <motion.div className="section-header__line" style={{ width: lineWidth }} />
          </div>

          <motion.p
            className="music-section__intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          Explore our latest releases and meet the producers behind the sound. Whether you're looking for (ghost)production, collabs, songwriting or any other music-related advice: feel free to hit the contact button or slide in our dm's, we'd love to work together!
          </motion.p>

          {releases.length > 0 ? (
            <div className="releases-grid">
              {releases.map((release, i) => (
                <ReleaseCard key={release.id} release={release} index={i} />
              ))}
            </div>
          ) : (
            <motion.p
              className="music-section__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              New releases coming soon.
            </motion.p>
          )}
        </div>
      </section>

      {/* Producers */}
      {producers.length > 0 && (
        <section className="producers-section">
          <div className="container">
            <div className="section-header">
              <motion.span
                className="section-header__label"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Behind the music
              </motion.span>
              <motion.h2
                className="section-header__title"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Producers
              </motion.h2>
              <motion.div
                className="section-header__line"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
            </div>

            <div className="producers-grid">
              {producers.map((producer, i) => (
                <ProducerCard key={producer.id} producer={producer} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
