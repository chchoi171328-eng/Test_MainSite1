import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <p className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-4">404 Not Found</p>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6 text-center break-keep">
        요청하신 페이지를 찾을 수 없습니다
      </h1>
      <p className="text-gray-500 mb-10 text-center break-keep">
        주소가 변경되었거나 삭제된 페이지일 수 있습니다.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors text-center"
        >
          홈으로 가기
        </Link>
        <Link
          href="/consultation"
          className="px-8 py-3 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-colors text-center"
        >
          상담 신청하기
        </Link>
      </div>
    </div>
  );
}
