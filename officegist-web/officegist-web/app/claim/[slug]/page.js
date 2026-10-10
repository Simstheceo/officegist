import { notFound } from 'next/navigation';
import { get } from '@/lib/api';
import ClaimForm from '@/components/ClaimForm';

export const metadata = { title: 'Claim your company profile', robots: { index: false } };

export default async function Claim({ params }) {
  const c = await get(`/companies/${params.slug}`);
  if (!c) notFound();
  return <section className="sec" style={{ maxWidth: 560, margin: 'auto' }}><h1 className="s" style={{ marginBottom: 8 }}>Claim {c.name}</h1><ClaimForm slug={c.slug} name={c.name} /></section>;
}
