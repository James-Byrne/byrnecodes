import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VARIANT, css, page } from './helpers.mjs';

const tw = page('2020/01/03/ember-and-tailwind.html');
const ty = page('2019/06/05/types-in-ember.html');
const re = page('2018/07/18/ember-a-retrospective.html');
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

test('title block', () => {
  assert.equal(tw.querySelectorAll('h1').length, 1);
  assert.equal(tw.querySelector('h1').textContent.trim(), 'Ember and tailwindcss');
  assert.equal(tw.querySelector('.post-dek').textContent.trim(), 'Have you heard how awesome tailwindcss and ember are together!?');
  assert.match(text(tw.querySelector('.post-meta')), /^3 January 2020 · Ember · CSS · \d+ min read$/);
  assert.equal(tw.querySelector('a[href="/#writing"]:not([data-num])').textContent.trim(), '← All writing');
});

test('banner fit follows smallBackdropImage', () => {
  const b = tw.querySelector('img.post-banner');
  assert.equal(b.getAttribute('src'), '/assets/img/blog-posts/ember-and-tailwind/backdrop.png');
  assert.equal(b.getAttribute('alt'), '');
  assert.ok(b.classList.contains('is-contained'));
  assert.ok(!ty.querySelector('img.post-banner').classList.contains('is-contained'));
});

test('every post body starts at h2 and has no h1', () => {
  for (const d of [tw, ty, re]) {
    assert.equal(d.querySelectorAll('.prose h1').length, 0);
    assert.equal(d.querySelector('.prose h2, .prose h3, .prose h4').tagName, 'H2');
  }
});

test('one pull quote; asides stay plain', () => {
  assert.equal(tw.querySelectorAll('.prose blockquote.pull').length, 1);
  assert.equal(ty.querySelectorAll('.prose blockquote.pull').length, 0);
  assert.ok(ty.querySelectorAll('.prose blockquote').length > 0);
});

test('every image has alt text', () => {
  for (const d of [tw, ty, re])
    for (const img of d.querySelectorAll('.prose img')) assert.ok(img.getAttribute('alt'), img.getAttribute('src'));
});

test('code is highlighted with the dark theme', () => {
  assert.ok(tw.querySelector('.prose pre.highlight .nt'));
  for (const hex of ['#f6a28c', '#90cdf4', '#9ae6b4', '#fbd38d', '#a0aec0']) assert.ok(css().includes(hex), hex);
  assert.ok(!css().includes('#60a0b0'));
});

test('author aside and older/newer', () => {
  assert.equal(tw.querySelector('aside[aria-label="About the author"] img').getAttribute('alt'), 'James Byrne');
  assert.equal(tw.querySelector('a.post-older').getAttribute('href'), '/2019/06/05/types-in-ember');
  assert.equal(tw.querySelector('a.post-newer'), null);
  assert.equal(re.querySelector('a.post-older'), null);
  assert.equal(re.querySelector('a.post-newer').getAttribute('href'), '/2019/06/05/types-in-ember');
});

test('a title-only post renders no empty parts', () => {
  const m = page('2026/01/01/fixture-1.html', VARIANT);
  assert.equal(m.querySelector('img.post-banner'), null);
  assert.equal(m.querySelector('.post-dek'), null);
  assert.match(text(m.querySelector('.post-meta')), /^1 January 2026 · \d+ min read$/);
});

test('prose cannot widen the page', () => {
  assert.match(css(), /\.prose pre\{[^}]*overflow-x:auto/);
  assert.match(css(), /\.prose\{[^}]*overflow-wrap:(anywhere|break-word)/);
});

test('reading time counts words, not markup', () => {
  for (const d of [tw, ty, re]) {
    const words = d.querySelector('.prose').textContent.trim().split(/\s+/).length;
    assert.match(text(d.querySelector('.post-meta')), new RegExp(` · ${Math.ceil(words / 200)} min read$`));
  }
});
