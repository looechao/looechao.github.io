const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(supportsObserver = true) {
  const scripts = [];
  let notify;
  const container = { appendChild: script => scripts.push(script) };
  const document = {
    currentScript: { parentElement: container },
    documentElement: { dataset: { theme: 'light' } },
    createElement: () => ({ dataset: {} }),
    querySelector: () => container,
  };
  class IntersectionObserver {
    constructor(callback) { notify = callback; }
    observe() {}
    disconnect() {}
  }
  const source = fs.readFileSync('themes/void/layouts/partials/comments.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(source, { document, window: supportsObserver ? { IntersectionObserver } : {}, IntersectionObserver });
  return { scripts, document, intersect: visible => notify([{ isIntersecting: visible }]) };
}

test('comments load automatically near viewport, once, using current theme', () => {
  const view = setup();
  assert.equal(view.scripts.length, 0);
  view.intersect(false);
  assert.equal(view.scripts.length, 0);
  view.document.documentElement.dataset.theme = 'dark';
  view.intersect(true);
  assert.equal(view.scripts.length, 1);
  assert.equal(view.scripts[0].dataset.theme, 'dark');
  view.intersect(true);
  assert.equal(view.scripts.length, 1);
});

test('browsers without IntersectionObserver load comments automatically', () => {
  assert.equal(setup(false).scripts.length, 1);
});
