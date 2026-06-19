/**
 * ogimage-worker.js
 * Cloudflare Worker — 네이버 블로그 포스트에서 og:image URL 추출
 *
 * 배포 방법:
 *   1. Cloudflare Dashboard → Workers → 새 Worker 생성 → 이 코드 붙여넣기
 *   2. Workers Routes에서 apartmentmanual.kr/api/ogimage* → 이 Worker 연결
 *
 * 사용법:
 *   GET /api/ogimage?url=https://m.blog.naver.com/mac6765/12345
 *   → { "image": "https://blogfiles.pstatic.net/..." }
 */

export default {
  async fetch(request, env, ctx) {

    /* CORS 헤더 */
    const CORS = {
      'Access-Control-Allow-Origin': 'https://apartmentmanual.kr',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400', // 24시간 캐시
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'url 파라미터가 필요합니다' }), { status: 400, headers: CORS });
    }

    /* 네이버 블로그 URL만 허용 */
    if (!targetUrl.includes('blog.naver.com') && !targetUrl.includes('m.blog.naver.com')) {
      return new Response(JSON.stringify({ error: '허용되지 않는 URL' }), { status: 403, headers: CORS });
    }

    try {
      /* 네이버 블로그 모바일 페이지 fetch */
      const mUrl = targetUrl.replace('https://blog.naver.com/', 'https://m.blog.naver.com/');
      const res = await fetch(mUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html',
          'Accept-Language': 'ko-KR,ko;q=0.9',
        },
        cf: { cacheTtl: 86400, cacheEverything: true },
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ image: null }), { headers: CORS });
      }

      const html = await res.text();

      /* og:image 추출 */
      const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                 || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

      const image = match ? match[1].replace(/&amp;/g, '&') : null;

      return new Response(JSON.stringify({ image }), { headers: CORS });

    } catch (e) {
      return new Response(JSON.stringify({ image: null, error: e.message }), { status: 500, headers: CORS });
    }
  }
};
