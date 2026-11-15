import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHTML } from 'linkedom';

function load() {
  const { document } = parseHTML(readFileSync('_site/index.html', 'utf8'));
  Function('document', readFileSync('assets/js/menu.js', 'utf8'))(document);
  return document;
}

const click = (d, el) => el.dispatchEvent(new d.defaultView.Event('click', { bubbles: true }));

test('swaps no-js for js', () => {
  const d = load();
  assert.ok(d.documentElement.classList.contains('js'));
  assert.ok(!d.documentElement.classList.contains('no-js'));
});

test('toggle opens and closes', () => {
  const d = load();
  const b = d.getElementById('menu-toggle');
  click(d, b);
  assert.equal(b.getAttribute('aria-expanded'), 'true');
  assert.equal(b.getAttribute('aria-label'), 'Close menu');
  assert.equal(d.getElementById('site-header').dataset.menu, 'open');
  click(d, b);
  assert.equal(b.getAttribute('aria-expanded'), 'false');
  assert.equal(d.getElementById('site-header').dataset.menu, 'closed');
});

test('Escape closes', () => {
  const d = load();
  const b = d.getElementById('menu-toggle');
  click(d, b);
  const e = new d.defaultView.Event('keydown', { bubbles: true });
  Object.defineProperty(e, 'key', { value: 'Escape' });
  d.dispatchEvent(e);
  assert.equal(b.getAttribute('aria-expanded'), 'false');
});

test('following a nav link closes', () => {
  const d = load();
  click(d, d.getElementById('menu-toggle'));
  click(d, d.querySelector('#site-nav a[href="/#work"]'));
  assert.equal(d.getElementById('site-header').dataset.menu, 'closed');
});
