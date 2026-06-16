// Cloudflare Pages Function
// Route: https://apartmentmanual.kr/api/naver-rss
// Purpose: Proxy Naver Blog RSS so the homepage can read it without browser CORS issues.

const NAVER_RSS_URL = 'https://rss.blog.naver.com/mac6765.xml';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestGet() {
  try {
    const naverResponse = await fetch(NAVER_RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ApartmentManualRSS/1.0; +https://apartmentmanual.kr/)',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
      cf: {
        cacheEverything: true,
        cacheTtl: 300, // 5 minutes
      },
    });

    if (!naverResponse.ok) {
      const errorText = await naverResponse.text();
      return new Response(
        `Failed to fetch Naver RSS. Status: ${naverResponse.status}\n\n${errorText.slice(0, 800)}`,
        {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const headers = new Headers(naverResponse.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Cache-Control', 'public, max-age=300');
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/xml; charset=utf-8');
    }
    headers.delete('Set-Cookie');

    return new Response(naverResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(`RSS proxy error: ${error.message}`, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
}
