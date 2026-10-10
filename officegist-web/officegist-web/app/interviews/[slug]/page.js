import Link from 'next/link';
import { notFound } from 'next/navigation';
import { get } from '@/lib/api';
import { InterviewCard, Empty } from '@/components/ui';

// /interviews/abc-logistics (a company) or /interviews/hr-officer (a role). Company wins if both exist.
async function load(slug) {
  const company = await get(`/companies/${slug}/interviews`, 60);
  if (company) return { kind: 'company', data: company, profile: await get(`/companies/${slug}`) };
  const role = await get(`/interviews?role=${slug}`, 60);
  return role?.items?.length ? { kind: 'role', data: role } : null;
}

export async function generateMetadata({ params }) {
  const r = await load(params.slug);
  if (!r) return { title: 'Interviews' };
  const name = r.kind === 'company' ? r.profile?.name : r.data.items[0].role;
  return { title: `${name} interview questions and experiences`, description: `Anonymous interview experiences${r.kind === 'company' ? ` at ${name}` : ` for ${name}`}: stages, difficulty and common questions.`, alternates: { canonical: `/interviews/${params.slug}` } };
}

export default async function InterviewsFor({ params }) {
  const r = await load(params.slug);
  if (!r) notFound();
  const name = r.kind === 'company' ? r.profile?.name : r.data.items[0].role;
  return (
    <section className="sec">
      <h1 className="s" style={{ marginBottom: 16 }}>Interviews: {name}</h1>
      {r.data.commonQuestions?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Common questions</h3>
          <ul style={{ paddingLeft: 18 }}>{r.data.commonQuestions.map((q, i) => <li key={i}>{q.question}{q.times > 1 && <span className="mut"> (asked {q.times} times)</span>}</li>)}</ul>
        </div>
      )}
      <div className="grid g2">{r.data.items.map((i) => <InterviewCard key={i.id} i={i} />)}</div>
      {!r.data.items.length && <Empty title="No interview experiences yet">Be the first to share how it went.</Empty>}
      <p><Link className="btn" href={`/contribute/interview${r.kind === 'company' ? `?company=${params.slug}` : ''}`}>Share your interview</Link></p>
    </section>
  );
}
