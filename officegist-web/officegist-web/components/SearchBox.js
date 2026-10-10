'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/client';
import { Avatar } from '@/components/ui';

export default function SearchBox({ placeholder = 'Search a company, industry or role', onPick }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const box = useRef(null);

  // Debounced autocomplete: waits 200ms after typing stops.
  useEffect(() => {
    if (q.trim().length < 2) { setRes(null); return; }
    const t = setTimeout(() => api('/search?q=' + encodeURIComponent(q.trim())).then(setRes).catch(() => setRes(null)), 200);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    const close = (e) => { if (!box.current?.contains(e.target)) setRes(null); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = () => {
    const first = res?.companies?.[0];
    if (first) router.push(`/companies/${first.slug}`); else if (q.trim()) router.push(`/companies?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="sb" ref={box} role="search">
      <input aria-label="Search" placeholder={placeholder} value={q} autoComplete="off"
        onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
      <button className="btn" onClick={go}>Search</button>
      {res && (
        <div className="ac">
          {res.companies.map((c) => (
            onPick
              ? <a key={c.slug} href="#" onClick={(e) => { e.preventDefault(); onPick(c); setRes(null); setQ(''); }}><Avatar name={c.name} size={32} /><span><b>{c.name}</b><br /><span className="mut">{c.industry}{c.city ? `, ${c.city}` : ''}</span></span></a>
              : <Link key={c.slug} href={`/companies/${c.slug}`}><Avatar name={c.name} size={32} /><span><b>{c.name}</b><br /><span className="mut">{c.industry}{c.city ? `, ${c.city}` : ''}{c.review_count ? `, ${c.avg_rating}/5` : ''}</span></span></Link>
          ))}
          {!onPick && res.jobTitles.map((t) => <Link key={t.slug} href={`/salaries/${t.slug}`}>{t.title}<span className="mut">Salaries</span></Link>)}
          {!res.companies.length && !res.jobTitles.length && <div className="mut">No match yet. Try another name, or be the first to share about it.</div>}
        </div>
      )}
    </div>
  );
}
