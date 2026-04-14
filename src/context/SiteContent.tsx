import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContentMap {
  [key: string]: string;
}

interface SiteImageMap {
  [key: string]: string;
}

interface SiteContentContextValue {
  content: SiteContentMap;
  images: SiteImageMap;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: {},
  images: {},
  loading: true,
});

const FALLBACK_CONTENT: SiteContentMap = {
  hero_title: "Dancin' is what we do",
  hero_subtitle: 'United Artist Agency',
  hero_cta_primary: 'Our Artists',
  hero_cta_secondary: 'Book Now',
  about_title: 'Born from the dancefloor',
  about_highlight: 'dancefloor',
  about_paragraph_1:
    "Sodality is a united artist agency born from the heart of Belgium's electronic music scene. We represent the next generation of DJs and producers, connecting talent with stages across Europe and beyond.",
  about_paragraph_2:
    'Our mission is simple: bring people together through music. From intimate club nights to massive festival stages, we curate experiences that move bodies and souls.',
  about_established_year: '2026',
  contact_title: "Let's create something together",
  contact_highlight: 'something together',
  contact_body:
    "Interested in booking one of our artists? Have a collaboration in mind? We'd love to hear from you.",
  contact_email: 'info@sodality.be',
  contact_instagram_handle: '@sodality',
  contact_instagram_url: 'https://instagram.com/sodality',
  contact_website: 'www.sodality.be',
  footer_tagline:
    'Uniting all kinds of House, Allround & Clubbing artists • based in Belgium, representing worldwide',
  footer_location: 'Based in Belgium',
  footer_bookings: 'Worldwide bookings',
  marquee_1: "Dancin' is what we do",
  marquee_2: 'Sodality — United Artist Agency',
  marquee_3: 'Book now • Worldwide • DJ Agency • Events • Belgium',
  meta_title: 'Sodality — United Artist Agency',
  meta_description:
    'Sodality is a united artist agency representing the next generation of DJs and producers.',
};

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContentMap>(FALLBACK_CONTENT);
  const [images, setImages] = useState<SiteImageMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function load() {
      const [contentRes, imagesRes] = await Promise.all([
        supabase!.from('site_content').select('key, value'),
        supabase!.from('site_images').select('key, image_url'),
      ]);

      if (contentRes.data) {
        const map: SiteContentMap = { ...FALLBACK_CONTENT };
        for (const row of contentRes.data) {
          map[row.key] = row.value;
        }
        setContent(map);
      }

      if (imagesRes.data) {
        const map: SiteImageMap = {};
        for (const row of imagesRes.data) {
          map[row.key] = row.image_url;
        }
        setImages(map);
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, images, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
