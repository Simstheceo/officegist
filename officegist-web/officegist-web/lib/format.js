export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const DIMS = [
  ['MANAGEMENT', 'Management'], ['COMPENSATION', 'Compensation'], ['CULTURE', 'Culture'], ['WORK_LIFE_BALANCE', 'Work-life balance'],
  ['CAREER_GROWTH', 'Career growth'], ['JOB_SECURITY', 'Job security'], ['BENEFITS', 'Benefits'],
];
export const CATEGORIES = [
  ['SALARY', 'Salary'], ['MANAGEMENT', 'Management'], ['OFFICE_POLITICS', 'Office politics'], ['INTERVIEW', 'Interview'], ['PROMOTION', 'Promotion'],
  ['WORK_LIFE', 'Work-life'], ['TOXIC_WORKPLACE', 'Toxic workplace'], ['CAREER_ADVICE', 'Career advice'], ['FUNNY', 'Funny'], ['REMOTE_WORK', 'Remote work'], ['OTHER', 'Other'],
];
export const catLabel = (v) => (CATEGORIES.find((c) => c[0] === v) || [v, v])[1];
export const pretty = (s) => String(s || '').toLowerCase().replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export function naira(n) {
  if (n == null) return '';
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(n % 1e6 ? 1 : 0)}m`;
  return `₦${Math.round(n / 1000)}k`;
}
export function ago(d) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' });
}
export const tenure = (m) => (m < 12 ? `${m} mo` : `${Math.floor(m / 12)} yr${m >= 24 ? 's' : ''}`);
const COLORS = ['#FF5A36', '#252525', '#2b6cb0', '#7a3fb0', '#14803c', '#b07a1f'];
export const colorFor = (s) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
