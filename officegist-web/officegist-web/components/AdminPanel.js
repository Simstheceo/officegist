'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';
import { ago, pretty } from '@/lib/format';

const STATS = [['total_users', 'Users'], ['total_companies', 'Companies'], ['total_reviews', 'Reviews'], ['total_gist_posts', 'Gist posts'], ['total_salary_reports', 'Salary reports'],
  ['total_interview_reports', 'Interview reports'], ['pending_moderation', 'Pending moderation'], ['open_reports', 'Open reports'], ['verified_users', 'Verified users'],
  ['verified_companies', 'Verified companies'], ['new_submissions_today', 'New today'], ['weekly_active_users', 'Weekly active users']];

export default function AdminPanel() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [tab, setTab] = useState('moderation');
  const [extra, setExtra] = useState([]);
  const [err, setErr] = useState('');

  const load = () => {
    api('/admin/stats').then(setStats).catch((e) => (e.status === 401 ? router.replace('/sign-in?next=/admin') : setErr('Staff access only.')));
    api('/admin/moderation').then((d) => setQueue(d.items)).catch(() => {});
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tab === 'reports') api('/admin/reports').then((d) => setExtra(d.items)).catch(() => setExtra([]));
    if (tab === 'claims') api('/admin/claims').then(setExtra).catch(() => setExtra([]));
    if (tab === 'audit') api('/admin/audit').then((d) => setExtra(d.items)).catch(() => setExtra([]));
  }, [tab]);

  const decide = async (id, status) => {
    let note;
    if (status !== 'APPROVED') { note = prompt(status === 'NEEDS_EDIT' ? 'What should the author fix? (they will see this)' : 'Internal note for the audit log'); if (!note) return; }
    try { await api(`/admin/moderation/${id}/decision`, { method: 'POST', body: { status, note } }); load(); } catch (e) { alert(e.message); }
  };
  const claim = async (id, status) => { try { await api(`/admin/claims/${id}/decision`, { method: 'POST', body: { status } }); setExtra((x) => x.filter((c) => c.id !== id)); } catch (e) { alert(e.message); } };

  if (err) return <p className="err" style={{ margin: 40 }}>{err}</p>;
  return (
    <section className="sec">
      <h1 className="s" style={{ marginBottom: 16 }}>Admin</h1>
      {stats && <div className="grid g3" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>{STATS.map(([k, l]) => <div className="card" key={k}><div className="mut">{l}</div><div className="rt" style={{ fontSize: 28 }}>{stats[k]}</div></div>)}</div>}
      <div className="chips" style={{ marginTop: 24 }}>{[['moderation', 'Moderation'], ['reports', 'Reports'], ['claims', 'Claims'], ['audit', 'Audit log']].map(([v, l]) => <button key={v} className={tab === v ? 'on' : ''} onClick={() => setTab(v)}>{l}</button>)}</div>

      {tab === 'moderation' && <div className="grid">{queue.map((q) => (
        <div className="card" key={q.id}>
          <span className="tag">{pretty(q.entity_type)}</span> <span className={`tag ${q.risk === 'HIGH' ? 'hi' : ''}`}>{q.risk}</span> <span className="tag or">{q.status}</span> {q.flags.map((f) => <span className="tag" key={f}>{pretty(f)}</span>)}
          <p style={{ whiteSpace: 'pre-wrap' }}>{q.content}</p><div className="mut">{ago(q.created_at)}</div>
          <div className="act" style={{ gap: 8 }}>
            <button className="btn s" onClick={() => decide(q.id, 'APPROVED')}>Approve</button>
            <button className="btn s g" onClick={() => decide(q.id, 'NEEDS_EDIT')}>Needs edit</button>
            <button className="btn s g" onClick={() => decide(q.id, 'REJECTED')}>Reject</button>
          </div>
        </div>))}
        {!queue.length && <div className="empty"><b>Queue is clear</b>New submissions will appear here.</div>}</div>}

      {tab === 'reports' && <div className="grid">{extra.map((r) => <div className="card" key={r.entity_id}><span className="tag">{pretty(r.entity_type)}</span> {r.report_count} reports: {r.reasons.map(pretty).join(', ')}<div className="mut">First reported {ago(r.first_reported)}</div></div>)}{!extra.length && <div className="empty"><b>No open reports</b></div>}</div>}
      {tab === 'claims' && <div className="grid">{extra.map((c) => <div className="card" key={c.id}><b>{c.company_name}</b><div className="mut">{c.role_title}, email domain {c.work_email_domain}</div><p>{c.evidence_note}</p><div className="act" style={{ gap: 8 }}><button className="btn s" onClick={() => claim(c.id, 'APPROVED')}>Approve</button><button className="btn s g" onClick={() => claim(c.id, 'REJECTED')}>Reject</button></div></div>)}{!extra.length && <div className="empty"><b>No pending claims</b></div>}</div>}
      {tab === 'audit' && <div className="card" style={{ overflowX: 'auto' }}><table><thead><tr><th>When</th><th>Action</th><th>Entity</th><th>Note</th></tr></thead><tbody>{extra.map((a) => <tr key={a.id}><td>{ago(a.created_at)}</td><td>{a.action}</td><td>{a.entity_type}</td><td>{a.note}</td></tr>)}</tbody></table></div>}
    </section>
  );
}
