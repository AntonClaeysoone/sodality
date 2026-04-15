import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Instagram, Music, Headphones, Video, Globe, FileText, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ArtistDetailPage.css';

interface ArtistDetail {
  id: string;
  name: string;
  genre: string;
  initials: string;
  accent_color: string;
  image_url: string | null;
  banner_url: string | null;
  bio: string | null;
  presskit_url: string | null;
  instagram_url: string | null;
  spotify_url: string | null;
  soundcloud_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
}

interface ArtistMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string | null;
  sort_order: number;
}

function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  // Vimeo
  match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  return null;
}

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [media, setMedia] = useState<ArtistMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
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

    Promise.all([
      supabase
        .from('artists')
        .select('id, name, genre, initials, accent_color, image_url, banner_url, bio, presskit_url, instagram_url, spotify_url, soundcloud_url, tiktok_url, youtube_url')
        .eq('id', id)
        .single(),
      supabase
        .from('artist_media')
        .select('id, type, url, caption, sort_order')
        .eq('artist_id', id)
        .order('sort_order'),
    ]).then(([artistRes, mediaRes]) => {
      if (artistRes.data) setArtist(artistRes.data);
      if (mediaRes.data) setMedia(mediaRes.data);
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

  // Use banner for hero, fallback to image_url, fallback to placeholder
  const heroImage = artist.banner_url || artist.image_url;

  const photos = media.filter((m) => m.type === 'photo');
  const videos = media.filter((m) => m.type === 'video');

  return (
    <div className="artist-detail">
      {/* Hero — uses banner_url (landscape show foto) */}
      <section className="artist-detail__hero" ref={heroRef}>
        <motion.div className="artist-detail__hero-bg" style={{ y: imageY, scale: imageScale }}>
          {heroImage ? (
            <img src={heroImage} alt={artist.name} />
          ) : (
            <div
              className="artist-detail__hero-placeholder"
              style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
            >
              <span className="artist-detail__hero-initials" style={{ color }}>{initials}</span>
            </div>
          )}
        </motion.div>

        <div className="artist-detail__hero-overlay" />

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
          {/* Bio + press photo side by side */}
          <div className="artist-detail__intro">
            {/* Bio */}
            <motion.div
              className="artist-detail__bio"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-header__label">About</span>
              {artist.bio ? (
                artist.bio.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="artist-detail__bio-text">{paragraph}</p>
                ))
              ) : (
                <p className="artist-detail__bio-text artist-detail__bio-text--empty">
                  More info coming soon.
                </p>
              )}

              {/* Press kit + Book CTA */}
              <div className="artist-detail__actions">
                {artist.presskit_url && (
                  <a
                    href={artist.presskit_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline"
                  >
                    <FileText size={16} />
                    Press Kit
                  </a>
                )}
                <Link to="/contact" className="btn btn--primary">
                  <span className="btn__text">Book {artist.name}</span>
                  <span className="btn__shine" />
                </Link>
              </div>
            </motion.div>

            {/* Portrait press photo card */}
            {artist.image_url && (
              <motion.div
                className="artist-detail__press-photo"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <img src={artist.image_url} alt={`${artist.name} press photo`} />
                <div className="artist-detail__press-photo-corner" style={{ background: color }} />
              </motion.div>
            )}
          </div>

          {/* Photo gallery */}
          {photos.length > 0 && (
            <motion.div
              className="artist-detail__gallery"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-header__label">Gallery</span>
              <div className="artist-detail__gallery-grid">
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    className="artist-detail__gallery-item"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    onClick={() => setLightboxImg(photo.url)}
                  >
                    <img src={photo.url} alt={photo.caption || `${artist.name} photo`} />
                    <div className="artist-detail__gallery-item-overlay" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video section */}
          {videos.length > 0 && (
            <motion.div
              className="artist-detail__videos"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-header__label">Videos</span>
              <div className="artist-detail__videos-grid">
                {videos.map((video) => {
                  const embedUrl = getVideoEmbedUrl(video.url);
                  if (!embedUrl) return null;
                  return (
                    <div key={video.id} className="artist-detail__video-item">
                      <iframe
                        src={embedUrl}
                        title={video.caption || `${artist.name} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      {video.caption && (
                        <span className="artist-detail__video-caption">{video.caption}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            className="artist-detail__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
          >
            <button className="artist-detail__lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={24} />
            </button>
            <motion.img
              src={lightboxImg}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
