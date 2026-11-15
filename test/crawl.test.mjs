import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { exists, page } from './helpers.mjs';

const read = (path) => readFileSync(`_site/${path}`, 'utf8');
const posts = [
  'https://byrnecodes.com/2018/07/18/ember-a-retrospective',
  'https://byrnecodes.com/2019/06/05/types-in-ember',
  'https://byrnecodes.com/2020/01/03/ember-and-tailwind',
];

test('robots.txt allows crawling and points at the sitemap', () => {
  const robots = read('robots.txt');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Sitemap: https:\/\/byrnecodes\.com\/sitemap\.xml$/m);
  assert.ok(!robots.includes('<html'));
});

test('sitemap lists the home page and every post, and not the 404 page', () => {
  const sitemap = read('sitemap.xml');
  assert.ok(sitemap.includes('<loc>https://byrnecodes.com/</loc>'));
  for (const url of posts) assert.ok(sitemap.includes(`<loc>${url}</loc>`), url);
  assert.ok(!sitemap.includes('404'));
});

test('an Atom feed lists every post and is linked from the head', () => {
  const feed = read('feed.xml');
  for (const url of posts) assert.ok(feed.includes(url), url);
  assert.ok(page('index.html').querySelector('link[rel="alternate"][type="application/atom+xml"][href="https://byrnecodes.com/feed.xml"]'));
});

test('favicon.ico is served from the site root', () => assert.ok(exists('favicon.ico')));
