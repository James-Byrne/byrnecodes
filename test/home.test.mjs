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

test('skills: four cards in order', () => {
  assert.deepEqual(
    [...home.querySelectorAll('#skills .skill-card h3')].map((h) => h.textContent.trim()),
    ['Ambitious web apps', 'iPhone & Watch', 'Payment systems', 'AI-assisted delivery'],
  );
  assert.equal(home.querySelector('#skills .skill-card p.stack').textContent.trim(), 'Ember · TypeScript · Rails · Postgres');
});

test('skills: an Also tier lists secondary work with a line and stack each', () => {
  const also = home.querySelector('#skills .also');
  assert.equal(also.querySelector('h3.also-label').textContent.trim(), 'Also');
  const items = [...also.querySelectorAll('.also-item')];
  assert.deepEqual(
    items.map((i) => i.querySelector('h4').textContent.trim()),
    ['Elixir & Phoenix', 'Small-business websites'],
  );
  for (const i of items) {
    assert.ok(i.querySelector('p.also-body').textContent.trim().length > 20);
    assert.ok(i.querySelector('p.stack').textContent.includes('·'));
  }
  assert.ok(!home.querySelector('#skills').textContent.includes('Also:'));
});

test('section headings', () => {
  assert.deepEqual(
    ['skills', 'work', 'writing'].map((id) => home.querySelector(`section#${id} h2`).textContent.trim()),
    ['What I do', 'Selected work', 'Thoughts on things'],
  );
});

test('work: three cards in order, none link', () => {
  const cards = [...home.querySelectorAll('#work .work-card')];
  assert.deepEqual(
    cards.map((c) => c.querySelector('h3').textContent.trim()),
    ['Bogha', 'Ticketing platform', 'Perry Oil'],
  );
  assert.ok(cards.every((c) => c.tagName === 'ARTICLE'));
});

test('a work item without an image shows a decorative name tile', () => {
  const tile = [...page('index.html', VARIANT).querySelectorAll('#work .work-card')]
    .find((c) => c.querySelector('h3').textContent.trim() === 'Tile only');
  assert.equal(tile.querySelector('img'), null);
  assert.equal(tile.querySelector('.work-media').getAttribute('aria-hidden'), 'true');
});

test('the ticketing card shows an illustrative box-office image', () => {
  const img = home.querySelectorAll('#work .work-card')[1].querySelector('img.work-media');
  assert.equal(img.getAttribute('src'), '/assets/img/work/ticketing.jpg');
  assert.match(img.getAttribute('alt'), /^Illustrative box-office screen/);
});

test('work card with url and image is one link', () => {
  const c = page('index.html', VARIANT).querySelector('#work .work-card');
  assert.equal(c.tagName, 'A');
  assert.equal(c.getAttribute('href'), 'https://example.com/');
  assert.match(c.getAttribute('rel'), /noopener/);
  assert.equal(c.querySelector('img').getAttribute('alt'), 'Example screenshot');
});

test('writing lists real posts newest first with month dates', () => {
  const links = [...home.querySelectorAll('.writing-list a')];
  assert.deepEqual(
    links.map((a) => a.getAttribute('href')),
    ['/2026/11/16/test-first-delivery-with-ai-agents', '/2020/01/03/ember-and-tailwind', '/2019/06/05/types-in-ember', '/2018/07/18/ember-a-retrospective'],
  );
  assert.deepEqual(
    links.map((a) => a.querySelector('.date').textContent.trim()),
    ['Nov 2026', 'Jan 2020', 'Jun 2019', 'Jul 2018'],
  );
  assert.ok(links[0].classList.contains('is-newest'));
});

test('writing caps at six newest', () => {
  const titles = [...page('index.html', VARIANT).querySelectorAll('.writing-list a h3')].map((h) => h.textContent.trim());
  assert.deepEqual(titles, ['Fixture 7', 'Fixture 6', 'Fixture 5', 'Fixture 4', 'Fixture 3', 'Fixture 2']);
});

test('old services, post cards and newsletter are gone', () => {
  const html = home.documentElement.outerHTML;
  assert.ok(!/formspree/i.test(html));
  assert.ok(!html.includes('Elixir Development'));
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

test('a work image without image_alt falls back to the title', () => {
  const imgs = [...page('index.html', VARIANT).querySelectorAll('#work .work-card img')];
  assert.equal(imgs.length, 2);
  assert.equal(imgs[1].getAttribute('alt'), 'No alt given');
});

test('Bogha and Perry Oil cards show their screenshots with alt text', () => {
  const cards = [...home.querySelectorAll('#work .work-card')];
  for (const [i, src] of [[0, '/assets/img/work/bogha.jpg'], [2, '/assets/img/work/perry-oil.jpg']]) {
    const img = cards[i].querySelector('img.work-media');
    assert.equal(img.getAttribute('src'), src);
    assert.ok(img.getAttribute('alt').length > 10, cards[i].querySelector('h3').textContent);
  }
});

test('home images declare their size so the page does not shift', () => {
  for (const img of home.querySelectorAll('main img')) {
    assert.match(img.getAttribute('width') ?? '', /^\d+$/, img.getAttribute('src'));
    assert.match(img.getAttribute('height') ?? '', /^\d+$/, img.getAttribute('src'));
  }
});
