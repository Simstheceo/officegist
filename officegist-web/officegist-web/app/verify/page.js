import { Suspense } from 'react';
import VerifyToken from '@/components/VerifyToken';
export const metadata = { title: 'Verify', robots: { index: false } };
export default function Page() { return <Suspense><VerifyToken /></Suspense>; }
