import Link from 'next/link';
import InterviewForm from '@/components/InterviewForm';
export const metadata = { title: 'Share your interview', robots: { index: false } };
export default function Page({ searchParams }) {
  return (<><div className="chips" style={{ marginTop: 20 }}><Link href="/contribute">Review a company</Link><Link href="/contribute/salary">Add a salary</Link><Link href="/contribute/interview" className="on">Share an interview</Link></div><InterviewForm companySlug={searchParams.company || ''} /></>);
}
