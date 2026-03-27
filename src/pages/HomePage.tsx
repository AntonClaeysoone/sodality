import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ArtistGrid from '../components/ArtistGrid';
import EventsSection from '../components/EventsSection';
import About from '../components/About';
import Contact from '../components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee text="Dancin' is what we do" speed={120} separator=" \u2022 " />
      <ArtistGrid />
      <Marquee text="Sodality \u2014 United Artist Agency" speed={140} />
      <EventsSection />
      <About />
      <Marquee text="Book now \u2022 Worldwide \u2022 DJ Agency \u2022 Events \u2022 Belgium" speed={160} />
      <Contact />
    </>
  );
}
