import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/artists', label: 'Artists' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo">
            <img src="/SO_logo_WHITE.png" alt="Sodality" />
          </Link>

          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className={`navbar__burger ${isOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar__overlay"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="navbar__overlay-content">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                >
                  <Link
                    to={link.to}
                    className={`navbar__overlay-link ${location.pathname === link.to ? 'navbar__overlay-link--active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="navbar__overlay-index">0{i + 1}</span>
                    <span className="navbar__overlay-label">{link.label}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="navbar__overlay-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <a href="mailto:info@sodality.be">info@sodality.be</a>
                <span>www.sodality.be</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
