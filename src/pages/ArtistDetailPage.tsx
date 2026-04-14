import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, Instagram, Music, Headphones, Video, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ArtistDetailPage.css';

interface ArtistDetail {
  id: string;
  name: string;
  genre: string;
  initials: string;
  accent_color: string;
  image_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  spotify_url: string | null;
  soundcloud_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
}

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const imageY = useTransform(smoothProgress, [0, 1], ['0%', '25%']);
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(smoothProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }
    supabase
      .from('artists')
      .select('id, name, genre, initials, accent_color, image_url, bio, instagram_url, spotify_url, soundcloud_url, tiktok_url, youtube_url')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setArtist(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="artist-detail__loading">
        <motion.div
          className="artist-detail__loader"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-detail__not-found">
        <h2>Artist not found</h2>
        <Link to="/artists" className="btn btn--outline">Back to Artists</Link>
      </div>
    );
  }

  const socials = [
    { url: artist.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: artist.spotify_url, icon: Music, label: 'Spotify' },
    { url: artist.soundcloud_url, icon: Headphones, label: 'SoundCloud' },
    { url: artist.youtube_url, icon: Video, label: 'YouTube' },
    { url: artist.tiktok_url, icon: Globe, label: 'TikTok' },
  ].filter((s) => s.url);

  const initials = artist.initials || artist.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const color = artist.accent_color || '#f09410';

  return (
    <div className="artist-detail">
      {/* Hero */}
      <section className="artist-detail__hero" ref={heroRef}>
        {/* Background image with parallax */}
        <motion.div className="artist-detail__hero-bg" style={{ y: imageY, scale: imageScale }}>
          {artist.image_url ? (
            <img src={artist.image_url} alt={artist.name} />
          ) : (
            <div
              className="artist-detail__hero-placeholder"
              style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
            >
              <span className="artist-detail__hero-initials" style={{ color }}>{initials}</span>
            </div>
          )}
        </motion.div>

        {/* Gradient overlay */}
        <div className="artist-detail__hero-overlay" />

        {/* Back button */}
        <motion.div
          className="artist-detail__back"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/artists" className="artist-detail__back-link">
            <ArrowLeft size={20} />
            <span>All Artists</span>
          </Link>
        </motion.div>

        {/* Content overlay at bottom */}
        <motion.div
          className="artist-detail__hero-content"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="container">
            <motion.span
              className="artist-detail__genre-tag"
              style={{ color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {artist.genre}
            </motion.span>

            <motion.h1
              className="artist-detail__name"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {artist.name}
            </motion.h1>

            <motion.div
              className="artist-detail__hero-meta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="artist-detail__divider" style={{ background: color }} />

              {socials.length > 0 && (
                <div className="artist-detail__hero-socials">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="artist-detail__social-icon"
                      title={s.label}
                    >
                      <s.icon size={18} />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Body */}
      <section className="artist-detail__body">
        <div className="container">
          <div className="artist-detail__content">
            {/* Bio */}
            {artist.bio && (
              <motion.div
                className="artist-detail__bio"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="section-header__label">About</span>
                {artist.bio.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="artist-detail__bio-text">{paragraph}</p>
                ))}
              </motion.div>
            )}

            {/* Book CTA */}
            <motion.div
              className="artist-detail__book"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Link to="/contact" className="btn btn--primary btn--large">
                <span className="btn__text">Book {artist.name}</span>
                <span className="btn__shine" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
