export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/geo') {
      const cf = request.cf || {};
      return Response.json({ state: cf.regionCode || null, country: cf.country || null });
    }
    if (url.pathname === '/api/lead' && request.method === 'POST') {
      let d;
      try { d = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
      if (d.website) return Response.json({ ok: true }); // honeypot
      if (!d.email || !d.consent) return Response.json({ ok: false }, { status: 400 });
      if (!env.DB) return Response.json({ ok: false, fallback: true });
      await env.DB.prepare(
        'INSERT INTO leads (created_at, journey, product_segment, geo_state, first_name, last_name, email, phone, zip, enrolled, consent, source) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
      ).bind(new Date().toISOString(), d.journey || '', d.segment || '', (request.cf && request.cf.regionCode) || '',
        d.first || '', d.last || '', d.email, d.phone || '', d.zip || '', d.enrolled || '', 1, d.source || 'portal').run();
      return Response.json({ ok: true });
    }
    return env.ASSETS.fetch(request);
  }
};
