module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { from_name, from_email, from_institution, message, _trap } = req.body || {};

  // Honeypot field: bots fill this, humans don't
  if (_trap) return res.status(200).json({ ok: true });

  // Validate required fields
  if (!from_name || !from_email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from_email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id:     process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name,
          from_email,
          from_institution: from_institution || 'Not provided',
          message,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('EmailJS error:', response.status, text);
      throw new Error('Email delivery failed');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send. Please email us directly.' });
  }
};
