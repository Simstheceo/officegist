import Link from 'next/link';
import SalaryForm from '@/components/SalaryForm';
export const metadata = { title: 'Add your salary', robots: { index: false } };
export default function Page({ searchParams }) {
  return (<><div className="chips" style={{ marginTop: 20 }}><Link href="/contribute">Review a company</Link><Link href="/contribute/salary" className="on">Add a salary</Link><Link href="/contribute/interview">Share an interview</Link></div><SalaryForm companySlug={searchParams.company || ''} /></>);
}
