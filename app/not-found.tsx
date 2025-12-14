import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-lg font-semibold">페이지를 찾을 수 없습니다</p>

      <p className="mt-2 text-sm text-gray-500">
        주소가 잘못되었거나 삭제된 페이지일 수 있어요
      </p>

      <div className="mt-6 flex gap-4">
        <Link href="/" className="rounded bg-black px-4 py-2 text-sm">
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
