import { test } from 'node:test';
import assert from 'node:assert/strict';
import { css, page } from './helpers.mjs';

const home = page('index.html');
const post = page('2020/01/03/ember-and-tailwind.html');

test('nav links and CTA', () => {
  const links = [...home.querySelectorAll('#site-nav a')].map((a) => [a.textContent.trim(), a.getAttribute('href')]);
  assert.deepEqual(links, [
    ['Skills', '/#skills'],
    ['Work', '/#work'],
    ['Writing', '/#writing'],
    ['Get in touch', 'mailto:james@byrnecodes.com?Subject=Hi!'],
  ]);
});

test('logo links home', () =>
  assert.ok(home.querySelector('a[href="/"] img[src="/assets/img/byrnecodes.svg"][alt="Byrnecodes home"]')));

test('menu button contract', () => {
  const b = home.getElementById('menu-toggle');
  assert.equal(b.getAttribute('aria-controls'), 'site-nav');
  assert.equal(b.getAttribute('aria-expanded'), 'false');
  assert.equal(b.getAttribute('aria-label'), 'Open menu');
  assert.equal(home.getElementById('site-header').dataset.menu, 'closed');
});

test('starts no-js and defers the menu script', () => {
  assert.ok(home.documentElement.classList.contains('no-js'));
  assert.ok(home.querySelector('script[src="/assets/js/menu.js"][defer]'));
});

test('writing is current only on posts', () => {
  assert.equal(post.querySelector('#site-nav a[href="/#writing"]').getAttribute('aria-current'), 'page');
  assert.equal(home.querySelector('#site-nav a[href="/#writing"]').getAttribute('aria-current'), null);
});

test('contact band and footer on every page', () => {
  for (const d of [home, post]) {
    assert.ok([...d.querySelectorAll('h2')].some((h) => h.textContent.trim() === 'Need advice or have a cool idea?'));
    const f = d.querySelector('body > footer');
    assert.ok(f.textContent.includes(`© ${new Date().getFullYear()} Byrnecodes`));
    assert.ok(f.querySelector('a[href="https://github.com/james-byrne"]'));
    const linkedin = f.querySelector('a.footer-link[href="https://www.linkedin.com/in/jamesdesbyrne/"]');
    assert.equal(linkedin.textContent.trim(), 'LinkedIn');
  }
});

test('standalone links meet the 44px touch target', () => {
  const c = css();
  assert.match(c, /\.post-back\{[^}]*min-height:44px/);
  assert.match(c, /\.footer-link\{[^}]*min-height:44px/);
  assert.match(c, /\.site-nav a:not\(\.btn-primary\)\{[^}]*min-height:44px/);
  assert.ok(home.querySelector('body > footer a.footer-link[href="https://github.com/james-byrne"]'));
});
