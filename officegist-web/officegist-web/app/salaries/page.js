import { get } from '@/lib/api';
import Link from 'next/link';
import { SalaryCard, Empty } from '@/components/ui';

export const metadata = { title: 'Salaries in Nigeria', description: 'What people really earn in Nigeria: median and typical range by job title, from anonymous reports.' };

export default async function Salaries() {
  const d = await get('/salaries', 300);
  return (
    <section className="sec">
      <h1 className="s">Salaries in Nigeria</h1>
      <p className="mut">Monthly base pay in naira. A role appears once at least {d?.minimumReports || 5} people have reported it, so no one can be singled out.</p>
      <div className="grid g3">{(d?.items || []).map((s) => <SalaryCard key={s.slug} s={s} />)}</div>
      {!d?.items?.length && <Empty title="No role has enough reports yet">Add your salary anonymously to help unlock this page.</Empty>}
      <p><Link className="btn" href="/contribute/salary">Add your salary</Link></p>
    </section>
  );
}
