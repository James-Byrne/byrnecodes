# byrnecodes.com refresh: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild byrnecodes.com in the approved "Hex, refined" design, on a toolchain that builds today.

**Architecture:** The site stays Jekyll, upgraded to 4.4. The Tailwind v4 CLI compiles `src/style.css` into `assets/css/style.css` before Jekyll copies it into `_site`. Home sections are driven by `_data/*.yml`. Shared chrome lives in includes rendered by `_layouts/default.html`, which `blog_post` extends. Tests use `node:test` with `linkedom` and assert against the built HTML in `_site`, plus a second "variant" build from `_fixtures/` for the inputs real content doesn't exercise.

**Tech Stack:** Jekyll 4.4, kramdown with GFM, rouge, jekyll-seo-tag, Tailwind CSS 4 (`@tailwindcss/cli`), Node `node:test` with linkedom, Netlify.

**Spec:** `docs/superpowers/specs/2026-11-15-site-refresh-design.md`. Its reference markup is in `docs/superpowers/specs/2026-11-15-site-refresh-mockups/*.dc.html`. Read the spec first: it holds every copy string, colour, size and the honeycomb geometry. This plan cites it rather than repeating it.

## Global Constraints
- **Versions:**
  - Ruby: the newest 3.4.x from `mise ls-remote ruby 3.4`, pinned in `.ruby-version`
  - Node 26, in `.nvmrc`
  - `jekyll ~> 4.4`
  - `tailwindcss` and `@tailwindcss/cli` `^4.3`
  - `linkedom ^0.18`, dev-only
  - No other npm dependencies.
- **Post URLs:** `/2018/07/18/ember-a-retrospective`, `/2019/06/05/types-in-ember` and `/2020/01/03/ember-and-tailwind` keep their paths. Output files stay at `<path>.html`.
- **What the site must not say:** never name the employer, its customers or its payment vendors. Never mention Stripe or AI-broker work.
- **JavaScript:** the site must read and navigate with JS off. JS only enhances the phone menu.
- **Colour:** the token hexes are exactly the spec's colour table.
- **Fonts:** Inter (400/500/600/700) and Ubuntu Mono (400/700) only.
- **Copy:** use the spec's strings verbatim.
- **Accessibility:** text contrast ≥ 4.5:1; a `:focus-visible` ring that is a 2px `accent` outline at a 2px offset; touch targets ≥ 44px.
- **Branch and commits:** work on `refresh/hex-refined`, never `master`. Every commit ends with the session's `Co-Authored-By` trailer.
- **Progress:** after each task, tick its items in the spec's Progress list (mapping in each task header).

## Review Focus
1. **A future post with only `title` set** (no description, backdrop or topics) renders no empty banner, no empty dek and no stray "·". Test: Task 6, fixture post 1.
2. **More than six posts:** the home list shows the six newest, newest first. Test: Task 5, variant build.
3. **The phone menu after use:** Escape closes it, and following a link closes it. With JS off the links are still there. Tests: Task 3; focus return is checked by hand in Task 8.
4. **A work item with a `url` and an `image`:** the whole card is one link with `rel="noopener"`, and the image has its alt. Without an image, the tile is `aria-hidden`. Test: Task 5, variant build.
5. **At 390px**, long code lines and URLs in a post never make the page scroll sideways; only the `pre` scrolls. Test: Task 6 CSS assertions, plus Task 8's `scrollWidth` check.

---

### Task 1: Toolchain, branch and test harness
Spec Progress: item 1.

**Files:**
- Create: `.ruby-version`, `mise.toml` (via `mise use`), `.nvmrc`, `netlify.toml`, `test/helpers.mjs`, `test/build.test.mjs`
- Modify: `Gemfile`, `package.json`, `.gitignore` (add `tmp`), `_config.yml`, `src/style.css`
- Regenerate: `Gemfile.lock`, `package-lock.json`
- Delete: `gulpfile.babel.js`, `.babelrc`, `tailwind.config.js`, `.all-contributorsrc`

