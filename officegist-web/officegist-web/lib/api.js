const API = process.env.API_URL || 'http://localhost:4000';

// Server-side fetch for public data. Returns null on any failure so pages can render an empty state instead of crashing.
export async function get(path, revalidate = 60) {
  try {
    const r = await fetch(`${API}/api${path}`, { next: { revalidate } });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    return null;
  }
}
