'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/client';

// Confirms by POST on page load. Emails link here (not to the API) so mail scanners that prefetch links cannot verify by accident.
export default function VerifyToken() {
  const token = useSearchParams().get('token');
  const [state, setState] = useState('working');
  useEffect(() => {
    if (!token) { setState('bad'); return; }
    api('/verifications/confirm', { method: 'POST', body: { token } }).then(() => setState('ok')).catch(() => setState('bad'));
  }, [token]);
  return (
    <section className="sec" style={{ maxWidth: 480, margin: 'auto' }}>
      <h1 className="s">{state === 'working' ? 'Verifying…' : state === 'ok' ? 'You are verified' : 'This link did not work'}</h1>
      <p className="mut">{state === 'ok' ? 'Thanks. Your account has been updated.' : state === 'bad' ? 'It may have expired. Request a new one from your account.' : ''}</p>
      {state !== 'working' && <Link className="btn" href="/me">Go to my account</Link>}
    </section>
  );
}
