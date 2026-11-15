import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { css, page } from './helpers.mjs';

const home = page('index.html');
const post = page('2020/01/03/ember-and-tailwind.html');

test('html declares English', () => assert.equal(home.documentElement.getAttribute('lang'), 'en'));

const HOME_TITLE = 'James Byrne — freelance Ember, Rails and iOS developer';
const HOME_DESCRIPTION =
  'James Byrne is a freelance full-stack developer in Ireland: Ember and Rails web apps, iPhone and Apple Watch apps, and payment systems.';
const jsonLd = (d) => [...d.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);

test('home title, description, canonical, image', () => {
  assert.equal(home.title, `${HOME_TITLE} | Byrnecodes`);
  assert.equal(home.querySelector('meta[property="og:title"]').getAttribute('content'), HOME_TITLE);
  assert.equal(home.querySelector('meta[name="description"]').getAttribute('content'), HOME_DESCRIPTION);
  assert.equal(home.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://byrnecodes.com/');
});

const pngSize = (path) => {
  const png = readFileSync(path);
  return [png.readUInt32BE(16), png.readUInt32BE(20)];
};

test('every page shares a 1200×630 card of its own', () => {
  const cards = {
    'index.html': 'home',
    '2018/07/18/ember-a-retrospective.html': 'ember-a-retrospective',
    '2019/06/05/types-in-ember.html': 'types-in-ember',
    '2020/01/03/ember-and-tailwind.html': 'ember-and-tailwind',
  };
  for (const [path, card] of Object.entries(cards)) {
    const d = page(path);
    const url = `https://byrnecodes.com/assets/img/social/${card}.png`;
    assert.equal(d.querySelector('meta[property="og:image"]').getAttribute('content'), url, path);
    assert.equal(d.querySelector('meta[name="twitter:image"]').getAttribute('content'), url, path);
    assert.deepEqual(pngSize(`_site/assets/img/social/${card}.png`), [1200, 630], card);
  }
});

test('locale is Irish English', () => {
  assert.equal(home.querySelector('meta[property="og:locale"]').getAttribute('content'), 'en_IE');
});

test('structured data is never double-escaped', () => {
  for (const d of [home, post])
    for (const json of jsonLd(d)) assert.ok(!/&amp;|\\u0026amp;/.test(json), json.slice(0, 120));
});

test('home structured data describes James and the business, in Ireland', () => {
  const graph = jsonLd(home).map((j) => JSON.parse(j)).flatMap((j) => j['@graph'] ?? [j]);
  const person = graph.find((n) => n['@type'] === 'Person');
  assert.equal(person.name, 'James Byrne');
  assert.equal(person.url, 'https://byrnecodes.com/');
  assert.equal(person.address.addressCountry, 'IE');
  assert.deepEqual(person.sameAs, ['https://github.com/james-byrne', 'https://www.linkedin.com/in/jamesdesbyrne/']);
  for (const topic of ['Ember.js', 'Ruby on Rails', 'Swift', 'iOS']) assert.ok(person.knowsAbout.includes(topic), topic);
  const business = graph.find((n) => n['@type'] === 'ProfessionalService');
  assert.equal(business.name, 'Byrnecodes');
  assert.equal(business.areaServed.name, 'Ireland');
});

test('the hero says where James is based', () => {
  assert.ok(home.querySelector('section#top').textContent.includes('freelance full-stack developer based in Ireland'));
});

test('post canonical is extensionless', () => {
  assert.equal(
    post.querySelector('link[rel="canonical"]').getAttribute('href'),
    'https://byrnecodes.com/2020/01/03/ember-and-tailwind',
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
