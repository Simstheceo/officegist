'use client';
import { useEffect, useState } from 'react';
import SearchBox from '@/components/SearchBox';
import SignInNotice from '@/components/SignInNotice';
import { api } from '@/lib/client';
import { DIMS } from '@/lib/format';
import { useSubmit, Field, Outcome, CompanyPicker, companyFromSlug } from '@/components/forms';

const TITLES = ['Choose company', 'Employment status', 'Your role', 'Rate the workplace', 'What should people know?', 'Would you recommend it?', 'Would you work here again?', 'Verification'];
const TENURE = [['Under 6 months', 3], ['6 to 12 months', 9], ['1 to 2 years', 18], ['2 to 3 years', 30], ['3 to 5 years', 48], ['5+ years', 72]];

export default function ReviewForm({ companySlug }) {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState(null);
  const [d, setD] = useState({ employment: 'CURRENT', jobTitle: '', department: '', location: '', tenureMonths: 18, ratings: {}, body: '', wouldRecommend: null, wouldWorkAgain: null });
  const [workEmail, setWorkEmail] = useState('');
  const [note, setNote] = useState('');
  const { busy, err, fields, result, send } = useSubmit('/reviews');
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));

  useEffect(() => { companyFromSlug(companySlug).then((c) => c && setCompany(c)); }, [companySlug]);

  // A step may only advance when it is complete, so users never reach a server error for something we can catch here.
  const ready = [
    !!company, true, d.jobTitle.trim().length >= 2 && d.location.trim().length >= 2,
    DIMS.every(([k]) => d.ratings[k]), d.body.trim().length >= 50, d.wouldRecommend !== null, d.wouldWorkAgain !== null, true,
  ][step];

  const submit = async () => {
    const r = await send({ companySlug: company.slug, ...d, department: d.department || undefined });
    if (r && workEmail.trim()) {
      try { const v = await api('/verifications/work-email', { method: 'POST', body: { companySlug: company.slug, workEmail } }); setNote(v.message); }
      catch (e) { setNote(`Your review was saved, but work-email verification failed: ${e.message}`); }
    }
  };

  if (result) return <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}><h1 className="s">Thank you</h1><Outcome result={result} company={company.slug} />{note && <div className="warn">{note}</div>}</section>;

  const YN = (key) => <div className="yn">{[['Yes', true], ['No', false]].map(([l, v]) => <button key={l} className={`btn ${d[key] === v ? '' : 'g'}`} onClick={() => set(key, v)}>{l}</button>)}</div>;

  return (
    <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}>
      <SignInNotice />
      <div className="prog" role="progressbar" aria-valuemin={1} aria-valuemax={8} aria-valuenow={step + 1}><i style={{ width: `${((step + 1) / 8) * 100}%` }} /></div>
      <div className="mut">Step {step + 1} of 8</div>
      <h1 className="s" style={{ margin: '4px 0 12px' }}>{TITLES[step]}</h1>

      {step === 0 && <CompanyPicker value={company} onChange={setCompany} SearchBox={SearchBox} />}
      {step === 1 && ['CURRENT', 'FORMER'].map((v) => <button key={v} className={`btn ${d.employment === v ? '' : 'g'}`} style={{ margin: '0 8px 8px 0' }} onClick={() => set('employment', v)}>{v === 'CURRENT' ? 'Current employee' : 'Former employee'}</button>)}
      {step === 2 && <>
        <Field label="Role" error={fields.jobTitle}><input className="f" value={d.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} /></Field>
        <Field label="Department (optional)" error={fields.department}><input className="f" value={d.department} onChange={(e) => set('department', e.target.value)} /></Field>
        <Field label="Location" error={fields.location}><input className="f" placeholder="e.g. Lagos" value={d.location} onChange={(e) => set('location', e.target.value)} /></Field>
        <Field label="Employment duration"><select className="f" value={d.tenureMonths} onChange={(e) => set('tenureMonths', Number(e.target.value))}>{TENURE.map(([l, v]) => <option key={v} value={v}>{l}</option>)}</select></Field>
      </>}
      {step === 3 && DIMS.map(([k, l]) => (
        <div className="row" key={k}><span>{l}</span>
          <span className="stars" role="radiogroup" aria-label={l}>{[1, 2, 3, 4, 5].map((n) => <button key={n} role="radio" aria-checked={d.ratings[k] === n} aria-label={`${n} stars`} className={(d.ratings[k] || 0) >= n ? 'on' : ''} onClick={() => set('ratings', { ...d.ratings, [k]: n })}>★</button>)}</span>
        </div>))}
      {step === 4 && <Field label="What's something a prospective employee should know before joining?" error={fields.body}>
        <textarea className="f" value={d.body} onChange={(e) => set('body', e.target.value)} />
        <div className="mut">{d.body.trim().length < 50 ? `At least 50 characters (${d.body.trim().length}). ` : ''}Please don&apos;t include names, phone numbers or emails.</div></Field>}
      {step === 5 && YN('wouldRecommend')}
      {step === 6 && YN('wouldWorkAgain')}
      {step === 7 && <>
        <div className="warn">Your identity remains anonymous publicly. You will appear as an anonymous employee, never with your name or email.</div>
        <Field label="Work email (optional, to earn a Verified experience badge)"><input className="f" type="email" placeholder="you@company.com" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} /></Field>
        <div className="mut">We only check the email&apos;s domain against the company and do not store the address. Document verification is coming later.</div>
      </>}

      {err && <div className="err" role="alert">{err}</div>}
      <p style={{ marginTop: 24, display: 'flex', gap: 10 }}>
        {step > 0 && <button className="btn g" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 7 ? <button className="btn" disabled={!ready} onClick={() => setStep(step + 1)}>Continue</button>
          : <button className="btn" disabled={busy} onClick={submit}>{busy ? 'Submitting…' : 'Submit for review'}</button>}
      </p>
    </section>
  );
}
