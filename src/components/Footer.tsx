import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import './Footer.css';

const footerLinks = [
  { to: '/artists', label: 'Artists' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Big brand text */}
      <div className="footer__brand-bar">
        <span className="footer__brand-text">Sodality</span>
      </div>

      <div className="container">
        <div className="footer__grid">
          {/* Col 1 — Logo + tagline */}
          <div className="footer__col">
            <img src="/SO_logo_WHITE.png" alt="Sodality" className="footer__logo" />
            <p className="footer__tagline">
              United Artist Agency<br />
              Dancin' is what we do
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigate</h4>
            <nav className="footer__nav">
              {footerLinks.map((link) => (
                <Link key={link.to} to={link.to} className="footer__nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Connect */}
          <div className="footer__col">
            <h4 className="footer__col-title">Connect</h4>
            <div className="footer__social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
              <a href="mailto:info@sodality.be" className="footer__social-link">
                <Mail size={16} />
                <span>info@sodality.be</span>
              </a>
            </div>
          </div>

          {/* Col 4 — Info */}
          <div className="footer__col">
            <h4 className="footer__col-title">Info</h4>
            <p className="footer__info-text">
              Based in Belgium<br />
              Worldwide bookings
            </p>
            <span className="footer__info-text">www.sodality.be</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} Sodality. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
