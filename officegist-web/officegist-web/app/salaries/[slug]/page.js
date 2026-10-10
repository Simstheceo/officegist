import Link from 'next/link';
import { notFound } from 'next/navigation';
import { get } from '@/lib/api';
import { Empty } from '@/components/ui';
import { naira, ago } from '@/lib/format';

export async function generateMetadata({ params }) {
  const s = await get(`/salaries/${params.slug}`, 300);
  if (!s) return { title: 'Salary not found' };
  const range = s.median ? ` Typical range ${naira(s.low)}–${naira(s.high)} a month.` : '';
  return { title: `${s.title} salary in Nigeria`, description: `What a ${s.title} earns in Nigeria, from ${s.reports} anonymous reports.${range}`, alternates: { canonical: `/salaries/${params.slug}` } };
}

export default async function Salary({ params }) {
  const s = await get(`/salaries/${params.slug}`, 300);
  if (!s) notFound();
  return (
    <section className="sec">
      <h1 className="s">{s.title} salary in Nigeria</h1>
      {s.insufficientData ? (
        <Empty title="Not enough reports to show figures yet">{s.reports} of {s.minimumReports} anonymous reports so far. <Link href={`/contribute/salary`} style={{ textDecoration: 'underline' }}>Add yours</Link>.</Empty>
      ) : (
        <>
          <div className="card" style={{ margin: '16px 0' }}>
            <div className="mut">Median monthly base pay</div>
            <div className="rt" style={{ fontSize: 44 }}>{naira(s.median)}</div>
            <div className="mut">Typical range {naira(s.low)}–{naira(s.high)} · {s.reports} reports · updated {ago(s.lastUpdated)}</div>
          </div>
          {s.byCompany?.length > 0 && (
            <div className="card sc" style={{ overflowX: 'auto' }}>
              <h3>By company</h3>
              <table><thead><tr><th>Company</th><th>Median</th><th>Range</th><th>Reports</th></tr></thead>
                <tbody>{s.byCompany.map((c) => <tr key={c.slug}><td><Link href={`/companies/${c.slug}`}>{c.name}</Link></td><td>{naira(c.median)}</td><td>{naira(c.low)}–{naira(c.high)}</td><td>{c.reports}</td></tr>)}</tbody></table>
            </div>
          )}
        </>
      )}
      <p><Link className="btn g" href={`/interviews/${s.slug}`}>Interview experiences for this role</Link></p>
    </section>
  );
}
