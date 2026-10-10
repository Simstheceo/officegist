import Link from 'next/link';
import { get } from '@/lib/api';
import SearchBox from '@/components/SearchBox';
import GistFeed from '@/components/GistFeed';
import { CompanyCard, SalaryCard, InterviewCard, Empty } from '@/components/ui';

export default async function Home() {
  const [trending, gist, salaries, interviews] = await Promise.all([
    get('/companies/trending', 300), get('/gist', 30), get('/salaries', 300), get('/interviews?limit=3', 60),
  ]);
  const gists = (gist?.items || []).slice(0, 2);
  const sal = (salaries?.items || []).slice(0, 3);
  const ints = (interviews?.items || []).slice(0, 3);

  return (
    <>
      <section className="hero">
        <h1>What&apos;s it really like to work there?</h1>
        <p>Search companies. Read anonymous employee experiences. Share yours.</p>
        <SearchBox />
        <div style={{ marginTop: 14 }}><Link className="btn g" href="/contribute">Drop the Gist</Link></div>
        <div className="tr"><span>🔒 Anonymous</span><span>👥 Employee-powered</span><span>✔ Verified where possible</span></div>
      </section>

      <section className="sec">
        <h2>🔥 Trending Workplaces</h2>
        {trending?.length ? <div className="grid g3">{trending.slice(0, 3).map((c) => <CompanyCard key={c.slug} c={c} />)}</div>
          : <Empty title="No companies yet">Companies appear here as soon as they are added.</Empty>}
      </section>

      <section className="sec">
        <h2>👀 What&apos;s the gist?</h2>
        {gists.length ? <GistFeed initial={gists} nextCursor={null} compact />
          : <Empty title="No gist yet">Be the first to share what you wish you had known.</Empty>}
        <p><Link className="btn g" href="/gist">See all gist</Link></p>
      </section>

      <section className="sec">
        <h2>💰 What are people earning?</h2>
        {sal.length ? <div className="grid g3">{sal.map((s) => <SalaryCard key={s.slug} s={s} />)}</div>
          : <Empty title="Salary figures appear once enough people report">To protect privacy we only show a role&apos;s pay after several anonymous reports. <Link href="/contribute/salary" style={{ textDecoration: 'underline' }}>Add yours</Link>.</Empty>}
        <p><Link className="btn g" href="/salaries">View Salary Insights</Link></p>
      </section>

      <section className="sec">
        <h2>🎤 Before your next interview</h2>
        {ints.length ? <div className="grid g3">{ints.map((i) => <InterviewCard key={i.id} i={i} />)}</div>
          : <Empty title="No interview experiences yet">Interviewed somewhere recently? Help the next person prepare.</Empty>}
        <p><Link className="btn g" href="/interviews">Explore Interview Experiences</Link></p>
      </section>

      <section className="cta">
        <h2>Worked somewhere before?</h2>
        <p>Your experience could save someone from making the wrong career move.</p>
        <Link className="btn" href="/contribute">Drop the Gist</Link>
      </section>
    </>
  );
}
