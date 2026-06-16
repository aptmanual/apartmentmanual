/**
 * Cloudflare Pages Function  —  /api/blog-search
 * 저장 위치(중요):  functions/api/blog-search.js
 *
 * 호출 예:  /api/blog-search?tag=싱크대원홀수전&n=3
 *
 * 동작:
 *  1) 네이버 블로그 검색 API로 태그(키워드) 최신순 검색
 *  2) 내 블로그(mac6765) 글만 추려 상위 n개
 *  3) 각 글에서 대표 이미지(og:image)를 뽑아 썸네일로 반환
 *  4) 결과를 30분간 엣지 캐시 → 네이버 호출/속도 최적화
 *
 * 사전 설정(한 번만):
 *  · 네이버 개발자센터(developers.naver.com)에서 애플리케이션 등록 → "검색" API 추가
 *  · Cloudflare Pages → 프로젝트 → Settings → Environment variables 에 추가
 *      NAVER_CLIENT_ID     = 발급받은 Client ID
 *      NAVER_CLIENT_SECRET = 발급받은 Client Secret
 */

const BLOG_ID = 'mac6765';        // 내 네이버 블로그 ID
const DISPLAY = 30;               // 검색에서 받아올 후보 수(이 중 내 블로그 글만 추림)
const CACHE_SECONDS = 1800;       // 30분 캐시

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const tag = (url.searchParams.get('tag') || '').trim();
  const n = Math.min(parseInt(url.searchParams.get('n') || '3', 10) || 3, 6);

  if (!tag) return json([], 200);

  // 1) 엣지 캐시 확인
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return json({ error: 'NAVER_CLIENT_ID/SECRET 환경변수가 설정되지 않았습니다.' }, 500);
  }

  // 2) 네이버 블로그 검색 API (최신순)
  const api = 'https://openapi.naver.com/v1/search/blog.json'
    + '?query=' + encodeURIComponent(tag)
    + '&display=' + DISPLAY + '&sort=date';

  let items = [];
  try {
    const sr = await fetch(api, {
      headers: {
        'X-Naver-Client-Id': env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': env.NAVER_CLIENT_SECRET
      }
    });
    if (!sr.ok) return json([], 200);
    const sd = await sr.json();
    items = Array.isArray(sd.items) ? sd.items : [];
  } catch (e) {
    return json([], 200);
  }

  // 3) 내 블로그 글만 추려 상위 n개
  const mine = items.filter(it =>
    (it.link || '').includes('blog.naver.com/' + BLOG_ID) ||
    (it.bloggerlink || '').includes(BLOG_ID)
  ).slice(0, n);

  // 4) 각 글의 대표 이미지(og:image) 추출
  const out = await Promise.all(mine.map(async it => {
    const link = (it.link || '').replace(/^http:/, 'https:');
    const mlink = link.replace('blog.naver.com', 'm.blog.naver.com'); // 모바일 페이지가 og 태그가 깔끔
    let thumb = '';
    try {
      const pr = await fetch(mlink, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AptManualBot/1.0)' },
        cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true }
      });
      const html = await pr.text();
      const m =
        html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (m) thumb = m[1].replace(/&amp;/g, '&');
    } catch (e) { /* 썸네일 없으면 빈 값 — 프런트가 대체 배경 처리 */ }

    return {
      title: decodeEntities(stripTags(it.title || '')),
      link,
      date: it.postdate || '',
      thumb
    };
  }));

  const res = json(out, 200);
  res.headers.set('Cache-Control', 'public, max-age=' + CACHE_SECONDS);
  context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

/* CORS preflight (같은 도메인이면 불필요하지만 안전하게) */
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
