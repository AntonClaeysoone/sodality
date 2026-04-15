import { motion } from 'framer-motion';
import { Mail, Instagram, ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContent';
import './Contact.css';

export default function Contact() {
  const { content } = useSiteContent();

  const contactTitle = content.contact_title || "Let's create something together";
  const highlight = content.contact_highlight || 'something together';
  const titleParts = contactTitle.split(highlight);

  return (
    <section className="contact-section" id="contact">
      {/* Background glow */}
      <div className="contact-section__glow" />

      <div className="container">
        <div className="contact-grid">
          {/* Left — text + links */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="section-header__label">Contact</span>
            <h2 className="contact-info__title">
              {titleParts[0]}<br />
              <span className="contact-info__highlight">{highlight}</span>
              {titleParts[1] || ''}
            </h2>
            <p className="contact-info__body">{content.contact_body}</p>

            <div className="contact-info__links">
              <a href={`mailto:${content.contact_email}`} className="contact-info__link">
                <div className="contact-info__link-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-info__link-text">
                  <span className="contact-info__link-label">Email</span>
                  <span className="contact-info__link-value">{content.contact_email}</span>
                </div>
                <ArrowUpRight size={16} className="contact-info__link-arrow" />
              </a>

              <a href={content.contact_instagram_url} target="_blank" rel="noopener noreferrer" className="contact-info__link">
                <div className="contact-info__link-icon">
                  <Instagram size={20} />
                </div>
                <div className="contact-info__link-text">
                  <span className="contact-info__link-label">Instagram</span>
                  <span className="contact-info__link-value">{content.contact_instagram_handle}</span>
                </div>
                <ArrowUpRight size={16} className="contact-info__link-arrow" />
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.form
            className="contact-form"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="contact-form__row">
              <div className="contact-form__field">
                <input type="text" id="name" placeholder=" " required />
                <label htmlFor="name">Name</label>
                <div className="contact-form__field-line" />
              </div>
              <div className="contact-form__field">
                <input type="email" id="email" placeholder=" " required />
                <label htmlFor="email">Email</label>
                <div className="contact-form__field-line" />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <input type="tel" id="phone" placeholder=" " />
                <label htmlFor="phone">Phone number</label>
                <div className="contact-form__field-line" />
              </div>
              <div className="contact-form__field">
                <input type="text" id="subject" placeholder=" " />
                <label htmlFor="subject">Subject</label>
                <div className="contact-form__field-line" />
              </div>
            </div>

            <div className="contact-form__field">
              <textarea id="message" rows={5} placeholder=" " required />
              <label htmlFor="message">Message</label>
              <div className="contact-form__field-line" />
            </div>

            <button type="submit" className="btn btn--primary btn--full">
              <span className="btn__text">Send Message</span>
              <span className="btn__shine" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
