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

test('skills: four cards in order, then the also line', () => {
  assert.deepEqual(
    [...home.querySelectorAll('#skills .skill-card h3')].map((h) => h.textContent.trim()),
    ['Ambitious web apps', 'iPhone & Apple Watch', 'Payment systems', 'AI-assisted delivery'],
  );
  assert.equal(home.querySelector('#skills .skill-card p.stack').textContent.trim(), 'Ember · TypeScript · Rails');
  assert.ok(
    home
      .querySelector('#skills')
      .textContent.replace(/\s+/g, ' ')
      .includes('Elixir & Phoenix (client sites I’ve maintained since 2021) · fast static sites for small businesses'),
  );
});

test('section headings', () => {
  assert.deepEqual(
    ['skills', 'work', 'writing'].map((id) => home.querySelector(`section#${id} h2`).textContent.trim()),
    ['What I do', 'Selected work', 'Thoughts on things'],
  );
});

test('work: three cards, ticketing has a decorative name tile, none link', () => {
  const cards = [...home.querySelectorAll('#work .work-card')];
  assert.deepEqual(
    cards.map((c) => c.querySelector('h3').textContent.trim()),
    ['Bogha', 'Ticketing platform', 'Perry Oil'],
  );
  const t = cards[1];
  assert.equal(t.querySelector('img'), null);
  assert.equal(t.querySelector('.work-media').getAttribute('aria-hidden'), 'true');
  assert.ok(cards.every((c) => c.tagName === 'ARTICLE'));
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
    ['/2020/01/03/ember-and-tailwind', '/2019/06/05/types-in-ember', '/2018/07/18/ember-a-retrospective'],
  );
  assert.deepEqual(
    links.map((a) => a.querySelector('.date').textContent.trim()),
    ['Jan 2020', 'Jun 2019', 'Jul 2018'],
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
