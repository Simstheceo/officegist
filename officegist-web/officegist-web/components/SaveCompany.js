'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, needSignIn } from '@/lib/client';

export default function SaveCompany({ slug }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const toggle = async () => {
    try { await api(`/me/saved/companies/${slug}`, { method: saved ? 'DELETE' : 'PUT', body: saved ? undefined : {} }); setSaved(!saved); }
    catch (e) { needSignIn(e, router); }
  };
  return <button className="btn s g" onClick={toggle}>{saved ? 'Saved' : 'Save'}</button>;
}
