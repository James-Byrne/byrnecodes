import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { page } from './helpers.mjs';

// The first pixel of the first scanline decodes to its raw bytes under every PNG filter type.
function cornerAlpha(path) {
  const png = readFileSync(path);
  const colorType = png[25];
  const idat = [];
  for (let at = 8; at < png.length; ) {
    const length = png.readUInt32BE(at);
    const type = png.toString('ascii', at + 4, at + 8);
    if (type === 'IDAT') idat.push(png.subarray(at + 8, at + 8 + length));
    at += 12 + length;
  }
  const pixels = inflateSync(Buffer.concat(idat));
  const alphaOffset = { 4: 2, 6: 4 }[colorType];
  return { colorType, alpha: alphaOffset ? pixels[alphaOffset] : 255 };
}

const transparent = [
  'favicon-16x16.png', 'favicon-32x32.png', 'favicon-96x96.png',
  'android-icon-36x36.png', 'android-icon-48x48.png', 'android-icon-72x72.png',
  'android-icon-96x96.png', 'android-icon-144x144.png', 'android-icon-192x192.png',
];

test('tab favicons have a transparent background', () => {
  for (const f of transparent) {
    const { colorType, alpha } = cornerAlpha(`_site/assets/favicons/${f}`);
    assert.ok([4, 6].includes(colorType), `${f} has no alpha channel`);
    assert.equal(alpha, 0, `${f} corner is not transparent`);
  }
});

test('an SVG favicon is linked and adapts to dark mode', () => {
  const link = page('index.html').querySelector('link[rel="icon"][type="image/svg+xml"]');
  assert.equal(link.getAttribute('href'), '/assets/favicons/favicon.svg');
  const svg = readFileSync('_site/assets/favicons/favicon.svg', 'utf8');
  assert.match(svg, /prefers-color-scheme:\s*dark/);
});
