import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useSiteContent } from '../context/SiteContent';
import { supabase } from '../lib/supabase';
import './Contact.css';

interface ContactArtist {
  id: string;
  name: string;
}

export default function Contact() {
  const { content } = useSiteContent();
  const [artists, setArtists] = useState<ContactArtist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [artistsMenuOpen, setArtistsMenuOpen] = useState(false);
  const artistsDropdownRef = useRef<HTMLDivElement>(null);

  const contactTitle = content.contact_title || "Let's create something together";
  const highlight = content.contact_highlight || 'something together';
  const titleParts = contactTitle.split(highlight);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from('artists')
      .select('id, name')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) {
          setArtists(data);
        }
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        artistsDropdownRef.current &&
        !artistsDropdownRef.current.contains(event.target as Node)
      ) {
        setArtistsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const phone = String(formData.get('phone') || '');
    const subject = String(formData.get('subject') || '');
    const message = String(formData.get('message') || '');

    const artistsLine = selectedArtists.length > 0 ? selectedArtists.join(', ') : 'No artist selected';

    const payload = {
      access_key: import.meta.env.VITE_WEB3FORMS_KEY,
      subject: subject.trim() || `Website booking request from ${name}`,
      from_name: 'Sodality website',
      replyto: email,
      cc: 'axel.page@hotmail.com',
      name,
      email,
      phone: phone || '-',
      artists: artistsLine,
      message,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not send message');
      }

      formEl.reset();
      setSelectedArtists([]);
      setSubmitMessage('Thanks! Your message has been sent.');
    } catch {
      setSubmitMessage('Message could not be sent right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onSubmit={handleSubmit}
          >
            <div className="contact-form__row">
              <div className="contact-form__field">
                <input type="text" id="name" name="name" placeholder=" " required />
                <label htmlFor="name">Name *</label>
                <div className="contact-form__field-line" />
              </div>
              <div className="contact-form__field">
                <input type="email" id="email" name="email" placeholder=" " required />
                <label htmlFor="email">Email *</label>
                <div className="contact-form__field-line" />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <input type="tel" id="phone" name="phone" placeholder=" " />
                <label htmlFor="phone">Phone number</label>
                <div className="contact-form__field-line" />
              </div>
              <div className="contact-form__field">
                <input type="text" id="subject" name="subject" placeholder=" " />
                <label htmlFor="subject">Subject</label>
                <div className="contact-form__field-line" />
              </div>
            </div>

            <div className="contact-form__field contact-form__dropdown-field" ref={artistsDropdownRef}>
              <label className="contact-form__dropdown-label">
                For which artist(s) are you contacting us?
              </label>
              <button
                type="button"
                className="contact-form__dropdown-trigger"
                onClick={() => setArtistsMenuOpen((open) => !open)}
                aria-expanded={artistsMenuOpen}
                aria-haspopup="listbox"
              >
                <span>
                  {selectedArtists.length > 0
                    ? selectedArtists.join(', ')
                    : 'Select one or multiple artists'}
                </span>
                <ChevronDown size={16} />
              </button>

              {artistsMenuOpen && (
                <div className="contact-form__dropdown-menu" role="listbox" aria-multiselectable="true">
                  {artists.map((artist) => {
                    const isSelected = selectedArtists.includes(artist.name);
                    return (
                      <label key={artist.id} className="contact-form__dropdown-option">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedArtists((current) =>
                              isSelected
                                ? current.filter((name) => name !== artist.name)
                                : [...current, artist.name]
                            );
                          }}
                        />
                        <span>{artist.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="contact-form__field">
              <textarea id="message" name="message" rows={5} placeholder=" " required />
              <label htmlFor="message">Message *</label>
              <div className="contact-form__field-line" />
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={isSubmitting}>
              <span className="btn__text">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <span className="btn__shine" />
            </button>
            {submitMessage && (
              <p className="contact-form__status">{submitMessage}</p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
