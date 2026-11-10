/* Blog measurement v2. Keep the automatic GA4 page_view as the only page view. */
(() => {
  'use strict';
  const meta = window.blogAnalytics;
  if (!meta || typeof window.gtag !== 'function') return;
  const send = (event, params = {}) => window.gtag('event', event, params);
  const card = document.querySelector('.card');
  const content = document.querySelector('.article-content');
  const sent = new Set();
  const once = (event, params) => {
    if (sent.has(event)) return;
    sent.add(event);
    send(event, params);
  };
  if (meta.page_type === 'not_found') {
    send('page_not_found', { missing_path: location.pathname });
  }
  // Rectangles work with both the desktop .card scroller and the mobile viewport.
  function viewport() {
    const rect = card?.getBoundingClientRect();
    return { top: Math.max(0, rect?.top ?? 0), bottom: Math.min(window.innerHeight, rect?.bottom ?? window.innerHeight) };
  }
  let activeMs = 0;
  let lastTick = performance.now();
  let wasVisible = !document.hidden;
  let depth = 0;
  function measure() {
    const now = performance.now();
    if (wasVisible && !document.hidden) activeMs += Math.min(now - lastTick, 1500);
    lastTick = now;
    wasVisible = !document.hidden;
    if (document.hidden || !content || meta.page_type !== 'article') return;
    const rect = content.getBoundingClientRect();
    const view = viewport();
    if (rect.height > 0 && rect.top < view.bottom && rect.bottom > view.top) {
      depth = Math.max(depth, Math.min(100, Math.max(0, (view.bottom - rect.top) / rect.height * 100)));
    }
    const params = { active_seconds: Math.floor(activeMs / 1000), read_percent: Math.floor(depth) };
    if (activeMs >= 30000 && depth >= 25) once('article_engaged', params);
    if (activeMs >= 30000 && depth >= 90) once('article_read_end', params);
  }
  if (content && meta.page_type === 'article') {
    setInterval(measure, 1000);
    document.addEventListener('visibilitychange', measure);
    window.addEventListener('pageshow', () => { lastTick = performance.now(); });
  }
  const articlePattern = /^\/(posts|weekly)\/\d{4}\/[^/]+\/$/;
  function articleLink(link) {
    const url = new URL(link.href, location.href);
    const path = url.pathname.replace(/\/?$/, '/');
    if (url.origin !== location.origin || !articlePattern.test(path)) return null;
    return { content_type: 'article', content_id: path, target_article_title: (link.dataset.articleTitle || link.textContent).trim().slice(0, 100), entry_point: link.closest('#pagefind') ? 'search' : link.closest('.featured-post') ? 'featured' : link.closest('.home-list') ? 'home_list' : link.closest('.post-list') ? 'article_list' : 'article_body' };
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const target = articleLink(link);
    if (target) send('select_content', target);
    if (link.closest('.social') && ['RSS', 'Fediverse'].includes(link.title)) {
      send('follow_click', { follow_method: link.title.toLowerCase() });
    }
  });
  // Count title exposure once per article + placement, after >=50% visibility for 1s.
  const visible = new Map();
  const exposed = new Set();
  const observed = new WeakSet();
  if (typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) visible.set(entry.target, performance.now());
      else visible.delete(entry.target);
    }
  }, { threshold: [0, 0.5] });
  function observeLinks() {
    document.querySelectorAll('.featured-title a, .home-list a, .post-title a, #pagefind .pagefind-ui__result-title a').forEach(link => {
      if (!observed.has(link) && articleLink(link)) {
        observed.add(link);
        observer.observe(link);
      }
    });
  }
  observeLinks();
  const search = document.querySelector('#pagefind');
  if (search) new MutationObserver(observeLinks).observe(search, { childList: true, subtree: true });
  document.addEventListener('visibilitychange', () => {
    for (const link of visible.keys()) visible.set(link, performance.now());
  });
  setInterval(() => {
    if (document.hidden) return;
    for (const [link, since] of visible) {
      if (!link.isConnected) { visible.delete(link); continue; }
      if (performance.now() - since < 1000) continue;
      const params = articleLink(link);
      const key = params.content_id + ':' + params.entry_point;
      if (!exposed.has(key)) {
        exposed.add(key);
        send('article_impression', params);
      }
      observer.unobserve(link);
      visible.delete(link);
    }
  }, 250);
})();
