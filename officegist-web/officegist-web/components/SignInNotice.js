'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/client';

// Warns signed-out visitors before they fill a long form, so they do not lose their answers.
export default function SignInNotice() {
  const [out, setOut] = useState(false);
  useEffect(() => { api('/me').catch(() => setOut(true)); }, []);
  if (!out) return null;
  const next = typeof location !== 'undefined' ? encodeURIComponent(location.pathname + location.search) : '';
  return <div className="warn" role="status">You need an account to submit. <Link href={`/sign-in?next=${next}`} style={{ textDecoration: 'underline', fontWeight: 700 }}>Sign in or create one</Link> first. It stays anonymous publicly.</div>;
}
