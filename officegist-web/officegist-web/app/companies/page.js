import Link from 'next/link';
import { get } from '@/lib/api';
import SearchBox from '@/components/SearchBox';
import { CompanyCard, Empty } from '@/components/ui';

export const metadata = { title: 'Company reviews in Nigeria', description: 'Browse anonymous employee reviews, ratings, salaries and interview experiences for companies in Nigeria.' };

export default async function Companies({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const qs = new URLSearchParams({ page, limit: 20, sort: searchParams.sort || 'reviews', ...(searchParams.industry && { industry: searchParams.industry }), ...(searchParams.location && { location: searchParams.location }) });
  const [list, industries, found] = await Promise.all([
    searchParams.q ? null : get(`/companies?${qs}`), get('/industries', 3600), searchParams.q ? get(`/search?q=${encodeURIComponent(searchParams.q)}`, 30) : null,
  ]);
  const items = searchParams.q ? found?.companies || [] : list?.items || [];
  const link = (extra) => `/companies?${new URLSearchParams({ ...searchParams, ...extra })}`;

  return (
    <section className="sec">
      <h1 className="s" style={{ marginBottom: 16 }}>{searchParams.q ? `Results for “${searchParams.q}”` : 'Companies'}</h1>
      <SearchBox placeholder="Company, industry, location or job title" />
      {!searchParams.q && (
        <div className="chips" style={{ marginTop: 16 }}>
          <Link href="/companies" className={!searchParams.industry ? 'on' : ''}>All</Link>
          {(industries || []).map((i) => <Link key={i.slug} href={link({ industry: i.slug, page: 1 })} className={searchParams.industry === i.slug ? 'on' : ''}>{i.name}</Link>)}
        </div>
      )}
      <div className="grid g2" style={{ marginTop: 16 }}>
        {items.map((c) => <CompanyCard key={c.slug} c={c} />)}
      </div>
      {!items.length && <Empty title="No companies found">Try a different search, or <Link href="/contribute" style={{ textDecoration: 'underline' }}>share about a workplace</Link>.</Empty>}
      {!searchParams.q && list && list.total > page * 20 && <p><Link className="btn g" href={link({ page: page + 1 })}>Show more</Link></p>}
    </section>
  );
}
