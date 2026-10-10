import Link from 'next/link';
import { notFound } from 'next/navigation';
import { get } from '@/lib/api';
import { Avatar, Stars, Ring, RatingBar, Empty } from '@/components/ui';
import ReviewActions from '@/components/ReviewActions';
import SaveCompany from '@/components/SaveCompany';
import { DIMS, ago, pretty, tenure, naira } from '@/lib/format';

export async function generateMetadata({ params }) {
  const c = await get(`/companies/${params.slug}`);
  if (!c) return { title: 'Company not found' };
  return { title: c.seo.title.replace(' | OfficeGist', ''), description: c.seo.description, alternates: { canonical: c.seo.canonical }, openGraph: { title: c.seo.title, description: c.seo.description } };
}

export default async function Company({ params, searchParams }) {
  const [c, revs, sal] = await Promise.all([
    get(`/companies/${params.slug}`), get(`/companies/${params.slug}/reviews?sort=${searchParams.sort || 'recent'}&page=${searchParams.page || 1}`, 30), get(`/companies/${params.slug}/salaries`, 300),
  ]);
  if (!c) notFound();
  const reviews = revs?.items || [];
  const sorts = [['recent', 'Most recent'], ['helpful', 'Most helpful'], ['high', 'Highest'], ['low', 'Lowest']];

  return (
    <section className="sec">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(c.seo.jsonLd).replace(/</g, '\\u003c') }} />
      <div className="co">
        <Avatar name={c.name} size={64} />
        <div style={{ flex: 1 }}>
          <h1 className="s">{c.name}</h1>
          <div className="mut">{[c.industry, c.locations?.[0]?.city, c.employee_band && `${c.employee_band} employees`].filter(Boolean).join(', ')}{c.website && <> · <a href={c.website} rel="nofollow noopener" style={{ textDecoration: 'underline' }}>Website</a></>}</div>
        </div>
        <SaveCompany slug={c.slug} />
      </div>
      <div style={{ margin: '12px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {c.verified ? <span className="tag ok">✔ Verified Employer</span> : <Link className="tag" href={`/claim/${c.slug}`}>Unclaimed profile: claim it</Link>}
        {c.is_demo && <span className="tag or">Demo company</span>}
      </div>
      {c.description && <p className="mut" style={{ maxWidth: 640 }}>{c.description}</p>}

      <div className="grid g2">
        <div className="card">
          {c.review_count ? <>
            <div className="rt" style={{ fontSize: 44 }}>{c.avg_rating}<span className="mut">/5</span></div>
            <Stars n={c.avg_rating} /><div className="mut">{c.review_count} reviews</div>
            <h3 style={{ marginTop: 16 }}>Rating breakdown</h3>
            {DIMS.map(([k, l]) => <RatingBar key={k} label={l} value={c.ratings[k]} />)}
          </> : <Empty title="No reviews yet">Worked here? <Link href={`/contribute?company=${c.slug}`} style={{ textDecoration: 'underline' }}>Write the first review</Link>.</Empty>}
        </div>
        <div className="grid">
          {c.review_count > 0 && <div className="card co"><Ring pct={c.recommend_pct} /><div><h3>Would employees recommend this company?</h3><div className="mut">{c.recommend_pct}% Yes</div></div></div>}
          <div className="card">
            <h3>Salaries</h3>
            {sal?.items?.length ? sal.items.slice(0, 4).map((s) => <div key={s.slug} className="mut">{s.title}: {naira(s.low)}–{naira(s.high)} ({s.reports} reports)</div>)
              : <div className="mut">Shown once at least {sal?.minimumReports || 5} people report a role here.</div>}
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link className="btn s g" href={`/interviews/${c.slug}`}>Interviews</Link>
              <Link className="btn s g" href={`/contribute/salary?company=${c.slug}`}>Add salary</Link>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 32 }}>Reviews</h2>
      {reviews.length > 0 && <div className="chips">{sorts.map(([v, l]) => <Link key={v} href={`?sort=${v}`} className={(searchParams.sort || 'recent') === v ? 'on' : ''}>{l}</Link>)}</div>}
      <div className="grid">
        {reviews.map((r) => (
          <article key={r.id} className="card">
            <div className="mut"><b>Anonymous Employee{r.anon_number ? ` #${r.anon_number}` : ''}</b>, {pretty(r.employment)} employee, {r.job_title}{r.department ? `, ${r.department}` : ''}, {tenure(r.tenure_months)}, {r.location}, {ago(r.published_at)}</div>
            <div><Stars n={r.overall_rating} /> <span className="mut">{r.overall_rating}/5</span> {r.verified_experience && <span className="tag ok">Verified experience</span>}</div>
            {r.headline && <h3 style={{ marginTop: 8 }}>{r.headline}</h3>}
            <p style={{ whiteSpace: 'pre-wrap' }}>{r.body}</p>
            <div className="mut">Recommends: {r.would_recommend ? 'Yes' : 'No'} · Would work here again: {r.would_work_again ? 'Yes' : 'No'}</div>
            {r.responses?.map((x, i) => <div key={i} className="warn" style={{ background: 'var(--line)', color: 'var(--ink)' }}><b>Response from {c.name}</b><br />{x.body}</div>)}
            <ReviewActions id={r.id} entityType="REVIEW" helpfulPath="/reviews/:id/helpful" count={r.helpful_count} />
          </article>
        ))}
      </div>
      {!reviews.length && c.review_count > 0 && <Empty title="No more reviews">That is everything for now.</Empty>}
      {reviews.length >= 20 && <p><Link className="btn g" href={`?sort=${searchParams.sort || 'recent'}&page=${(Number(searchParams.page) || 1) + 1}`}>Next page</Link></p>}
      <p><Link className="btn" href={`/contribute?company=${c.slug}`}>Write a review</Link></p>
    </section>
  );
}
