import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allHtml, exists, page } from './helpers.mjs';

test('404 page', () => {
  const d = page('404.html');
  assert.equal(d.querySelector('h1').textContent.trim(), 'Page not found');
  assert.ok(d.querySelector('main a[href="/"]'));
});

test('old service assets are gone', () => {
  for (const f of ['ember-logo.svg', 'elixir-logo.svg', 'stripe-logo.svg', 'b-hex.svg'])
    assert.ok(!exists(`assets/img/${f}`), f);
});

test('no stale positioning or newsletter anywhere', () => {
  for (const p of allHtml()) {
    const html = readFileSync(`_site/${p}`, 'utf8');
    assert.ok(!/formspree/i.test(html), p);
    assert.ok(!/Elixir consulting|Ember &(amp;)? Elixir/.test(html), p);
    assert.ok(!/stripe/i.test(html), p);
  }
});
