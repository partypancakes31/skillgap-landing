// POST /api/contact: sends the homepage inquiry form through EmailJS.
// Cloudflare Pages Function, ported from the old Vercel handler in api/contact.js.
// Needs EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY in the Pages project's
// environment variables (Settings > Variables and Secrets).

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const corsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function readBody(request) {
  const type = request.headers.get('Content-Type') || '';
  try {
    if (type.includes('application/json')) return await request.json();
    if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
      return Object.fromEntries(await request.formData());
    }
  } catch {
    return null;
  }
  return null;
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function onRequestPost({ request, env }) {
  const body = await readBody(request);
  if (!body) return json({ error: 'Missing required fields' }, 400);

  const { from_name, from_email, from_institution, message, _trap } = body;

  // Honeypot field: bots fill this, humans don't
  if (_trap) return json({ ok: true });

  if (!from_name || !from_email || !message) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from_email)) {
    return json({ error: 'Invalid email address' }, 400);
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: env.EMAILJS_SERVICE_ID,
        template_id: env.EMAILJS_TEMPLATE_ID,
        user_id: env.EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name,
          from_email,
          from_institution: from_institution || 'Not provided',
          message,
        },
      }),
    });

    if (!response.ok) {
      console.error('EmailJS error:', response.status, await response.text());
      throw new Error('Email delivery failed');
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ error: 'Failed to send. Please email us directly.' }, 500);
  }
}

// Anything else (GET, PUT, ...) gets the same 405 the Vercel handler returned.
export async function onRequest() {
  return json({ error: 'Method not allowed' }, 405);
}
