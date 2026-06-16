/*
  apartmentmanual.kr - Naver Blog RSS case cards
  사용법:
  1) 이 파일을 사이트 루트에 업로드합니다: /naver-rss-cases.js
  2) index.html의 실제 시공사례 영역에 <div id="naver-case-list"></div>를 넣습니다.
  3) index.html의 </body> 바로 위에 <script src="/naver-rss-cases.js"></script>를 넣습니다.
*/
(function () {
  const API_URL = '/api/naver-rss';
  const MAX_ITEMS = 6;
  const TARGET_SELECTOR = '#naver-case-list';

  const CATEGORY_KEYWORDS = [
    { label: '욕실', words: ['변기', '양변기', '세면대', '세면수전', '샤워수전', '폽업', '팝업', '욕실', '환풍기', '배수구', '하수구'] },
    { label: '주방', words: ['싱크대', '싱크', '주방', '주방수전', '배수통', '배수호스', '후드'] },
    { label: '거실', words: ['거실', '조명', '전등', '스위치', '콘센트', '창문', '방충망'] },
    { label: '방', words: ['방문', '문손잡이', '손잡이', '경첩', '붙박이장', '서랍', '블라인드'] },
    { label: '현관', words: ['현관', '도어락', '중문', '신발장'] },
    { label: '베란다', words: ['베란다', '발코니', '배수', '빨래건조대', '천정건조대', '창호'] }
  ];

  function stripHtml(value) {
    const div = document.createElement('div');
    div.innerHTML = value || '';
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function decodeHtml(value) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value || '';
    return textarea.value;
  }

  function extractImage(descriptionHtml) {
    const decoded = decodeHtml(descriptionHtml || '');
    const match = decoded.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];

    const urlMatch = decoded.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"']*)?/i);
    if (urlMatch && urlMatch[0]) return urlMatch[0];

    return '';
  }

  function detectCategory(text) {
    const source = (text || '').toLowerCase();
    const found = CATEGORY_KEYWORDS.find(group =>
      group.words.some(word => source.includes(word.toLowerCase()))
    );
    return found ? found.label : '시공사례';
  }

  function formatDate(dateText) {
    if (!dateText) return '';
    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  function parseRss(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const parseError = xml.querySelector('parsererror');
    if (parseError) throw new Error('RSS XML을 해석하지 못했습니다.');

    return Array.from(xml.querySelectorAll('item')).slice(0, MAX_ITEMS).map(item => {
      const title = stripHtml(item.querySelector('title')?.textContent || '');
      const link = item.querySelector('link')?.textContent?.trim() || '#';
      const rawDescription = item.querySelector('description')?.textContent || '';
      const description = stripHtml(decodeHtml(rawDescription));
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const image = extractImage(rawDescription);
      const category = detectCategory(`${title} ${description}`);

      return {
        title,
        link,
        description: description.length > 85 ? `${description.slice(0, 85)}...` : description,
        date: formatDate(pubDate),
        image,
        category
      };
    });
  }

  function renderLoading(target) {
    target.innerHTML = '<p class="naver-rss-state">네이버 블로그 시공사례를 불러오는 중입니다...</p>';
  }

  function renderError(target, message) {
    target.innerHTML = `
      <div class="naver-rss-error">
        <strong>시공사례를 불러오지 못했습니다.</strong><br>
        <span>${message}</span><br>
        <a href="https://blog.naver.com/mac6765" target="_blank" rel="noopener">네이버 블로그에서 보기</a>
      </div>
    `;
  }

  function renderPosts(target, posts) {
    if (!posts.length) {
      target.innerHTML = '<p class="naver-rss-state">표시할 블로그 글이 없습니다.</p>';
      return;
    }

    target.innerHTML = posts.map(post => `
      <article class="naver-rss-card">
        ${post.image ? `<a class="naver-rss-thumb" href="${post.link}" target="_blank" rel="noopener"><img src="${post.image}" alt="" loading="lazy"></a>` : ''}
        <div class="naver-rss-body">
          <div class="naver-rss-meta">
            <span>${post.category}</span>
            ${post.date ? `<time>${post.date}</time>` : ''}
          </div>
          <h3><a href="${post.link}" target="_blank" rel="noopener">${post.title}</a></h3>
          ${post.description ? `<p>${post.description}</p>` : ''}
          <a class="naver-rss-link" href="${post.link}" target="_blank" rel="noopener">블로그 사례 보기 ›</a>
        </div>
      </article>
    `).join('');
  }

  async function loadCases() {
    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return;

    renderLoading(target);

    try {
      const response = await fetch(API_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${API_URL} 응답 오류: ${response.status}`);
      const xmlText = await response.text();
      const posts = parseRss(xmlText);
      renderPosts(target, posts);
    } catch (error) {
      console.error(error);
      renderError(target, error.message || '알 수 없는 오류');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCases);
  } else {
    loadCases();
  }
})();
