'use client';
// Browser-side API helper. Always sends JSON (the API rejects non-JSON writes as a CSRF defence).
export async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch('/api' + path, {
    method, credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(data.error || 'Something went wrong. Please try again.'), { status: r.status, issues: data.issues || [] });
  return data;
}

// Send signed-out users to sign in, then back to where they were.
export function needSignIn(err, router) {
  if (err?.status !== 401) return false;
  router.push(`/sign-in?next=${encodeURIComponent(location.pathname + location.search)}`);
  return true;
}
