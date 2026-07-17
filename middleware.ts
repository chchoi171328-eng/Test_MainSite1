import { NextRequest, NextResponse } from 'next/server';
import redirects from './data/redirects.json';

/**
 * 구 사이트(그누보드) URL 301 리디렉션 (지침 13단계)
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
  const { pathname, searchParams } = request.nextUrl;

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
  matcher: [
    '/bbs/:path*',
    '/sub1_1.php',
    '/sub1_2.php',
    '/sub1_3.php',
    '/sub1_4.php',
    '/sub1_5.php',
    '/sub2_1.php',
    '/sub2_2.php',
    '/sub_map.php',
  ],
};
