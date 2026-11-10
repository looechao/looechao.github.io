const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('themes/void/static/js/analytics.js', 'utf8');
function setup(type = 'article', bottom = 600) {
  let now = 0;
  const events = [], timers = [], listeners = {}, links = [];
  const rect = { top: 0, bottom: 2000, height: 2000 };
  const document = {
    hidden: false,
    querySelector: s => s === '.card' ? { getBoundingClientRect: () => ({ top: 0, bottom }) } : s === '.article-content' && type === 'article' ? { getBoundingClientRect: () => rect } : null,
    querySelectorAll: () => links,
    addEventListener: (name, fn) => (listeners[name] ??= []).push(fn)
  };
  let intersect;
  const window = { blogAnalytics: { page_type: type }, innerHeight: 800, gtag: (...args) => events.push(args), addEventListener() {} };
  vm.runInNewContext(source, { window, document, location: { pathname: '/missing', href: 'https://looechao.com/', origin: 'https://looechao.com' }, URL, performance: { now: () => now }, setInterval: fn => timers.push(fn), IntersectionObserver: class { constructor(fn) { intersect = fn; } observe() {} unobserve() {} } });
  return { events, rect, document, links, intersect, tick(n = 1) { for (let i = 0; i < n; i++) { now += 1000; timers.forEach(fn => fn()); } }, fire(name, event) { listeners[name]?.forEach(fn => fn(event)); } };
}
test('foreground time, desktop card depth and once per page', () => {
  const s = setup();
  s.tick(29); assert.equal(s.events.length, 0);
  s.tick(); assert.equal(s.events[0][1], 'article_engaged');
  s.rect.top = -1300; s.rect.bottom = 700;
  s.tick(10); assert.deepEqual(s.events.map(e => e[1]), ['article_engaged', 'article_read_end']);
});
test('hidden time excluded and mobile viewport clipped', () => {
  const s = setup('article', 3000);
  s.document.hidden = true; s.fire('visibilitychange'); s.tick(60);
  s.document.hidden = false; s.fire('visibilitychange'); s.tick(29);
  assert.equal(s.events.length, 0); s.tick();
  assert.equal(s.events[0][2].read_percent, 40);
});
test('404 separate, tag page never emits reading events', () => {
  const missing = setup('not_found'); missing.tick(60);
  assert.equal(missing.events.length, 1); assert.equal(missing.events[0][1], 'page_not_found');
  assert.equal(missing.events[0][2].missing_path, '/missing');
  const tag = setup('term'); tag.tick(60); assert.equal(tag.events.length, 0);
});
test('title exposure waits one visible second, clicks strip query and hash', () => {
  const s = setup('home');
  const link = { href: 'https://looechao.com/posts/2026/example/?ref=test#part', textContent: 'Example', dataset: {}, isConnected: true, closest: sel => sel === '.home-list' ? {} : null };
  s.intersect([{ target: link, isIntersecting: true, intersectionRatio: 0.5 }]);
  assert.equal(s.events.length, 0); s.tick(5);
  assert.deepEqual(s.events.map(e => e[1]), ['article_impression']);
  s.fire('click', { target: { closest: () => link } });
  assert.equal(s.events[1][1], 'select_content');
  assert.equal(s.events[1][2].content_id, '/posts/2026/example/');
  assert.equal(s.events[1][2].entry_point, 'home_list');
});
test('background exposure must restart its one second interval', () => {
  const s = setup('home');
  const link = { href: 'https://looechao.com/posts/2026/example/', textContent: 'Example', dataset: {}, isConnected: true, closest: () => null };
  s.intersect([{ target: link, isIntersecting: true, intersectionRatio: 1 }]);
  s.document.hidden = true; s.fire('visibilitychange'); s.tick(10);
  assert.equal(s.events.length, 0);
  s.document.hidden = false; s.fire('visibilitychange');
  assert.equal(s.events.length, 0); s.tick(); assert.equal(s.events.length, 1);
});
