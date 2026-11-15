import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { css, page } from './helpers.mjs';

const home = page('index.html');
const post = page('2020/01/03/ember-and-tailwind.html');

test('html declares English', () => assert.equal(home.documentElement.getAttribute('lang'), 'en'));

test('home title, description, canonical, image', () => {
  assert.equal(home.title, 'Byrnecodes | James Byrne — full-stack developer');
  assert.equal(
    home.querySelector('meta[name="description"]').getAttribute('content'),
    'James Byrne, full-stack developer: Ember & Rails web apps, iPhone & Apple Watch apps, and payment systems.',
  );
  assert.equal(home.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://byrnecodes.com/');
  assert.equal(
    home.querySelector('meta[property="og:image"]').getAttribute('content'),
    'https://byrnecodes.com/assets/img/james-headshot-lg.jpg',
  );
});

test('post canonical is extensionless and image is its backdrop', () => {
  assert.equal(
    post.querySelector('link[rel="canonical"]').getAttribute('href'),
    'https://byrnecodes.com/2020/01/03/ember-and-tailwind',
  );
  assert.match(
    post.querySelector('meta[property="og:image"]').getAttribute('content'),
    /\/assets\/img\/blog-posts\/ember-and-tailwind\/backdrop\.png$/,
  );
});

test('fonts are Inter and Ubuntu Mono only', () => {
  const href = home.querySelector('link[href*="fonts.googleapis.com/css2"]').getAttribute('href');
  assert.ok(href.includes('family=Inter:wght@400;500;600;700'));
  assert.ok(href.includes('family=Ubuntu+Mono:wght@400;700'));
  assert.ok(!href.includes('Roboto'));
});

test('manifest is named and points at real icons', () => {
  const m = JSON.parse(readFileSync('_site/manifest.json', 'utf8'));
  assert.equal(m.name, 'Byrnecodes');
  assert.ok(m.icons.every((i) => i.src.startsWith('/assets/favicons/')));
});

test('tokens and focus ring are in the css', () => {
  assert.match(css(), /--color-accent:\s*#c8432d/);
  assert.match(css(), /--color-ink:\s*#1a202c/);
  assert.match(css(), /:focus-visible/);
});
