import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './Hero.css';

export default function Hero() {
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

  // Parallax layers — each moves at different speeds
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const grainY = useTransform(smoothProgress, [0, 1], ['0%', '15%']);
  const contentY = useTransform(smoothProgress, [0, 1], ['0%', '50%']);
  const contentOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const overlayOpacity = useTransform(smoothProgress, [0, 0.6], [0.3, 0.9]);
  const logoScale = useTransform(smoothProgress, [0, 0.5], [1, 0.6]);
  const titleSpread = useTransform(smoothProgress, [0, 0.3], ['0em', '0.15em']);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // Staggered word animation
  const titleWords = "Dancin' is what we do".split(' ');

  return (
    <section className="hero" ref={heroRef}>
      {/* Parallax background layer */}
      <motion.div className="hero__bg-layer" style={{ y: bgY, scale: bgScale }}>
        <img src="/SO_COLOR_GRAIN.png" alt="" className="hero__bg-image" />
      </motion.div>

      {/* Grain texture overlay — separate parallax speed */}
      <motion.div className="hero__grain" style={{ y: grainY }} />

      {/* Dynamic darkening overlay on scroll */}
      <motion.div className="hero__overlay" style={{ opacity: overlayOpacity }} />

      {/* Radial glow behind content */}
      <div className="hero__glow" />

      {/* Main content — floats up and fades on scroll */}
      <motion.div
        className="hero__content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Logo with scale-down on scroll */}
        <motion.img
          src="/SO_logo_WHITE.png"
          alt="Sodality"
          className="hero__logo"
          style={{ scale: logoScale }}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Title — word by word reveal */}
        <h1 className="hero__title">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="hero__title-word"
              style={{ letterSpacing: titleSpread }}
              initial={{ opacity: 0, y: 60, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4 + i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Divider line that draws in */}
        <motion.div
          className="hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Subtitle */}
        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.2, delay: 1.1, ease: 'easeOut' }}
        >
          United Artist Agency
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
        >
          <a href="/artists" className="btn btn--primary">
            <span className="btn__text">Our Artists</span>
            <span className="btn__shine" />
          </a>
          <a href="/contact" className="btn btn--outline">
            Book Now
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        style={{ opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll</span>
        <motion.div
          className="hero__scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="hero__bottom-fade" />
    </section>
  );
}
