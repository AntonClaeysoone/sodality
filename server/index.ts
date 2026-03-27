import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

// Placeholder API routes — will connect to DB later
app.get('/api/artists', (_req, res) => {
  res.json([
    { id: 1, name: 'DJ Phantom', genre: 'Tech House', image: '/placeholder-artist.jpg' },
    { id: 2, name: 'Luna Waves', genre: 'Melodic Techno', image: '/placeholder-artist.jpg' },
    { id: 3, name: 'Bass Theory', genre: 'Drum & Bass', image: '/placeholder-artist.jpg' },
    { id: 4, name: 'Echo Chamber', genre: 'Deep House', image: '/placeholder-artist.jpg' },
    { id: 5, name: 'Neon Pulse', genre: 'Progressive House', image: '/placeholder-artist.jpg' },
    { id: 6, name: 'Volt', genre: 'Techno', image: '/placeholder-artist.jpg' },
  ]);
});

app.get('/api/events', (_req, res) => {
  res.json([
    { id: 1, title: 'Sodality Presents: Summer Rave', date: '2026-06-15', venue: 'Sportpaleis, Antwerp' },
    { id: 2, title: 'Underground Sessions', date: '2026-07-22', venue: 'Fuse, Brussels' },
    { id: 3, title: 'Bass Night', date: '2026-08-10', venue: 'Kompass, Ghent' },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