**Interfaces:**
- Produces, from `test/helpers.mjs`:
  - `SITE = '_site'`
  - `VARIANT = 'tmp/variant'`
  - `page(path: string, root = SITE): Document` (linkedom, reads `${root}/${path}`)
  - `css(root = SITE): string` (`assets/css/style.css`, lowercased)
  - `exists(path: string, root = SITE): boolean`
  - `allHtml(root = SITE): string[]` (relative paths of every `.html` file)
- Produces npm scripts:
  - `css`: `tailwindcss -i src/style.css -o assets/css/style.css --minify`
  - `build`: `npm run css && bundle exec jekyll build`
  - `start`: `tailwindcss -i src/style.css -o assets/css/style.css --watch & bundle exec jekyll serve --livereload`
  - `test`: `npm run build && node --test test/`

- [ ] **Step 1: Branch and commit the approved docs**

```bash
git switch -c refresh/hex-refined
git add docs _config.yml
git commit -m "docs: add site refresh spec, plan and mockups"
```

- [ ] **Step 2: Write `test/helpers.mjs` and the failing `test/build.test.mjs`**

```js
test('css is built and includes utilities used inside posts', () => {
  assert.ok(exists('assets/css/style.css'));
  assert.match(css(), /\.my-6\{/);
  assert.match(css(), /\.justify-center\{/);
});
test('old post URLs keep their output paths', () => {
  for (const p of ['2018/07/18/ember-a-retrospective.html', '2019/06/05/types-in-ember.html', '2020/01/03/ember-and-tailwind.html'])
    assert.ok(exists(p), p);
});
test('build-only files are not published', () => {
  for (const p of ['docs', 'test', 'src', 'tmp', 'gulpfile.babel.js', 'package.json', 'netlify.toml', 'README.md', 'mise.toml'])
    assert.ok(!exists(p), p);
});
```

- [ ] **Step 3: Run it to see it fail**

Run: `node --test test/`
Expected: FAIL. linkedom isn't installed yet, or `_site` is missing.

- [ ] **Step 4: Replace the toolchain**
  - **Ruby:** `rm Gemfile.lock`. Write the newest 3.4.x to `.ruby-version`, then `mise use ruby@<that version>`.
  - **Gemfile:** `source "https://rubygems.org"`, `gem "jekyll", "~> 4.4"`, `gem "webrick"`, and `group :jekyll_plugins do gem "jekyll-seo-tag" end`. Then `bundle install`.
  - **package.json:** name `byrnecodes`, `"private": true`, the four scripts above, the three devDependencies, and nothing from the starter kit. Then `rm package-lock.json && npm install`.
  - **`.nvmrc`:** `26`.
  - **`netlify.toml`:** `[build] command = "npm run build"`, `publish = "_site"`; `[build.environment] NODE_VERSION = "26"`.
  - **`_config.yml`:**
    - add `permalink: /:year/:month/:day/:title`
    - set `exclude` to `docs, test, tmp, src, node_modules, Gemfile, Gemfile.lock, package.json, package-lock.json, README.md, LICENSE.md, netlify.toml, renovate.json, mise.toml`
  - **`src/style.css`:** keep only `@import "tailwindcss";` for now. Task 2 fills it in.
  - Delete the four starter files.

- [ ] **Step 5: Run the tests to see them pass**

Run: `npm test`
Expected: `# pass 3`, `# fail 0`.

