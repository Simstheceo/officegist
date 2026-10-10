'use client';
import { useEffect, useState } from 'react';
import SearchBox from '@/components/SearchBox';
import SignInNotice from '@/components/SignInNotice';
import { useSubmit, Field, Outcome, CompanyPicker, companyFromSlug } from '@/components/forms';

const ASSESS = [['NONE', 'None'], ['APTITUDE_TEST', 'Aptitude test'], ['TECHNICAL_TEST', 'Technical test'], ['CASE_STUDY', 'Case study'], ['TAKE_HOME', 'Take-home task'], ['PRESENTATION', 'Presentation'], ['GROUP_EXERCISE', 'Group exercise'], ['OTHER', 'Other']];
const OUTCOMES = [['OFFER', 'Got an offer'], ['REJECTED', 'Rejected'], ['NO_RESPONSE', 'No response'], ['DECLINED_OFFER', 'Declined the offer']];

export default function InterviewForm({ companySlug }) {
  const [company, setCompany] = useState(null);
  const [d, setD] = useState({ role: '', location: '', stageReached: '', difficulty: 'MEDIUM', stagesCount: 2, assessmentType: 'NONE', outcome: 'REJECTED', experience: '' });
  const [qs, setQs] = useState('');
  const { busy, err, fields, result, send } = useSubmit('/interviews');
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  useEffect(() => { companyFromSlug(companySlug).then((c) => c && setCompany(c)); }, [companySlug]);
  if (result) return <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}><h1 className="s">Thank you</h1><Outcome result={result} company={company.slug} /></section>;

  const go = () => send({ companySlug: company.slug, ...d, questions: qs.split('\n').map((s) => s.trim()).filter((s) => s.length >= 5).slice(0, 10) });
  return (
    <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}>
      <SignInNotice />
      <h1 className="s" style={{ marginBottom: 4 }}>Share your interview</h1>
      <Field label="Company"><CompanyPicker value={company} onChange={setCompany} SearchBox={SearchBox} /></Field>
      <Field label="Role" error={fields.role}><input className="f" value={d.role} onChange={(e) => set('role', e.target.value)} /></Field>
      <Field label="Location" error={fields.location}><input className="f" value={d.location} onChange={(e) => set('location', e.target.value)} /></Field>
      <Field label="Furthest stage reached" error={fields.stageReached}><input className="f" placeholder="e.g. Final panel" value={d.stageReached} onChange={(e) => set('stageReached', e.target.value)} /></Field>
      <Field label="Difficulty"><select className="f" value={d.difficulty} onChange={(e) => set('difficulty', e.target.value)}><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select></Field>
      <Field label="Number of stages"><input className="f" type="number" min={1} max={10} value={d.stagesCount} onChange={(e) => set('stagesCount', Number(e.target.value))} /></Field>
      <Field label="Assessment type"><select className="f" value={d.assessmentType} onChange={(e) => set('assessmentType', e.target.value)}>{ASSESS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
      <Field label="Outcome"><select className="f" value={d.outcome} onChange={(e) => set('outcome', e.target.value)}>{OUTCOMES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
      <Field label="Questions asked (one per line, optional)"><textarea className="f" style={{ minHeight: 90 }} value={qs} onChange={(e) => setQs(e.target.value)} /></Field>
      <Field label="How was the overall experience?" error={fields.experience}><textarea className="f" value={d.experience} onChange={(e) => set('experience', e.target.value)} /><div className="mut">At least 30 characters. No names or contact details.</div></Field>
      {err && <div className="err" role="alert">{err}</div>}
      <p><button className="btn" disabled={busy || !company || !d.role || !d.location || !d.stageReached || d.experience.trim().length < 30} onClick={go}>{busy ? 'Submitting…' : 'Submit anonymously'}</button></p>
    </section>
  );
}
