import { get } from '@/lib/api';
import { CompanyCard, Empty } from '@/components/ui';

export const metadata = { title: 'Best companies to work for in Nigeria', description: 'Companies in Nigeria ranked by anonymous employee ratings.', alternates: { canonical: '/best-companies/nigeria' } };

export default async function Best() {
  const list = await get('/companies?sort=rating&limit=50', 300);
  const items = (list?.items || []).filter((c) => c.review_count >= 1);
  return (
    <section className="sec">
      <h1 className="s" style={{ marginBottom: 8 }}>Best companies to work for in Nigeria</h1>
      <p className="mut">Ranked by employee ratings. Only companies with reviews appear.</p>
      <div className="grid g2">{items.map((c) => <CompanyCard key={c.slug} c={c} />)}</div>
      {!items.length && <Empty title="Rankings start with the first reviews">Once employees review their workplaces, the best-rated companies show up here.</Empty>}
    </section>
  );
}
