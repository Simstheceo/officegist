import Link from 'next/link';
import { get } from '@/lib/api';
import GistFeed from '@/components/GistFeed';
import { Empty } from '@/components/ui';
import { CATEGORIES } from '@/lib/format';

export const metadata = { title: 'The Gist', description: 'Short, anonymous workplace stories and advice from employees in Nigeria.' };

export default async function Gist({ searchParams }) {
  const cat = searchParams.category || '';
  const d = await get(`/gist${cat ? `?category=${cat}` : ''}`, 30);
  return (
    <section className="sec">
      <h1 className="s" style={{ marginBottom: 16 }}>The Gist</h1>
      <div className="chips">
        <Link href="/gist" className={!cat ? 'on' : ''}>All</Link>
        {CATEGORIES.map(([v, l]) => <Link key={v} href={`/gist?category=${v}`} className={cat === v ? 'on' : ''}>{l}</Link>)}
      </div>
      <GistFeed key={cat} initial={d?.items || []} nextCursor={d?.nextCursor || null} category={cat} />
      {!d?.items?.length && <div style={{ marginTop: 16 }}><Empty title="Nothing here yet">Post the first gist in this category.</Empty></div>}
    </section>
  );
}
