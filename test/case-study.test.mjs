import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VARIANT, exists, page } from './helpers.mjs';

const slugs = ['bogha', 'ticketing-platform', 'perry-oil'];

test('case studies are drafts: not published in the real build', () => {
  for (const slug of slugs) assert.ok(!exists(`work/${slug}/index.html`), slug);
  assert.ok([...page('index.html').querySelectorAll('#work .work-card')].every((c) => c.tagName === 'ARTICLE'));
});

test('each case study renders with its title, facts, story and a way back', () => {
  for (const slug of slugs) {
    const d = page(`work/${slug}/index.html`, VARIANT);
    assert.equal(d.querySelectorAll('h1').length, 1, slug);
    assert.ok(d.querySelector('.case-dek').textContent.trim().length > 60, slug);
    assert.ok(d.querySelectorAll('.case-facts dt').length >= 3, slug);
    assert.ok(d.querySelectorAll('.prose h2').length >= 2, slug);
    assert.ok(d.querySelector('a[href="/#work"].case-back'), slug);
    assert.equal(d.querySelector('link[rel="canonical"]').getAttribute('href'), `https://byrnecodes.com/work/${slug}/`);
    assert.match(d.querySelector('meta[property="og:image"]').getAttribute('content'), new RegExp(`/assets/img/social/${slug}\\.png$`));
  }
});

test('the ticketing case study flags its image as an illustration', () => {
  const d = page('work/ticketing-platform/index.html', VARIANT);
  assert.match(d.querySelector('main img').getAttribute('alt'), /^Illustrative/);
  assert.match(d.querySelector('main').textContent, /illustration/i);
});

test('a work card links to its case study once that page is published', () => {
  const card = [...page('index.html', VARIANT).querySelectorAll('#work .work-card')]
    .find((c) => c.querySelector('h3').textContent.trim() === 'Case study fixture');
  assert.equal(card.tagName, 'A');
  assert.equal(card.getAttribute('href'), '/work/bogha/');
  assert.equal(card.getAttribute('rel'), null);
});
