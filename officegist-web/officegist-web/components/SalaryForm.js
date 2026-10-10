'use client';
import { useEffect, useState } from 'react';
import SearchBox from '@/components/SearchBox';
import SignInNotice from '@/components/SignInNotice';
import { useSubmit, Field, Outcome, CompanyPicker, companyFromSlug } from '@/components/forms';

const LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'];
const TYPES = [['FULL_TIME', 'Full time'], ['PART_TIME', 'Part time'], ['CONTRACT', 'Contract'], ['INTERNSHIP', 'Internship'], ['NYSC', 'NYSC']];
const pretty = (s) => s[0] + s.slice(1).toLowerCase();

export default function SalaryForm({ companySlug }) {
  const [company, setCompany] = useState(null);
  const [d, setD] = useState({ jobTitle: '', department: '', location: '', experienceLevel: 'MID', employmentType: 'FULL_TIME', period: 'MONTHLY', baseSalary: '', allowances: '', bonus: '', year: new Date().getFullYear() });
  const { busy, err, fields, result, send } = useSubmit('/salaries');
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  useEffect(() => { companyFromSlug(companySlug).then((c) => c && setCompany(c)); }, [companySlug]);
  if (result) return <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}><h1 className="s">Thank you</h1><Outcome result={result} company={company.slug} /></section>;

  const num = (v) => (v === '' ? 0 : Number(v));
  const go = () => send({ companySlug: company.slug, ...d, department: d.department || undefined, baseSalary: num(d.baseSalary), allowances: num(d.allowances), bonus: num(d.bonus) });
  const money = (k, label, hint) => <Field label={label} error={fields[k]}><input className="f" inputMode="numeric" placeholder={hint} value={d[k]} onChange={(e) => set(k, e.target.value.replace(/[^\d.]/g, ''))} /></Field>;

  return (
    <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}>
      <SignInNotice />
      <h1 className="s" style={{ marginBottom: 4 }}>Add your salary</h1>
      <p className="mut">Anonymous. Only combined figures are ever shown, never tied to you.</p>
      <Field label="Company"><CompanyPicker value={company} onChange={setCompany} SearchBox={SearchBox} /></Field>
      <Field label="Job title" error={fields.jobTitle}><input className="f" value={d.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} /></Field>
      <Field label="Department (optional)"><input className="f" value={d.department} onChange={(e) => set('department', e.target.value)} /></Field>
      <Field label="Location" error={fields.location}><input className="f" value={d.location} onChange={(e) => set('location', e.target.value)} /></Field>
      <Field label="Experience level"><select className="f" value={d.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>{LEVELS.map((l) => <option key={l} value={l}>{pretty(l)}</option>)}</select></Field>
      <Field label="Employment type"><select className="f" value={d.employmentType} onChange={(e) => set('employmentType', e.target.value)}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
      <Field label="Salary period"><select className="f" value={d.period} onChange={(e) => set('period', e.target.value)}><option value="MONTHLY">Monthly</option><option value="ANNUAL">Annual</option></select></Field>
      {money('baseSalary', 'Base salary (₦)', d.period === 'MONTHLY' ? 'e.g. 250000' : 'e.g. 3000000')}
      {money('allowances', 'Allowances (₦, same period, optional)', '0')}
      {money('bonus', 'Bonus (₦ per year, optional)', '0')}
      <Field label="Year" error={fields.year}><input className="f" inputMode="numeric" value={d.year} onChange={(e) => set('year', Number(e.target.value.replace(/\D/g, '')))} /></Field>
      {err && <div className="err" role="alert">{err}</div>}
      <p><button className="btn" disabled={busy || !company || !d.jobTitle || !d.location || !d.baseSalary} onClick={go}>{busy ? 'Submitting…' : 'Submit anonymously'}</button></p>
    </section>
  );
}
