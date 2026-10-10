'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, needSignIn } from '@/lib/client';

export const REPORT_REASONS = [['HARASSMENT', 'Harassment'], ['PERSONAL_INFORMATION', 'Personal information'], ['FALSE_INFORMATION', 'False information'], ['SPAM', 'Spam'], ['THREAT', 'Threat'], ['HATE_SPEECH', 'Hate speech'], ['DEFAMATION', 'Defamation'], ['OTHER', 'Other']];

// Helpful + Report for any item. `kind` is the API entity type; `helpfulPath` is null for items with no helpful vote.
export default function ReviewActions({ id, entityType, helpfulPath, count = 0 }) {
  const router = useRouter();
  const [on, setOn] = useState(false);
  const [n, setN] = useState(count);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);

  const helpful = async () => {
    try { const r = await api(helpfulPath.replace(':id', id), { method: 'POST', body: {} }); setOn(r.active); setN((x) => x + (r.active ? 1 : -1)); }
    catch (e) { if (!needSignIn(e, router)) setMsg(e.message); }
  };
  const report = async (reason) => {
    try { const r = await api('/reports', { method: 'POST', body: { entityType, entityId: id, reason } }); setMsg(r.message); setOpen(false); }
    catch (e) { setOpen(false); if (!needSignIn(e, router)) setMsg(e.message); }
  };

  return (
    <>
      <div className="act">
        {helpfulPath && <button className={on ? 'on' : ''} onClick={helpful}>👍 Helpful ({n})</button>}
        <button onClick={() => setOpen(!open)} aria-expanded={open}>Report</button>
      </div>
      {open && <div className="chips" style={{ marginTop: 8 }}>{REPORT_REASONS.map(([v, l]) => <button key={v} onClick={() => report(v)}>{l}</button>)}</div>}
      {msg && <div className="mut" role="status">{msg}</div>}
    </>
  );
}
