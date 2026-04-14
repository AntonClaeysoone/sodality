import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

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

      {/* Hero — split layout */}
      <section className="artist-detail__hero">
        {/* Left — portrait image */}
        <motion.div
          className="artist-detail__hero-image"
          ref={imageRef}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="artist-detail__hero-image-frame">
            {artist.image_url ? (
              <motion.img
                src={artist.image_url}
                alt={artist.name}
                style={{ y: imageY, scale: imageScale }}
              />
            ) : (
              <div
                className="artist-detail__hero-placeholder"
                style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
              >
                <span className="artist-detail__hero-initials" style={{ color }}>{initials}</span>
              </div>
            )}
          </div>
          {/* Accent corner */}
          <div className="artist-detail__accent-corner" style={{ background: color }} />
        </motion.div>

        {/* Right — info */}
        <div className="artist-detail__hero-info">
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {artist.name}
          </motion.h1>

          <motion.div
            className="artist-detail__divider"
            style={{ background: color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          {/* Socials inline */}
          {socials.length > 0 && (
            <motion.div
              className="artist-detail__hero-socials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist-detail__social-icon"
                  title={s.label}
                >
                  <s.icon size={20} />
                </a>
              ))}
            </motion.div>
          )}

          {/* Book CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/contact" className="btn btn--primary">
              <span className="btn__text">Book {artist.name}</span>
              <span className="btn__shine" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bio section */}
      {artist.bio && (
        <section className="artist-detail__body">
          <div className="container">
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
          </div>
        </section>
      )}
    </div>
  );
}
