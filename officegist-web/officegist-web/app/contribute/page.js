import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';

export const metadata = { title: 'Drop the Gist: share your workplace experience', robots: { index: false } };

export default function Contribute({ searchParams }) {
  return (
    <>
      <div className="chips" style={{ marginTop: 20 }}>
        <Link href="/contribute" className="on">Review a company</Link>
        <Link href="/contribute/salary">Add a salary</Link>
        <Link href="/contribute/interview">Share an interview</Link>
        <Link href="/gist">Post a gist</Link>
      </div>
      <ReviewForm companySlug={searchParams.company || ''} />
    </>
  );
}
