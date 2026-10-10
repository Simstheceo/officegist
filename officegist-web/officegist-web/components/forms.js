'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, needSignIn } from '@/lib/client';

// Small shared helpers for the contribution forms.
export function useSubmit(path) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [fields, setFields] = useState({});
  const [result, setResult] = useState(null);
  const send = async (body) => {
    setBusy(true); setErr(''); setFields({}); setResult(null);
    try { const r = await api(path, { method: 'POST', body }); setResult(r); return r; }
    catch (e) {
      if (!needSignIn(e, router)) {
        setErr(e.message);
        setFields(Object.fromEntries((e.issues || []).map((i) => [i.field, i.message])));
      }
    } finally { setBusy(false); }
  };
  return { busy, err, fields, result, send, setResult };
}

export const Field = ({ label, error, children }) => (
  <div><label>{label}</label>{children}{error && <div className="err" role="alert">{error}</div>}</div>
);

export function Outcome({ result, company }) {
  return (
    <div className="card">
      <span className={`tag ${result.status === 'NEEDS_EDIT' ? 'hi' : 'ok'}`}>{result.status === 'APPROVED' ? 'Live' : result.status === 'NEEDS_EDIT' ? 'Needs a small edit' : 'In review'}</span>
      <p>{result.message}</p>
      {result.issues?.map((i) => <div key={i} className="warn">{i}</div>)}
      <p><a className="btn" href={company ? `/companies/${company}` : '/me'}>{company ? 'Back to company' : 'Go to my account'}</a></p>
    </div>
  );
}

export function CompanyPicker({ value, onChange, SearchBox }) {
  return value
    ? <div className="card co"><b style={{ flex: 1 }}>{value.name}</b><button className="lnk" onClick={() => onChange(null)}>Change</button></div>
    : <SearchBox placeholder="Search for the company" onPick={onChange} />;
}

// Preselect from ?company=slug
export async function companyFromSlug(slug) {
  if (!slug) return null;
  try { const r = await api('/search?q=' + encodeURIComponent(slug.replace(/-/g, ' '))); return r.companies.find((c) => c.slug === slug) || null; } catch { return null; }
}