If `bundle exec jekyll build` fails on a missing stdlib gem (e.g. `logger`, `csv`, `base64`), add that gem to the Gemfile, then record it in the spec's Decisions.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "build: Jekyll 4.4 + Tailwind v4 CLI, node:test harness"
```

---

### Task 2: Head, site config and design tokens
Spec Progress: items 2 and 3.

**Files:**
- Create: `_includes/head.html`, `test/head.test.mjs`
- Delete: `_includes/header.html`
- Modify: `_layouts/default.html`, `_config.yml`, `manifest.json`, `src/style.css`, and the front matter of the three `_posts/*.md`

**Interfaces:**
- Produces `site.*` keys:
  - `title`, `tagline`, `description`, `url`, `author`, `email`
  - `availability` (string, default `""`)
  - `social.github` (`james-byrne`), `social.linkedin` (`""`)
  - `plugins: [jekyll-seo-tag]`
  - `defaults: [{scope: {path: ""}, values: {image: /assets/img/james-headshot-lg.jpg}}]`. `jekyll-seo-tag` takes `og:image` from `page.image`, not `site.logo`; a post's own `image:` overrides this default.
- Produces Tailwind theme tokens, in `@theme static`:
  - colours: `--color-ink`, `--color-body`, `--color-muted`, `--color-line`, `--color-surface`, `--color-tile`, `--color-tile-strong`, `--color-accent`, `--color-accent-text`, `--color-accent-hover`, `--color-accent-tint`, `--color-ok`
  - fonts: `--font-sans: Inter, ui-sans-serif, system-ui, sans-serif`, `--font-mono: "Ubuntu Mono", ui-monospace, monospace`
  - Later tasks use the utilities these produce: `text-ink`, `bg-accent`, `font-mono`, and so on.
- Produces post front matter `image:`, equal to each post's `backdrop`. `jekyll-seo-tag` reads it.

- [ ] **Step 1: Write the failing `test/head.test.mjs`**

```js
const home = page('index.html');
const post = page('2020/01/03/ember-and-tailwind.html');
test('html declares English', () => assert.equal(home.documentElement.getAttribute('lang'), 'en'));
test('home title, description, canonical, image', () => {
  assert.equal(home.title, 'Byrnecodes | James Byrne — full-stack developer');
  assert.equal(home.querySelector('meta[name="description"]').getAttribute('content'),
    'James Byrne, full-stack developer: Ember & Rails web apps, iPhone & Apple Watch apps, and payment systems.');
  assert.equal(home.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://byrnecodes.com/');
  assert.equal(home.querySelector('meta[property="og:image"]').getAttribute('content'), 'https://byrnecodes.com/assets/img/james-headshot-lg.jpg');
});
test('post canonical is extensionless and image is its backdrop', () => {
  assert.equal(post.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://byrnecodes.com/2020/01/03/ember-and-tailwind');
  assert.match(post.querySelector('meta[property="og:image"]').getAttribute('content'), /\/assets\/img\/blog-posts\/ember-and-tailwind\/backdrop\.png$/);
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
  assert.ok(m.icons.every(i => i.src.startsWith('/assets/favicons/')));
});
test('tokens and focus ring are in the css', () => {
  assert.match(css(), /--color-accent:\s*#c8432d/);
  assert.match(css(), /--color-ink:\s*#1a202c/);
  assert.match(css(), /:focus-visible/);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test`
Expected: FAIL. `lang` is `""` and the title is "Byrnecodes | Ember & Elixir consulting".

- [ ] **Step 3: Implement**
  - **`head.html`:**
    - charset and viewport
    - `{% seo %}`
    - a preconnect to fonts.gstatic.com, then one `css2` fonts link with `display=swap`
    - the stylesheet
    - the existing favicon links and manifest
    - `theme-color #1A202C`
  - **`default.html`:** `<html class="no-js" lang="en">`, with the head include inside it.
  - **`_config.yml`:** the keys above; `tagline: James Byrne — full-stack developer`; the description as the spec gives it.
  - **Posts:** add `image:` to each one.
  - **`manifest.json`:** fix the name, `short_name` and icon paths.
  - **`src/style.css`:**
    - the `@theme static` block
    - base: `body` in `font-sans` and `text-ink` on white
    - the global `:focus-visible` rule

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seo head, fonts, design tokens"
```

---

### Task 3: Site chrome: header, phone menu, contact band, footer
Spec Progress: items 4 and 9.

**Files:**
- Create: `_includes/site-header.html`, `_includes/contact.html`, `assets/js/menu.js`, `test/chrome.test.mjs`, `test/menu.test.mjs`
- Delete: `_includes/navbar.html`
- Modify: `_includes/footer.html`, `_layouts/default.html`, `src/style.css`

**Interfaces:**
- Produces `default.html` body order: `site-header`, then `{{ content }}`, then `contact`, then `footer`, then `<script src="/assets/js/menu.js" defer>`. The footer moves inside `<body>`; today it sits after it.
- Produces this DOM contract, which `menu.js` and its tests rely on:
  - `header#site-header[data-menu="closed"]`
  - `button#menu-toggle[aria-controls="site-nav"][aria-expanded="false"][aria-label="Open menu"]`
  - `nav#site-nav`, holding the three links and the "Get in touch" button
- Produces the active-link rule: the header marks Writing `aria-current="page"` when `page.layout == 'blog_post'`.
- Produces the CSS rules:
  - below `md`, `.js #site-nav` is hidden unless `[data-menu="open"]`
  - `.no-js #menu-toggle` is hidden
  - at `md` and up, `#site-nav` is always visible and `#menu-toggle` is hidden

- [ ] **Step 1: Write the failing `test/chrome.test.mjs`**

```js
const home = page('index.html');
const post = page('2020/01/03/ember-and-tailwind.html');
test('nav links and CTA', () => {
  const links = [...home.querySelectorAll('#site-nav a')].map(a => [a.textContent.trim(), a.getAttribute('href')]);
  assert.deepEqual(links, [['Skills', '/#skills'], ['Work', '/#work'], ['Writing', '/#writing'], ['Get in touch', 'mailto:james@byrnecodes.com?Subject=Hi!']]);
});
test('logo links home', () => assert.ok(home.querySelector('a[href="/"] img[src="/assets/img/byrnecodes.svg"][alt="Byrnecodes home"]')));
test('menu button contract', () => {
  const b = home.getElementById('menu-toggle');
  assert.equal(b.getAttribute('aria-controls'), 'site-nav');
  assert.equal(b.getAttribute('aria-expanded'), 'false');
  assert.equal(b.getAttribute('aria-label'), 'Open menu');
  assert.equal(home.getElementById('site-header').dataset.menu, 'closed');
});
test('starts no-js and defers the menu script', () => {
  assert.ok(home.documentElement.classList.contains('no-js'));
  assert.ok(home.querySelector('script[src="/assets/js/menu.js"][defer]'));
});
test('writing is current only on posts', () => {
  assert.equal(post.querySelector('#site-nav a[href="/#writing"]').getAttribute('aria-current'), 'page');
  assert.equal(home.querySelector('#site-nav a[href="/#writing"]').getAttribute('aria-current'), null);
});
test('contact band and footer on every page', () => {
  for (const d of [home, post]) {
    assert.ok([...d.querySelectorAll('h2')].some(h => h.textContent.trim() === 'Need advice or have a cool idea?'));
    const f = d.querySelector('body > footer');
    assert.ok(f.textContent.includes(`© ${new Date().getFullYear()} Byrnecodes`));
    assert.ok(f.querySelector('a[href="https://github.com/james-byrne"]'));
    assert.equal(f.querySelector('a[href*="linkedin"]'), null);
  }
});
```

- [ ] **Step 2: Write the failing `test/menu.test.mjs`**

```js
function load() {
  const { document } = parseHTML(readFileSync('_site/index.html', 'utf8'));
  Function('document', readFileSync('assets/js/menu.js', 'utf8'))(document);
  return document;
}
const click = (d, el) => el.dispatchEvent(new d.defaultView.Event('click', { bubbles: true }));
test('swaps no-js for js', () => { const d = load(); assert.ok(d.documentElement.classList.contains('js')); assert.ok(!d.documentElement.classList.contains('no-js')); });
test('toggle opens and closes', () => {
  const d = load(); const b = d.getElementById('menu-toggle');
  click(d, b);
  assert.equal(b.getAttribute('aria-expanded'), 'true'); assert.equal(b.getAttribute('aria-label'), 'Close menu');
  assert.equal(d.getElementById('site-header').dataset.menu, 'open');
  click(d, b);
  assert.equal(b.getAttribute('aria-expanded'), 'false'); assert.equal(d.getElementById('site-header').dataset.menu, 'closed');
});
test('Escape closes', () => {
  const d = load(); const b = d.getElementById('menu-toggle'); click(d, b);
  const e = new d.defaultView.Event('keydown', { bubbles: true }); Object.defineProperty(e, 'key', { value: 'Escape' });
  d.dispatchEvent(e);
  assert.equal(b.getAttribute('aria-expanded'), 'false');
});
test('following a nav link closes', () => {
  const d = load(); click(d, d.getElementById('menu-toggle'));
  click(d, d.querySelector('#site-nav a[href="/#work"]'));
  assert.equal(d.getElementById('site-header').dataset.menu, 'closed');
});
```

- [ ] **Step 3: Run them to see them fail**

Run: `npm test`
Expected: FAIL. There's no `#site-nav` and no `menu.js`.

- [ ] **Step 4: Implement the includes, the layout, the CSS rules above, and `menu.js`**
  - **`menu.js`:** plain script that uses only `document`. It swaps the class, toggles `data-menu`, `aria-expanded` and `aria-label`, closes on Escape (and calls `toggle.focus?.()`; linkedom has no `focus`), and closes on a click on any `#site-nav a`.
  - **Visual values:** spec "Header and nav" and "Contact band and footer", plus `PhoneMenu.dc.html`.

- [ ] **Step 5: Run the tests to see them pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: site header with phone menu, contact band, footer"
```

---

### Task 4: Home hero and honeycomb, plus the variant build
Spec Progress: item 5.

**Files:**
- Create: `_includes/honeycomb.html`, `_fixtures/variant.yml`, `_fixtures/_data/skills.yml`, `_fixtures/_data/work.yml`, `test/home.test.mjs`
- Modify: `index.html` (replace the hero), `src/style.css` (`.honeycomb`, `.hex`, positions), `package.json`

**Interfaces:**
- Produces `_fixtures/variant.yml`:

```yaml
availability: "Taking on new work from January"
data_dir: _fixtures/_data
collections_dir: _fixtures
```

- Produces the npm script `build:variant`: `bundle exec jekyll build --config _config.yml,_fixtures/variant.yml --destination tmp/variant`. `test` becomes `npm run build && npm run build:variant && node --test test/`.
- Produces fixture data, used in Task 5:
  - `_fixtures/_data/skills.yml`: one entry
  - `_fixtures/_data/work.yml`: one entry with `title: Example`, `url: https://example.com/`, `image: /assets/img/james-headshot.jpg`, `image_alt: Example screenshot`
- Produces markup:
  - the hero is `section#top`; its primary CTA is `a.btn-primary`, the same class the nav's "Get in touch" uses
  - `[data-availability]`, rendered only when `site.availability != ""`
  - `.honeycomb[aria-hidden="true"]`, with seven children in the order Swift, Ember, TypeScript, photo, Rails, Agents, Payments
  - positions and fills from the spec's honeycomb table

- [ ] **Step 1: Write the failing hero tests in `test/home.test.mjs`**

```js
const home = page('index.html');
test('hero copy and CTAs', () => {
  assert.equal(home.querySelector('h1').textContent.trim(), 'Web apps, iPhone apps, and the payments that keep them earning.');
  assert.equal(home.querySelectorAll('h1').length, 1);
  assert.ok([...home.querySelectorAll('p')].some(p => p.textContent.trim() === 'James Byrne :: Byrnecodes'));
  assert.equal(home.querySelector('section#top a.btn-primary[href="mailto:james@byrnecodes.com?Subject=Hi!"]').textContent.trim(), 'Start a project');
  assert.equal(home.querySelector('section#top a[href="#work"]').textContent.trim(), 'See the work');
});
test('availability hidden when empty, shown when set', () => {
  assert.equal(home.querySelector('[data-availability]'), null);
  assert.equal(page('index.html', VARIANT).querySelector('[data-availability]').textContent.trim(), 'Taking on new work from January');
});
test('honeycomb is decorative with the photo in the centre', () => {
  const h = home.querySelector('.honeycomb');
  assert.equal(h.getAttribute('aria-hidden'), 'true');
  assert.deepEqual([...h.children].map(c => c.tagName === 'IMG' ? 'photo' : c.textContent.trim()),
    ['Swift', 'Ember', 'TypeScript', 'photo', 'Rails', 'Agents', 'Payments']);
  const img = h.querySelector('img');
  assert.equal(img.getAttribute('src'), '/assets/img/james-headshot.jpg');
  assert.equal(img.getAttribute('alt'), '');
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npm test`
Expected: FAIL. The h1 still holds the old copy, and `build:variant` doesn't exist yet. Add the script and the fixtures first if the failure is "missing script".

- [ ] **Step 3: Implement the hero, the honeycomb and their CSS**

All copy, sizes and positions come from the spec's "Hero" and "Honeycomb" sections.

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: home hero and honeycomb; variant build fixtures"
```

---

### Task 5: Skills, work and writing sections
Spec Progress: items 6, 7 and 8.

**Files:**
- Create: `_data/skills.yml`, `_data/work.yml`, `_includes/work-card.html`, `_fixtures/_posts/2026-01-0N-fixture-N.md` for N = 1…7
- Modify: `index.html`, `src/style.css`, `test/home.test.mjs`

**Interfaces:**
- Consumes the fixture data and `VARIANT` from Task 4.
- Produces the data schemas:
  - `skills.yml`: `[{title, stack, body}]`, the spec's four rows in order
  - `work.yml`: `[{title, meta, body, tile, image?, image_alt?, url?}]`, where `tile` is one of `ink`, `tile` or `accent-tint`; the spec's three rows
  - The "Also" line is literal markup in `index.html`.
- Produces markup:
  - `section#skills`, `section#work` and `section#writing`, with h2s "What I do", "Selected work" and "Thoughts on things"
  - `.skill-card`, containing `h3` and `p.stack`
  - `.work-card`, containing `.work-media` (an `img`, or the `aria-hidden` name tile), `h3` and the meta line. A work card is an `<a>` when `url` is set, otherwise an `<article>`.
  - `.writing-list a`, each containing `.date` and `h3`, with the class `is-newest` on the first
- Produces the fixture posts:
  - Fixture 1 has front matter `title` only, plus a 300-word body with one fenced code line over 200 characters and one bare URL over 120 characters.
  - Fixtures 2–7 each have `title: Fixture N` and a one-line body.
  - Task 6 also uses fixture 1.

- [ ] **Step 1: Add the failing section tests to `test/home.test.mjs`**

```js
test('skills: four cards in order, then the also line', () => {
  assert.deepEqual([...home.querySelectorAll('#skills .skill-card h3')].map(h => h.textContent.trim()),
    ['Ambitious web apps', 'iPhone & Apple Watch', 'Payment systems', 'AI-assisted delivery']);
  assert.equal(home.querySelector('#skills .skill-card p.stack').textContent.trim(), 'Ember · TypeScript · Rails');
  assert.ok(home.querySelector('#skills').textContent.includes('Elixir & Phoenix (client sites I’ve maintained since 2021) · fast static sites for small businesses'));
});
test('work: three cards, ticketing has a decorative name tile, none link', () => {
  const cards = [...home.querySelectorAll('#work .work-card')];
  assert.deepEqual(cards.map(c => c.querySelector('h3').textContent.trim()), ['Bogha', 'Ticketing platform', 'Perry Oil']);
  const t = cards[1];
  assert.equal(t.querySelector('img'), null);
  assert.equal(t.querySelector('.work-media').getAttribute('aria-hidden'), 'true');
  assert.ok(cards.every(c => c.tagName === 'ARTICLE'));
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
  assert.deepEqual(links.map(a => a.getAttribute('href')), ['/2020/01/03/ember-and-tailwind', '/2019/06/05/types-in-ember', '/2018/07/18/ember-a-retrospective']);
  assert.deepEqual(links.map(a => a.querySelector('.date').textContent.trim()), ['Jan 2020', 'Jun 2019', 'Jul 2018']);
  assert.ok(links[0].classList.contains('is-newest'));
});
test('writing caps at six newest', () => {
  const titles = [...page('index.html', VARIANT).querySelectorAll('.writing-list a h3')].map(h => h.textContent.trim());
  assert.deepEqual(titles, ['Fixture 7', 'Fixture 6', 'Fixture 5', 'Fixture 4', 'Fixture 3', 'Fixture 2']);
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npm test`
Expected: FAIL. `#skills` doesn't exist yet.

- [ ] **Step 3: Implement the data files, `work-card.html`, the three sections and their CSS**

Values come from the spec's "Skills", "Selected work" and "Writing" sections. The old services, the post-card grid and the Formspree form are removed from `index.html` here.

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: skills, selected work and writing sections"
```

---

### Task 6: Post layout, prose, syntax theme and post content
Spec Progress: items 10 and 11.

**Files:**
- Create: `test/post.test.mjs`
- Modify:
  - `_layouts/blog_post.html` (rewrite with `layout: default`, so it inherits the chrome)
  - `src/style.css` (`.prose`, `blockquote.pull`, rouge tokens; delete the GitHub-markdown and both Pygments blocks)
  - `_posts/*.md`

**Interfaces:**
- Consumes `default.html` (Task 3) and fixture post 1 (Task 5).
- Produces markup:
  - `.post-meta`, `h1`, `.post-dek` (only when `page.description` is set)
  - `img.post-banner` (only when `page.backdrop` is set; the class `is-contained` when `smallBackdropImage == "true"`)
  - `.prose`
  - `aside[aria-label="About the author"]`
  - `a.post-older` and `a.post-newer`, each only when its post exists
- Produces the reading time: `content | number_of_words`, divided by 200.0, then `ceil`.

- [ ] **Step 1: Write the failing `test/post.test.mjs`**

```js
const tw = page('2020/01/03/ember-and-tailwind.html');
const ty = page('2019/06/05/types-in-ember.html');
const re = page('2018/07/18/ember-a-retrospective.html');
test('title block', () => {
  assert.equal(tw.querySelectorAll('h1').length, 1);
  assert.equal(tw.querySelector('h1').textContent.trim(), 'Ember and tailwindcss');
  assert.equal(tw.querySelector('.post-dek').textContent.trim(), 'Have you heard how awesome tailwindcss and ember are together!?');
  assert.match(tw.querySelector('.post-meta').textContent.replace(/\s+/g, ' ').trim(), /^3 January 2020 · Ember · CSS · \d+ min read$/);
  assert.equal(tw.querySelector('a[href="/#writing"]').textContent.trim(), '← All writing');
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
  for (const d of [tw, ty, re]) for (const img of d.querySelectorAll('.prose img')) assert.ok(img.getAttribute('alt'), img.getAttribute('src'));
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
  assert.match(m.querySelector('.post-meta').textContent.replace(/\s+/g, ' ').trim(), /^1 January 2026 · \d+ min read$/);
});
test('prose cannot widen the page', () => {
  assert.match(css(), /\.prose pre\{[^}]*overflow-x:auto/);
  assert.match(css(), /\.prose\{[^}]*overflow-wrap:(anywhere|break-word)/);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test`
Expected: FAIL. There's no `.post-meta`, the posts still have body h1s, and the images have no alt.

- [ ] **Step 3: Implement the layout, `.prose`, `blockquote.pull` and the rouge token CSS**

Values come from the spec's "Post layout", "Prose" and "Syntax theme" sections. Lightning CSS may merge selectors; keep `.prose pre` and `.prose` as their own rules so the last test's patterns hold.

- [ ] **Step 4: Apply the post content changes from the spec's "Content changes"**
  - delete the H1s; promote the tailwind post's headings
  - trim " ..." from the descriptions
  - add `topics`
  - add `{: .pull}` after the one pull quote
  - add `alt` to the six images, looking at each image
  - Leave the "it's" typos unless James has said yes in the spec's Decisions.

- [ ] **Step 5: Run the tests to see them pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: post layout, prose and syntax theme; normalise posts"
```

---

### Task 7: 404, cleanup and README
Spec Progress: items 12 and 13.

**Files:**
- Create: `404.html`, `test/cleanup.test.mjs`
- Delete: `assets/img/ember-logo.svg`, `assets/img/elixir-logo.svg`, `assets/img/stripe-logo.svg`, `assets/img/b-hex.svg`
- Modify: `README.md` (rewrite)

**Interfaces:**
- Consumes `allHtml()` from Task 1.

- [ ] **Step 1: Write the failing `test/cleanup.test.mjs`**

```js
test('404 page', () => {
  const d = page('404.html');
  assert.equal(d.querySelector('h1').textContent.trim(), 'Page not found');
  assert.ok(d.querySelector('main a[href="/"]'));
});
test('old service assets are gone', () => {
  for (const f of ['ember-logo.svg', 'elixir-logo.svg', 'stripe-logo.svg', 'b-hex.svg']) assert.ok(!exists(`assets/img/${f}`), f);
});
test('no stale positioning or newsletter anywhere', () => {
  for (const p of allHtml()) {
    const html = readFileSync(`_site/${p}`, 'utf8');
    assert.ok(!/formspree/i.test(html), p);
    assert.ok(!/Elixir consulting|Ember &(amp;)? Elixir/.test(html), p);
    assert.ok(!/stripe/i.test(html), p);
  }
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test`
Expected: FAIL. `404.html` is missing and the logo SVGs are still published.

- [ ] **Step 3: Implement**
  - **`404.html`:** `layout: default`, the spec's copy, inside a `<main>`.
  - Delete the four SVGs.
  - **`README.md`:** what the site is; requirements (`.ruby-version`, `.nvmrc`, mise); `bundle install && npm ci`; `npm start`, `npm test` and `npm run build`; it deploys to Netlify on push to `master`. Keep the MIT credit to the starter in one line.

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: 404 page, remove old assets, rewrite README"
```

---

### Task 8: Verification and deploy preview
Spec Progress: items 14 and 15. Manual: there's no new code unless a check fails. A failure gets a failing test where one is possible, then a fix, in its own commit.

- [ ] **Step 1: Run the full suite from a clean tree**

Run: `git clean -xdf _site tmp assets/css && npm test`
Expected: `# fail 0`.

- [ ] **Step 2: Serve the site and compare it with the artboards**

Run `npm start`, then compare at 1280×900 and 390×844:
- home → `Main.dc.html` / `Phone.dc.html`
- the menu open → `PhoneMenu.dc.html`
- the tailwind post → `Post.dc.html`

The logo is the SVG; that difference is expected.

- [ ] **Step 3: Check for sideways scrolling at 390px**

On `/`, `/404` and each of the three posts, run `document.documentElement.scrollWidth <= innerWidth` in the console.
Expected: `true` on every page.

- [ ] **Step 4: Keyboard and JS-off checks**
  - Tab through each page: every link and button is reachable, in order, with the focus ring visible.
  - The menu opens and closes with Enter and Space. Escape closes it and focus lands on the button.
  - With JS disabled in DevTools, the nav links show and work at 390px.

- [ ] **Step 5: Lighthouse on `/` and the tailwind post**

Expected: accessibility ≥ 95, SEO ≥ 95, no console errors.

- [ ] **Step 6: Deploy preview**
  - Push the branch and open a PR to `master`.
  - James confirms the Netlify settings in the spec's content checklist and opens the deploy preview on a real phone.
  - The three old post URLs return 200 on the preview.
  - Tick spec items 14 and 15.
