import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { useSiteContent } from '../context/SiteContent';
import './Footer.css';

const footerLinks = [
  { to: '/artists', label: 'Artists' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const { content, images } = useSiteContent();

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
            <img src={images.logo_white || '/SO_logo_WHITE.png'} alt="Sodality" className="footer__logo" />
            <p className="footer__tagline">{content.footer_tagline}</p>
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
              <a href={content.contact_instagram_url} target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
              <a href={`mailto:${content.contact_email}`} className="footer__social-link">
                <Mail size={16} />
                <span>{content.contact_email}</span>
              </a>
            </div>
          </div>

          {/* Col 4 — Info */}
          <div className="footer__col">
            <h4 className="footer__col-title">Info</h4>
            <p className="footer__info-text">
              {content.footer_location}<br />
              {content.footer_bookings}
            </p>
            <span className="footer__info-text">{content.contact_website}</span>
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
