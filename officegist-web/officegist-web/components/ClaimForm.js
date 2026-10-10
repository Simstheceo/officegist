'use client';
import { useState } from 'react';
import SignInNotice from '@/components/SignInNotice';
import { useSubmit, Field } from '@/components/forms';

export default function ClaimForm({ slug, name }) {
  const [d, setD] = useState({ workEmail: '', roleTitle: '', evidenceNote: '' });
  const { busy, err, fields, result, send } = useSubmit(`/companies/${slug}/claim`);
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  if (result) return <div className="card"><span className="tag ok">Received</span><p>{result.message}</p></div>;
  return (
    <>
      <SignInNotice />
      <p className="mut">Verified employers get a badge, can edit their description, website and logo, and can respond publicly to reviews. They cannot remove reviews.</p>
      <Field label="Work email at the company" error={fields.workEmail}><input className="f" type="email" value={d.workEmail} onChange={(e) => set('workEmail', e.target.value)} /></Field>
      <Field label="Your role" error={fields.roleTitle}><input className="f" value={d.roleTitle} onChange={(e) => set('roleTitle', e.target.value)} /></Field>
      <Field label="Evidence you represent this company (optional now)" error={fields.evidenceNote}><textarea className="f" style={{ minHeight: 90 }} placeholder="e.g. CAC registration number, company website page listing your role" value={d.evidenceNote} onChange={(e) => set('evidenceNote', e.target.value)} /></Field>
      {err && <div className="err" role="alert">{err}</div>}
      <p><button className="btn" disabled={busy || !d.workEmail || d.roleTitle.length < 2} onClick={() => send({ ...d, evidenceNote: d.evidenceNote || undefined })}>{busy ? 'Sending…' : `Request to claim ${name}`}</button></p>
    </>
  );
}
