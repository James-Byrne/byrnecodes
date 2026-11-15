import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseHTML } from 'linkedom';

export const SITE = '_site';
export const VARIANT = 'tmp/variant';

export const page = (path, root = SITE) => parseHTML(readFileSync(join(root, path), 'utf8')).document;

export const css = (root = SITE) => readFileSync(join(root, 'assets/css/style.css'), 'utf8').toLowerCase();

export const exists = (path, root = SITE) => existsSync(join(root, path));

export const allHtml = (root = SITE) =>
  readdirSync(root, { recursive: true })
    .filter((p) => p.endsWith('.html'))
    .map((p) => relative(root, join(root, p)));
