import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

app.use(express.json());

const CONTACT_RECIPIENTS = ['bookings@sodality.be', 'axel.page@hotmail.com'];

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, selectedArtists } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return res.status(500).json({ error: 'SMTP is not configured on server' });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const artistsLine =
    Array.isArray(selectedArtists) && selectedArtists.length > 0
      ? selectedArtists.join(', ')
      : 'No artist selected';

  const mailSubject = subject?.trim() || `Website booking request from ${name}`;

  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '-'}`,
    `Artists: ${artistsLine}`,
    '',
    'Message:',
    message,
  ].join('\n');

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: CONTACT_RECIPIENTS.join(','),
      replyTo: email,
      subject: mailSubject,
      text: textBody,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email failed:', error);
    return res.status(500).json({ error: 'failed to send' });
  }
});

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
