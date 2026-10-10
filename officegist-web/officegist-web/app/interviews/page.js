import Link from 'next/link';
import { get } from '@/lib/api';
import { InterviewCard, Empty } from '@/components/ui';

export const metadata = { title: 'Interview experiences in Nigeria', description: 'Anonymous interview experiences: stages, difficulty and questions asked at companies in Nigeria.' };

export default async function Interviews() {
  const d = await get('/interviews?limit=30', 60);
  return (
    <section className="sec">
      <h1 className="s" style={{ marginBottom: 16 }}>Interview experiences</h1>
      <div className="grid g3">{(d?.items || []).map((i) => <InterviewCard key={i.id} i={i} />)}</div>
      {!d?.items?.length && <Empty title="No interview experiences yet">Interviewed somewhere recently? Help the next person prepare.</Empty>}
      <p><Link className="btn" href="/contribute/interview">Share your interview</Link></p>
    </section>
  );
}
