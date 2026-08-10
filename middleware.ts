import { NextRequest, NextResponse } from 'next/server';
import redirects from './data/redirects.json';
import { SITE_URL } from './lib/site';

/**
 * 1) 임시 도메인(*.vercel.app) → 정식 도메인 308 (DOMAIN_LAUNCH_BRIEF A-3)
 * 2) 구 사이트(그누보드) URL 301 리디렉션 (지침 13단계)
 *
 * 그누보드 URL은 쿼리스트링(bo_table, wr_id) 기반이라 next.config redirects()로는
 * 매핑 테이블 조회가 어려워 middleware에서 처리한다.
 * 매핑은 data/redirects.json에서 관리 — 추가는 데이터 파일 수정만으로 가능하다.
 */

interface BoardRedirect {
  list: string;
  postDefault: string;
  posts: Record<string, string>;
}

const BOARDS = redirects.boards as unknown as Record<string, BoardRedirect>;
const STATIC = redirects.static as Record<string, string>;

export function middleware(request: NextRequest) {
  const { pathname, searchParams, search } = request.nextUrl;

  // ── 1. 정식 도메인 강제 ────────────────────────────────────────────────
  // Vercel 프로젝트에서 primary domain을 지정하면 여기까지 오기 전에 처리되지만,
  // 설정이 빠지거나 배포 URL로 직접 들어오는 경우를 대비한 안전망이다.
  // 경로·쿼리를 보존한 308(영구, 메서드 보존)로 넘긴다.
  const host = request.headers.get('host') || '';
  if (host.endsWith('.vercel.app')) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, SITE_URL), 308);
  }

  // ── 2. 구 사이트 URL 301 ──────────────────────────────────────────────
  // 그누보드 게시판 URL: /bbs/board.php?bo_table=...&wr_id=...
  if (pathname === '/bbs/board.php' || pathname.startsWith('/bbs/')) {
    const boTable = searchParams.get('bo_table') || '';
    const wrId = searchParams.get('wr_id') || '';
    const board = BOARDS[boTable];

    let destination: string;
    if (board) {
      destination = wrId ? board.posts[wrId] || board.postDefault : board.list;
    } else {
      // 미확인 게시판 — 게시판 상위 개념이 없어 홈으로 (인벤토리에 없는 잔여 URL 한정)
      destination = '/';
    }
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }

  // 구 사이트 정적 페이지 (*.php)
  const staticDestination = STATIC[pathname];
  if (staticDestination) {
    return NextResponse.redirect(new URL(staticDestination, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  // 도메인 강제가 전 경로에 걸려야 하므로 매처를 넓힌다.
  // 정적 자산과 Next 내부 경로는 리다이렉트할 이유가 없어 제외한다.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|assets/|content-assets/).*)',
  ],
};
