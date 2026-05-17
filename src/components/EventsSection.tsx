import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './EventsSection.css';

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
}

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit' });
}

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
}

function formatYear(dateStr: string) {
  return new Date(dateStr).getFullYear().toString();
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const titleX = useTransform(scrollYProgress, [0, 1], [-200, 0]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('events')
      .select('id, title, date, venue, city')
      .eq('visible', true)
      .order('date')
      .then(({ data }) => {
        if (data) {
          setEvents(data);
        }
      });
  }, []);

  return (
    <section className="events-section" id="events" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <motion.span
            className="section-header__label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What's Coming
          </motion.span>
          <motion.h2
            className="section-header__title"
            style={{ x: titleX }}
          >
            Upcoming Events
          </motion.h2>
          <motion.div
            className="section-header__line"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        <div className="events-list">
          {events.map((event, i) => (
            <motion.a
              key={event.id}
              href="/contact"
              className="event-row"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Date block */}
              <div className="event-row__date">
                <span className="event-row__day">{formatDay(event.date)}</span>
                <div className="event-row__date-sub">
                  <span>{formatMonth(event.date)}</span>
                  <span>{formatYear(event.date)}</span>
                </div>
              </div>

              {/* Vertical separator */}
              <div className="event-row__sep" />

              {/* Info */}
              <div className="event-row__info">
                <h3 className="event-row__title">{event.title}</h3>
                <span className="event-row__venue">{event.venue}, {event.city}</span>
              </div>

              {/* Arrow */}
              <div className="event-row__arrow">
                <ArrowUpRight size={22} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
