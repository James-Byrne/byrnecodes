import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VARIANT, page } from './helpers.mjs';

const home = page('index.html');

test('hero copy and CTAs', () => {
  assert.equal(home.querySelector('h1').textContent.trim(), 'Web apps, iPhone apps, and the payments that keep them earning.');
  assert.equal(home.querySelectorAll('h1').length, 1);
  assert.ok([...home.querySelectorAll('p')].some((p) => p.textContent.trim() === 'James Byrne :: Byrnecodes'));
  assert.equal(
    home.querySelector('section#top a.btn-primary[href="mailto:james@byrnecodes.com?Subject=Hi!"]').textContent.trim(),
    'Start a project',
  );
  assert.equal(home.querySelector('section#top a[href="#work"]').textContent.trim(), 'See the work');
});

test('availability hidden when empty, shown when set', () => {
  assert.equal(home.querySelector('[data-availability]'), null);
  assert.equal(
    page('index.html', VARIANT).querySelector('[data-availability]').textContent.trim(),
    'Taking on new work from January',
  );
});

test('honeycomb is decorative with the photo in the centre', () => {
  const h = home.querySelector('.honeycomb');
  assert.equal(h.getAttribute('aria-hidden'), 'true');
  assert.deepEqual(
    [...h.children].map((c) => (c.tagName === 'IMG' ? 'photo' : c.textContent.trim())),
    ['Swift', 'Ember', 'TypeScript', 'photo', 'Rails', 'Agents', 'Payments'],
  );
  const img = h.querySelector('img');
  assert.equal(img.getAttribute('src'), '/assets/img/james-headshot.jpg');
  assert.equal(img.getAttribute('alt'), '');
});
