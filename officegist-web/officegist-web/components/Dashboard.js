'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';
import { ago, pretty } from '@/lib/format';

const NOTE = {
  CONTRIBUTION_APPROVED: 'Your contribution is now live.', CONTRIBUTION_REJECTED: 'A contribution was not published.',
  CONTRIBUTION_NEEDS_EDIT: 'A contribution needs an edit before it can be published.', CONTRIBUTION_ESCALATED: 'A contribution is under closer review.',
  VERIFICATION_VERIFIED: 'Your verification is complete.', CLAIM_APPROVED: 'Your company claim was approved.', CLAIM_REJECTED: 'Your company claim was not approved.',
};

export default function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [data, setData] = useState({});
  const [tab, setTab] = useState('contributions');

  useEffect(() => {
    api('/me').then(setMe).catch(() => router.replace('/sign-in?next=/me'));
    Promise.all([api('/me/contributions'), api('/me/saved'), api('/me/notifications'), api('/me/verifications')])
      .then(([contributions, saved, notifications, verifications]) => setData({ contributions, saved, notifications, verifications })).catch(() => {});
  }, [router]);

  const out = async () => { await api('/auth/logout', { method: 'POST', body: {} }); router.push('/'); router.refresh(); };
  const readAll = async () => { await api('/me/notifications/read', { method: 'POST', body: {} }); setData((d) => ({ ...d, notifications: { ...d.notifications, unread: 0 } })); };
  if (!me) return <p className="mut" style={{ padding: 40 }}>Loading…</p>;

  const TABS = [['contributions', 'My Contributions'], ['saved', 'Saved'], ['notifications', `Notifications${data.notifications?.unread ? ` (${data.notifications.unread})` : ''}`], ['verification', 'Verification'], ['settings', 'Account Settings']];
  const c = data.contributions || [];

  return (
    <section className="sec">
      <h1 className="s">{me.anonymousName}</h1>
      <p className="mut">This is how you appear publicly. Your email and any private details are never shown.</p>
      {me.role === 'ADMIN' || me.role === 'MODERATOR' ? <p><Link className="btn s g" href="/admin">Open admin</Link></p> : null}
      <div className="chips">{TABS.map(([v, l]) => <button key={v} className={tab === v ? 'on' : ''} onClick={() => setTab(v)}>{l}</button>)}</div>

      {tab === 'contributions' && (c.length ? <div className="grid">{c.map((x) => (
        <div className="card" key={x.id}><span className="tag">{pretty(x.type)}</span> <span className={`tag ${x.status === 'APPROVED' ? 'ok' : x.status === 'NEEDS_EDIT' || x.status === 'REJECTED' ? 'hi' : ''}`}>{pretty(x.status)}</span>
          <span className="mut"> · {ago(x.created_at)}</span><p style={{ margin: '8px 0 0' }}>{x.snippet}</p></div>))}</div>
        : <div className="empty"><b>Nothing yet</b>Your reviews, salaries, interviews and gist will show here, with their review status.</div>)}

      {tab === 'saved' && <div className="grid g2">
        {data.saved?.companies.map((s) => <Link key={s.slug} className="card" href={`/companies/${s.slug}`}><b>{s.name}</b><div className="mut">{s.review_count ? `${s.avg_rating}/5, ${s.review_count} reviews` : 'No reviews yet'}</div></Link>)}
        {data.saved?.gists.map((g) => <div key={g.id} className="card"><div className="mut">Saved gist</div><p style={{ margin: '6px 0 0' }}>{g.body}</p></div>)}
        {!data.saved?.companies.length && !data.saved?.gists.length && <div className="empty"><b>No saved items</b>Save companies and gist to find them again here.</div>}
      </div>}

      {tab === 'notifications' && <>
        {data.notifications?.unread > 0 && <p><button className="btn s g" onClick={readAll}>Mark all as read</button></p>}
        <div className="grid">{data.notifications?.items.map((n) => (
          <div className="card" key={n.id} style={n.read_at ? { opacity: .7 } : undefined}>{NOTE[n.type] || pretty(n.type)}{n.payload?.note && <div className="warn">{n.payload.note}</div>}<div className="mut">{ago(n.created_at)}</div></div>))}
          {!data.notifications?.items.length && <div className="empty"><b>All quiet</b>We will tell you when something you posted is reviewed.</div>}</div></>}

      {tab === 'verification' && <div className="card">
        <p><b>Email:</b> {data.verifications?.emailVerified ? <span className="tag ok">Verified</span> : <>Not verified yet <button className="btn s g" onClick={() => api('/verifications/email/resend', { method: 'POST', body: {} })}>Resend link</button></>}</p>
        {data.verifications?.items.filter((v) => v.company_slug).map((v, i) => <p key={i}>Work email at <Link href={`/companies/${v.company_slug}`} style={{ textDecoration: 'underline' }}>{v.company_slug}</Link>: <span className={`tag ${v.status === 'VERIFIED' ? 'ok' : ''}`}>{pretty(v.status)}</span></p>)}
        <p className="mut">Verified experience badges are earned by confirming a work email when you review.</p></div>}

      {tab === 'settings' && <div className="card"><p className="mut">Signed in as {me.email}</p><button className="btn g" onClick={out}>Sign out</button></div>}
    </section>
  );
}
