'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/client';

const NAV = [['Home', '/'], ['Companies', '/companies'], ['Gist', '/gist'], ['Salaries', '/salaries'], ['Interviews', '/interviews']];
const BOTTOM = [['Home', '/'], ['Search', '/companies'], ['Gist', '/gist'], ['Contribute', '/contribute'], ['Profile', '/me']];

export default function Header() {
  const path = usePathname();
  const [me, setMe] = useState(undefined); // undefined = loading, null = signed out
  useEffect(() => { api('/me').then(setMe).catch(() => setMe(null)); }, [path]);
  const on = (href) => (href === '/' ? path === '/' : path.startsWith(href));

  return (
    <>
      <header className="top">
        <div className="w">
          <Link className="logo" href="/">Office<b>Gist</b></Link>
          <nav className="d" aria-label="Main">{NAV.map(([n, h]) => <Link key={h} href={h} className={on(h) ? 'on' : ''}>{n}</Link>)}</nav>
          <span className="sp" />
          {me === null && <Link className="lnk" href="/sign-in">Sign In</Link>}
          {me && <Link className="lnk" href="/me">{me.anonymousName}</Link>}
          <Link className="btn s" href="/contribute">Drop the Gist</Link>
        </div>
      </header>
      <nav className="bn" aria-label="Mobile">{BOTTOM.map(([n, h]) => <Link key={h} href={h} className={on(h) ? 'on' : ''}>{n}</Link>)}</nav>
    </>
  );
}
