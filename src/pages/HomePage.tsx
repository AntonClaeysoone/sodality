import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ArtistGrid from '../components/ArtistGrid';
import EventsSection from '../components/EventsSection';
import About from '../components/About';
import Contact from '../components/Contact';
import { useSiteContent } from '../context/SiteContent';

export default function HomePage() {
  const { content } = useSiteContent();

  return (
    <>
      <Hero />
      <Marquee text={content.marquee_1} speed={120} separator=" • " />
      <ArtistGrid />
      <Marquee text={content.marquee_2} speed={140} />
      <EventsSection />
      <About />
      <Marquee text={content.marquee_3} speed={160} />
      <Contact />
    </>
  );
}
