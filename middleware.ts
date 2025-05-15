// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SOCIAL_AGENTS = ['facebookexternalhit', 'twitterbot', 'kakaotalk'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 루트 바로 밑의 6글자 숏코드 매칭
  const codeMatch = pathname.match(/^\/([A-Za-z0-9_-]{6,})$/);
  if (!codeMatch) {
    return NextResponse.next();
  }
  const code = codeMatch[1];

  // 1) API로 UUID 조회 (300초 ISR)
  const apiRes = await fetch(
    `${process.env.API_BASE_URL}/short/${code}`,
    { next: { revalidate: 300 } }
  );
  if (!apiRes.ok) {
    return NextResponse.next();
  }
  const { uuid } = await apiRes.json();

  // 2) User-Agent 검사
  const ua = req.headers.get('user-agent')?.toLowerCase() || '';
  const isSocial = SOCIAL_AGENTS.some(agent => ua.includes(agent));

  if (isSocial) {
    // 크롤러 → 내부 rewrite → OG 페이지
    const url = req.nextUrl.clone();
    url.pathname = `/share/${uuid}`;
    return NextResponse.rewrite(url);
  } else {
    // 일반 브라우저 → 메인 도메인으로 redirect
    return NextResponse.redirect(
      `https://luckstargram.com/share/${uuid}`,
      302
    );
  }
}

export const config = {
  matcher: ['/:code*'],
};