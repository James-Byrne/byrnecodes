import { test } from 'node:test';
import assert from 'node:assert/strict';
import { css, exists } from './helpers.mjs';

test('css is built and includes utilities used inside posts', () => {
  assert.ok(exists('assets/css/style.css'));
  assert.match(css(), /\.my-6\{/);
  assert.match(css(), /\.justify-center\{/);
});

test('old post URLs keep their output paths', () => {
  for (const p of [
    '2018/07/18/ember-a-retrospective.html',
    '2019/06/05/types-in-ember.html',
    '2020/01/03/ember-and-tailwind.html',
  ])
    assert.ok(exists(p), p);
});

test('build-only files are not published', () => {
  for (const p of ['docs', 'test', 'src', 'tmp', 'scripts', '_fixtures', '2026', 'gulpfile.babel.js', 'package.json', 'netlify.toml', 'README.md', 'mise.toml'])
    assert.ok(!exists(p), p);
});
