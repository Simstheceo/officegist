'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, needSignIn } from '@/lib/client';
import { CATEGORIES, catLabel, ago } from '@/lib/format';
import { REPORT_REASONS } from '@/components/ReviewActions';

function Post({ g: init }) {
  const router = useRouter();
  const [g, setG] = useState(init);
  const [msg, setMsg] = useState('');
  const [reporting, setReporting] = useState(false);
  const guard = (fn) => async () => { try { await fn(); } catch (e) { if (!needSignIn(e, router)) setMsg(e.message); } };

  const like = guard(async () => { const r = await api(`/gist/${g.id}/like`, { method: 'POST', body: {} }); setG({ ...g, likedByMe: r.active, like_count: g.like_count + (r.active ? 1 : -1) }); });
  const save = guard(async () => { await api(`/me/saved/gists/${g.id}`, { method: g.savedByMe ? 'DELETE' : 'PUT', body: g.savedByMe ? undefined : {} }); setG({ ...g, savedByMe: !g.savedByMe }); });
  const report = (reason) => guard(async () => { const r = await api('/reports', { method: 'POST', body: { entityType: 'GIST', entityId: g.id, reason } }); setMsg(r.message); setReporting(false); })();

  return (
    <article className="card">
      <div className="mut"><b>Anonymous Employee{g.anon_number ? ` #${g.anon_number}` : ''}</b> · <span className="tag">{catLabel(g.category)}</span> · {ago(g.published_at)}
        {g.company_slug && <> · <Link href={`/companies/${g.company_slug}`} style={{ textDecoration: 'underline' }}>{g.company_name}</Link></>}</div>
      <p style={{ margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>{g.body}</p>
      <div className="act">
        <button className={g.likedByMe ? 'on' : ''} onClick={like}>♥ {g.like_count}</button>
        <span className="mut" style={{ alignSelf: 'center' }}>💬 {g.comment_count}</span>
        <button className={g.savedByMe ? 'on' : ''} onClick={save}>{g.savedByMe ? 'Saved' : 'Save'}</button>
        <button onClick={() => setReporting(!reporting)}>Report</button>
      </div>
      {reporting && <div className="chips">{REPORT_REASONS.map(([v, l]) => <button key={v} onClick={() => report(v)}>{l}</button>)}</div>}
      {msg && <div className="mut" role="status">{msg}</div>}
    </article>
  );
}

function Composer() {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('CAREER_ADVICE');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');

  const post = async () => {
    setBusy(true); setErr(''); setRes(null);
    try { const r = await api('/gist', { method: 'POST', body: { body, category } }); setRes(r); if (r.status !== 'NEEDS_EDIT') setBody(''); }
    catch (e) { if (!needSignIn(e, router)) setErr(e.issues?.[0]?.message || e.message); }
    setBusy(false);
  };
  return (
    <div className="card">
      <label htmlFor="gb" style={{ marginTop: 0 }}>What&apos;s the gist?</label>
      <textarea id="gb" className="f" style={{ minHeight: 80 }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share what you wish you had known. No names, phone numbers or emails." maxLength={1000} />
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <select className="f" style={{ flex: 1 }} aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <button className="btn" disabled={busy || body.trim().length < 10} onClick={post}>Post</button>
      </div>
      {res && <div className={res.status === 'NEEDS_EDIT' ? 'warn' : 'mut'} role="status" style={{ marginTop: 10 }}>{res.message}{res.issues?.map((i) => <div key={i}>{i}</div>)}</div>}
      {err && <div className="err" role="alert">{err}</div>}
    </div>
  );
}

export default function GistFeed({ initial, nextCursor, category = '', compact = false }) {
  const [items, setItems] = useState(initial);
  const [cursor, setCursor] = useState(nextCursor);
  const [busy, setBusy] = useState(false);
  const more = async () => {
    setBusy(true);
    try { const d = await api(`/gist?cursor=${cursor}${category ? `&category=${category}` : ''}`); setItems((x) => [...x, ...d.items]); setCursor(d.nextCursor); } catch {}
    setBusy(false);
  };
  return (
    <>
      {!compact && <Composer />}
      <div className="grid g2" style={compact ? undefined : { marginTop: 16, gridTemplateColumns: '1fr' }}>{items.map((g) => <Post key={g.id} g={g} />)}</div>
      {cursor && !compact && <p><button className="btn g" disabled={busy} onClick={more}>{busy ? 'Loading…' : 'Load more'}</button></p>}
    </>
  );
}
