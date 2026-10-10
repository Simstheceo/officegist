import Link from 'next/link';
import { colorFor, naira, pretty } from '@/lib/format';

export const Avatar = ({ name, size = 46 }) => (
  <div className="av" style={{ background: colorFor(name), width: size, height: size }} aria-hidden="true">{name[0]}</div>
);
export const Stars = ({ n }) => (
  <span style={{ color: 'var(--or)' }} aria-label={`${n} out of 5`}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))}</span>
);
export const Empty = ({ title, children }) => <div className="empty"><b>{title}</b>{children}</div>;
export const Ring = ({ pct }) => (
  <div className="ring" style={{ background: `conic-gradient(var(--or) ${pct * 3.6}deg, var(--line) 0)` }}><span>{pct}%</span></div>
);
export const RatingBar = ({ label, value }) => (
  <div className="row"><span>{label}</span><div className="bar"><i style={{ width: `${(value || 0) * 20}%` }} /></div><b>{value ?? '-'}</b></div>
);

export function CompanyCard({ c }) {
  return (
    <Link className="card co" href={`/companies/${c.slug}`}>
      <Avatar name={c.name} />
      <div style={{ flex: 1 }}>
        <h3>{c.name}</h3>
        <div className="mut">{c.industry}{c.city ? `, ${c.city}` : ''}{c.is_demo ? ' (demo)' : ''}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {c.review_count ? <><div className="rt">{c.avg_rating}/5</div><div className="mut">{c.review_count} reviews</div></> : <div className="mut">No reviews yet</div>}
      </div>
    </Link>
  );
}

export const SalaryCard = ({ s }) => (
  <Link className="card" href={`/salaries/${s.slug}`} style={{ display: 'block' }}>
    <h3>{s.title}</h3>
    <div className="mut">Nigeria, {s.reports} reports</div>
    <div className="rt" style={{ fontSize: 20, marginTop: 6 }}>{naira(s.low)}–{naira(s.high)}</div>
    <div className="mut">Median {naira(s.median)} a month</div>
  </Link>
);

export const InterviewCard = ({ i }) => (
  <div className="card">
    <h3>{i.company_name || i.role}</h3>
    <div className="mut">{i.company_name ? `${i.role}, ` : ''}{i.location}</div>
    <div style={{ margin: '8px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <span className="tag">{pretty(i.difficulty)}</span><span className="tag">{i.stages_count} stages</span><span className="tag">{pretty(i.outcome)}</span>
    </div>
    <p className="mut" style={{ margin: 0 }}>{i.experience.length > 220 ? i.experience.slice(0, 220) + '…' : i.experience}</p>
  </div>
);
