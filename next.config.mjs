/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 게시글 대표 이미지(목록 썸네일)는 Supabase Storage 공개 버킷에서 제공된다
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wpbamknxfonjfdfzlpya.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // 13단계에서 구 사이트(sllaw.co.kr) 그누보드 URL 301 리디렉션 매핑이 여기에 추가된다.
};

export default nextConfig;
