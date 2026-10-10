'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/client';

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // Only same-site paths are allowed as the post-login destination (prevents open redirects).
  const next = params.get('next');
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/me';

  const go = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await api(`/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: { email, password } }); router.push(dest); router.refresh(); }
    catch (x) { setErr(x.issues?.[0]?.message || x.message); }
    setBusy(false);
  };

  return (
    <section className="sec" style={{ maxWidth: 420, margin: 'auto' }}>
      <h1 className="s" style={{ marginBottom: 8 }}>{mode === 'login' ? 'Sign in' : 'Create your account'}</h1>
      <p className="mut">{mode === 'login' ? 'Welcome back.' : 'Your name is never shown. Contributions appear as “Anonymous Employee”.'}</p>
      <form onSubmit={go}>
        <label htmlFor="em">Email</label>
        <input id="em" className="f" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pw">Password</label>
        <input id="pw" className="f" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <div className="err" role="alert">{err}</div>}
        <p><button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button></p>
      </form>
      <button className="lnk" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
    </section>
  );
}
