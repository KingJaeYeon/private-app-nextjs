import { redirect } from 'next/navigation';
import { VerifyContents } from '@/app/(auth)/verify-email/components/verify-contents';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  if (!email || !token) {
    redirect('/signup');
  }

  return <VerifyContents email={email} token={token} />;
}
