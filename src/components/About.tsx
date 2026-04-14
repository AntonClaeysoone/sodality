import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSiteContent } from '../context/SiteContent';
import './About.css';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const fallbackStats: Stat[] = [
  { value: 20, suffix: '+', label: 'Artists' },
  { value: 150, suffix: '+', label: 'Events / Year' },
  { value: 12, suffix: '', label: 'Countries' },
  { value: 3, suffix: 'M+', label: 'Fans Reached' },
];

export default function About() {
  const [stats, setStats] = useState<Stat[]>(fallbackStats);
  const { content, images } = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('statistics')
      .select('value, suffix, label, sort_order')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setStats(data.map((s) => ({ value: s.value, suffix: s.suffix || '', label: s.label })));
        }
      });
  }, []);

  const aboutTitle = content.about_title || 'Born from the dancefloor';
  const highlight = content.about_highlight || 'dancefloor';
  const titleParts = aboutTitle.split(highlight);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left — image with parallax */}
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="about-visual__frame" ref={imageRef}>
              <motion.img
                src={images.about_image || '/SO_COLOR_GRAIN.png'}
                alt="Sodality vibe"
                style={{ y: imageY, scale: imageScale }}
              />
            </div>
            {/* Floating badge */}
            <motion.div
              className="about-visual__badge"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="about-visual__badge-year">EST.</span>
              <span className="about-visual__badge-number">{content.about_established_year}</span>
            </motion.div>
          </motion.div>

          {/* Right — text content */}
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="section-header__label">About Us</span>
            <h2 className="about-text__title">
              {titleParts[0]}<br />
              <span className="about-text__highlight">{highlight}</span>
              {titleParts[1] || ''}
            </h2>

            <p className="about-text__body">{content.about_paragraph_1}</p>
            <p className="about-text__body">{content.about_paragraph_2}</p>

            <a href="/about" className="about-text__link">
              <span>Learn more about us</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          className="about-stats"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="about-stat">
              <span className="about-stat__number">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="about-stat__label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
