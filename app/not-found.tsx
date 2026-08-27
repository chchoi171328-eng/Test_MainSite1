import Link from 'next/link';
import { CallLink } from '../components/CallLink';

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
          href="/practice"
          className="px-8 py-3 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-colors text-center"
        >
          업무 분야 보기
        </Link>
        <Link
          href="/consultation"
          className="px-8 py-3 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-colors text-center"
        >
          상담 신청하기
        </Link>
      </div>

      {/* 구 사이트에서 넘어온 방문자가 바로 연락할 수 있게 (DOMAIN_LAUNCH_BRIEF A-4) */}
      <p className="mt-10 text-sm text-gray-500 text-center break-keep">
        찾으시는 내용이 있으면 바로 문의해 주세요.{' '}
        <CallLink
          location="not_found"
          className="font-bold text-brand-dark hover:text-brand-gold transition-colors"
        >
          031-658-6100
        </CallLink>
      </p>
    </div>
  );
}
