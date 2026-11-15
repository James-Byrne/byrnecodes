# byrnecodes.com refresh: "Hex, refined"

Date: 2026-11-15 · Approved by James 2026-11-15, including approach 1 for the toolchain
Design canvas: https://claude.ai/artifact/YYN7bS8uBqF1vo6p24xw8g (private to James). Its artboard sources are copied beside this file in `2026-11-15-site-refresh-mockups/`. Exact colours, sizes and copy can be read from them. They are reference markup, not production code: `/_blob/…` image URLs and `support.js` only resolve on the canvas.

| Artboard | File | Covers |
|---|---|---|
| Home, desktop | `Main.dc.html` | Every home section at 1280px |
| Home, phone | `Phone.dc.html` | The same page at 390px |
| Phone menu open | `PhoneMenu.dc.html` | The open nav state below `md` |
| Blog post | `Post.dc.html` | The post layout and prose styles |

## Progress

Tick each item as it lands; an interruption should lose nothing.

### Build
- [x] 0. Add `docs` to `_config.yml` `exclude`, so this spec and the mockups are never published
- [x] 1. Toolchain: Jekyll 4.4 and the Tailwind v4 CLI; remove gulp, babel and purgecss; add `netlify.toml`, `.ruby-version` and `.nvmrc`; `npm run build` passes from a clean clone
- [x] 2. Design tokens, fonts and base styles in `src/style.css`
- [x] 3. `<head>`: `jekyll-seo-tag`, `lang="en"`, manifest fix, favicons kept
- [x] 4. Header and nav, including the phone menu with a no-JS fallback
- [x] 5. Home: hero and honeycomb
- [x] 6. Home: skills, from `_data/skills.yml`
- [x] 7. Home: selected work, from `_data/work.yml`
- [x] 8. Home: writing list
- [x] 9. Contact band and footer, as shared includes
- [x] 10. Post layout, prose styles and the dark syntax theme
- [x] 11. Post front matter and heading normalisation (see Content changes)
- [x] 12. `404.html`
- [x] 13. Remove dead assets, the newsletter form and starter-kit files; rewrite the README
- [ ] 14. Verification pass (see Verification)
- [ ] 15. Netlify deploy preview checked before merging to `master`

### Content James supplies (placeholders until then)
- [ ] Availability line, e.g. "Taking on new work from January". Empty hides the line.
- [ ] Work images: Bogha (iPhone and Watch) and Perry Oil (order page). The ticketing card has no image (see Decisions).
- [ ] Work links, if any: the Perry Oil live URL, the Bogha App Store or TestFlight URL
- [ ] LinkedIn URL. Keep or drop the Twitter/X handle `@jamesdesbyrne`.
- [ ] Netlify UI check (only James has dashboard access). Record:
  - any environment variables (`RUBY_VERSION`, `NODE_VERSION`, `JEKYLL_ENV`)
  - post-processing options (Pretty URLs) and redirects
  - that deploy previews are on for PRs from `james-byrne/byrnecodes`

  The last commit is 2021-04-05, so nothing has been built there since. `netlify.toml` overrides the build command and publish folder, but not these.

## Intent

The site was last updated in 2020. It sells "Ember & Elixir consulting" and a Stripe-branded payments service. James's work since then is Ember/TypeScript and Rails on a ticketing platform, native iPhone and Apple Watch apps (Bogha), payment systems (card terminals, Direct Debit, Gift Aid), and AI-assisted delivery. The refresh brings the positioning up to date, adds the work itself, and puts the site on a toolchain that still builds. The audience is prospective freelance and contract clients, both technical leads and small businesses. Direction A keeps the hexagon brand they may already recognise.

## Goals
- Home page and post layout match the A artboards at 1280px and 390px.
- Skills section rewritten as four cards plus an "Also" line (copy below).
- A Selected work section.
- The build runs on current Ruby and Node, locally and on Netlify.
- Per-page title, description, canonical, Open Graph and Twitter card tags. `lang="en"`. Alt text on meaningful images.
- WCAG 2.1 AA: text contrast ≥ 4.5:1, a visible keyboard focus ring, 44px touch targets.

## Non-goals
- No CMS, no case-study pages, no analytics changes, no dark mode.
- No writing archive page while there are 6 posts or fewer. The home list is the index.
- No newsletter. The Formspree form posts to a legacy email endpoint and is removed.
- No new blog post. A post on agent-driven delivery is a separate piece of writing.

## Anti-goals (a failure even if the site works)
- Any existing post URL changes. All three must resolve at `/YYYY/MM/DD/slug` exactly as today.
- The employer, its customers or its payment vendors are named. Use "a ticketing platform" and "card terminals".
- The site claims Stripe or AI-broker work. Neither appears in James's history.
- The page needs JavaScript to read or navigate.

## Current state (as found)
- **Generator and hosting:** Jekyll 3.8.6 (lockfile), kramdown and rouge 3.14. Hosted on Netlify; the build command is set in the Netlify UI and is presumably `npm run build` (unverified). Output goes to `_site`.
- **CSS build:** gulp 4, babel 6 and Tailwind 1.0.1, with purgecss over `_site/**/*.html`. Output is `assets/css/style.css`, which is gitignored.
- **Local toolchain:** Ruby 4.0.2 and Node 26. Gems aren't installed. Jekyll 3.8 on Ruby 4 is very unlikely to build, so treat the current build as broken until shown otherwise.
- **Templates:**
  - `_layouts/default.html`, `_layouts/blog_post.html`
  - `_includes/header.html` (the head), `_includes/navbar.html`, and an empty `footer.html`
  - `<html class="no-js" lang="">`
- **Posts (3):** the post bodies contain:
  - their own H1, in two of the three
  - Tailwind classes inside raw HTML, e.g. `<div class="flex justify-center my-6">`
  - `<img>` tags
  - fenced code in `ts`, `js`, `html`, `hbs`, `css` and `bash`
  - inline code, lists and blockquotes

  Front matter: `layout`, `title`, `description` (some end in " ..."), `backdrop`, `thumbnail` and `smallBackdropImage`.
- **Assets:**
  - `byrnecodes.svg`: the hex and wordmark logo, in black
  - `james-headshot.jpg` (420²) and `james-headshot-lg.jpg` (1422², 692 KB)
  - `b-hex.svg`, plus the ember, elixir and stripe logos
  - 25 favicons
  - `manifest.json`, named "App" with wrong icon paths

## Approaches (build pipeline)

1. **Keep Jekyll, upgrade to 4.4, and replace gulp with the Tailwind v4 CLI.** *Chosen (Claude's call; James approved 2026-11-15).* Two npm scripts, no bundler. Tailwind v4 finds its own content and minifies, so purgecss, autoprefixer, cssnano and babel all go.
2. **Keep gulp and Tailwind 1, restyle only.** This changes the least, but the toolchain is six years old, very unlikely to run on Ruby 4 / Node 26, and keeps a tree of dead dependencies.
3. **Move off Jekyll (11ty or Astro).** This rewrites every template and puts the post permalinks at risk, for no visible gain.

### Pipeline detail (approach 1)
- **Gemfile:** `jekyll ~> 4.4`, `jekyll-seo-tag`, `webrick`. If Jekyll 4.4 won't run on Ruby 4.0, pin Ruby 3.4 in `.ruby-version` instead of patching gems. Record which in Decisions.
- **package.json:** devDependencies `tailwindcss@^4` and `@tailwindcss/cli@^4`; drop the rest. Scripts:
  - `css`: `tailwindcss -i src/style.css -o assets/css/style.css --minify`
  - `build`: `npm run css && bundle exec jekyll build`
  - `start`: `tailwindcss -i src/style.css -o assets/css/style.css --watch & bundle exec jekyll serve --livereload`
- **Why CSS goes to `assets/css/`, not `_site`:** Tailwind writes there before Jekyll runs, and Jekyll copies it into `_site`. Writing into `_site` breaks in serve mode, because Jekyll's rebuilds wipe it.
- **Tailwind sources:** v4 skips gitignored paths, so `_site` is never scanned. It must see `_posts/` because the posts use utility classes. If auto-detection misses them, add `@source "../_posts";`.
- **Delete:** `gulpfile.babel.js`, `.babelrc`, `tailwind.config.js` (v4 configures in CSS), `.all-contributorsrc`. Rewrite the starter README. Keep `LICENSE.md`, which is MIT from the starter kit.
- **`netlify.toml`:** `command = "npm run build"`, `publish = "_site"`, `NODE_VERSION` matching `.nvmrc` (current LTS).

## Design system

### Colour tokens (`@theme` in `src/style.css`)

| Token | Hex | Use | Contrast |
|---|---|---|---|
| ink | #1A202C | Headings, dark surfaces (contact band, code), primary button | — |
| body | #2D3748 | Card and prose text | 12.0 on white |
| muted | #4A5568 | Kickers, captions, meta | 7.5 on white, 7.2 on surface |
| line | #E2E8F0 | Borders, dividers | — |
| surface | #F7FAFC | Skills band, author card | — |
| tile | #EDF2F7 | Light hexes and placeholder tiles | ink on it: 14.5 |
| tile-strong | #CBD5E0 | Behind the photo while it loads | — |
| accent | #C8432D | Fills under white text (hexes, contact button), hex icon strokes | white on it: 4.9 |
| accent-text | #B23A24 | Links, work-card meta line on white | 6.0 |
| accent-hover | #8A2B1A | Link hover, inline-code text | 7.7 on accent-tint |
| accent-tint | #FDF0EC | Inline-code background, Perry Oil tile | — |
| ok | #2F855A | Availability dot (non-text) | 4.5 |

The brand orange was #E04E39. White text on it is 3.95:1, which fails AA, so `accent` is that hue darkened.

### Type
- **Inter** 400/500/600/700: body, h1, h3, buttons.
- **Ubuntu Mono** 400/700: kicker, section h2s, stack lines, dates, code.
- Drop Roboto and Roboto Condensed.
- One Google Fonts `css2` link with `display=swap`, plus a preconnect.

| Element | Desktop | Phone |
|---|---|---|
| Home h1 | Inter 700, `clamp(36px, 5vw, 60px)`, lh 1.05, ls −1.5px, `text-wrap: balance` | 38px, lh 1.08 |
| Post h1 | Inter 700, `clamp(36px, 5vw, 52px)`, lh 1.08 | same clamp |
| Section h2 | Ubuntu Mono 400, 36px | 30px |
| Card h3 | Inter 600, 20px (work: 22px) | 19 / 21px |
| Lede | Inter 19px, lh 1.6, muted | 17px |
| Kicker | Ubuntu Mono 20px, muted | 17px |
| Card body | Inter 15px, lh 1.6, body | same |
| Stack line | Ubuntu Mono 15px, muted | same |

### Layout
- **Containers:** 1160px max with a 24px gutter (20px on phone). Post column 720px.
- **Section padding:** 88–96px vertical on desktop, 56–64px on phone.
- **Radii:** buttons 8px, cards and media 12px, inline code 4px. No shadows.
- **Grids:** `repeat(auto-fit, minmax(min(<n>px, 100%), 1fr))`, with n = 250 (skills), 320 (work), 300 (writing).
- **Breakpoints:** the hero goes to one column below about 980px (flex-wrap, as drawn). The nav collapses to the menu button below `md` (768px).
- **Focus:** `:focus-visible` gets a 2px `accent` outline with a 2px offset, on every link and button.

## Components

### Head
- `{% seo %}` from `jekyll-seo-tag` supplies the title, description, canonical, OG, Twitter and JSON-LD tags.
- **Site title:** "Byrnecodes"
- **Default page title:** "James Byrne — full-stack developer"
- **Description:** "James Byrne, full-stack developer: Ember & Rails web apps, iPhone & Apple Watch apps, and payment systems."
- **Default image:** `/assets/img/james-headshot-lg.jpg`. Posts use their `backdrop` as `image`.
- **manifest.json:** name "Byrnecodes", `short_name` "Byrnecodes", icon paths under `/assets/favicons/`, `theme_color` #1A202C.

### Header and nav
- **Logo:** `assets/img/byrnecodes.svg` at 216×52, linking to `/`, `alt="Byrnecodes home"`.
- **Desktop (≥ md):** links Skills (`/#skills`), Work (`/#work`) and Writing (`/#writing`), plus a primary "Get in touch" button (`mailto:` from `site.email`, `?Subject=Hi!`, min-height 44px). On a post page the Writing link gets `aria-current="page"` and a 2px accent underline.
- **Phone (< md):**
  - Closed: a 44×44 menu button, with a 1.5px ink border and three bars.
  - Open: as drawn in `PhoneMenu.dc.html`. The button turns ink-filled with a white ×, and a full-width panel lists the three links (22px/600, 64px rows, line dividers, with mono "01–03" in accent and `aria-hidden`), then the "Get in touch" button and the email address.
  - The hex decoration at the panel's foot is optional.
  - Implementation: a `<button aria-expanded aria-controls>` toggled by a few lines of inline JS that also swaps `no-js` for `js` on `<html>` and closes the panel on link click.
  - Without JS (`.no-js`), the links render inline and wrap under the logo. The menu button is hidden.

### Hero (`index.html`)
- **Kicker:** "James Byrne :: Byrnecodes"
- **h1:** "Web apps, iPhone apps, and the payments that keep them earning."
- **Lede:** "I’m a full-stack developer. Ember and Rails for ambitious web apps, Swift and SwiftUI for native iPhone and Apple Watch apps, and a lot of time spent making sure money moves correctly."
- **CTAs:** primary "Start a project" (mailto) and ghost "See the work" (`#work`, 1.5px ink inset ring). On phone they're full width and stacked.
- **Availability:** an 8px `ok` dot plus `site.availability`. If that's empty, the line isn't rendered.

### Honeycomb
- **Container:** decorative (`aria-hidden="true"`), `position: relative`, `aspect-ratio: 1 / 0.93`, `width: 100%`, max-width 480px (360px on phone). It sits right of the text on desktop and below it on phone.
- **Hexes:** seven of them, each absolutely positioned at 31% × 38.5% with `clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)`. Labels are Ubuntu Mono 16px (14px on phone; 13px for TypeScript and the photo).

| Hex | left / top | Fill | Label colour |
|---|---|---|---|
| Swift | 18.25% / 0.25% | ink | white |
| Ember | 50.75% / 0.25% | accent | white |
| TypeScript | 2% / 30.75% | tile | ink |
| Photo | 34.5% / 30.75% | `james-headshot.jpg`, `object-fit: cover`, `alt=""` | — |
| Rails | 67% / 30.75% | tile | ink |
| Agents | 18.25% / 61.25% | accent | white |
| Payments | 50.75% / 61.25% | ink | white |

### Skills (`#skills`)
- **Band:** a surface band with line borders top and bottom. h2 "What I do"; sub-line "Four things I do every week, not just things I’ve tried."
- **Cards:** white, 1px line border, radius 12px, 28px padding (22px on phone). Each has a 32×36 outlined accent hex icon (inline SVG, 2px stroke), an h3, the stack line and the body.
- **Data:** `_data/skills.yml`, in this order:

| title | stack | body |
|---|---|---|
| Ambitious web apps | Ember · TypeScript · Rails | Ember apps in strict TypeScript, backed by Rails APIs. Day to day I build box-office and online-checkout features for a ticketing platform. |
| iPhone & Apple Watch | Swift · SwiftUI · SwiftData · CloudKit | Native apps synced over iCloud, with Watch companions, widgets, video and on-device AI. Bogha, my archery training app, is where I prove it. |
| Payment systems | Card terminals · Direct Debit · online checkout | Getting paid is the most important part of your app’s workflow, but rarely treated as such. Terminal payments and refunds, Direct Debit, recurring donations, Gift Aid. |
| AI-assisted delivery | Claude Code · skills · hooks · agents | Test-first delivery where agents plan, build, review and QA in parallel and I sign off. I can set the same workflow up for your team. |

- **"Also" line:** "Elixir & Phoenix (client sites I’ve maintained since 2021) · fast static sites for small businesses"

### Selected work (`#work`)
- **Data:** `_data/work.yml`, with fields `title`, `meta`, `body`, `image` (optional), `image_alt`, `tile` (the tile colour when there's no image), and `url` (optional).
- **Card:**
  - a 4:3 media box with radius 12px
  - the meta line in Ubuntu Mono 14px accent-text
  - h3 22px/600
  - body 15px
- **Links:** when `url` is set, the whole card is the link (external, `rel="noopener"`).
- **No image:** the media box is a solid `tile` colour with the title in Ubuntu Mono 15px, centred, and the box is `aria-hidden`.

| title | meta | body | tile |
|---|---|---|---|
| Bogha | iOS · watchOS · 2026 | An archery training app for iPhone and Apple Watch: scoring, equipment setups, training plans, video, and voice notes summarised on-device. | ink (label #CBD5E0) |
| Ticketing platform | Ember · Rails · payments | Annual passes, recurring donations with Gift Aid and Direct Debit, card-terminal refunds and email campaigns for venues’ box offices. | tile (label muted) |
| Perry Oil | Phoenix · card payments · since 2021 | Heating-oil ordering with online card payment and an admin back office, built and maintained for a local supplier. | accent-tint (label accent-hover) |

### Writing (`#writing`)
- **Heading:** h2 "Thoughts on things".
- **List:** `site.posts`, newest first, `limit: 6`.
- **Each entry** is a link: a date (`%b %Y`, Ubuntu Mono 14px, muted) and the title (Inter 20px/600; 18px on phone), on a 2px top border. The newest has an ink border, the rest line.
- **Hover:** the title turns accent-text.
- **Layout:** a grid on desktop, stacked on phone. No thumbnails. The `thumbnail` front matter stays, unused.

### Contact band and footer (shared includes, on every page)
- **Contact band:** ink background. h2 "Need advice or have a cool idea?" in Ubuntu Mono 40px (36px on posts, 32px on phone), white. `site.email` below it in #CBD5E0. An accent "Get in touch" button (mailto), full width on phone.
- **Footer:** "© {{ 'now' | date: '%Y' }} Byrnecodes" on the left. On the right, Ubuntu Mono links to GitHub (`https://github.com/james-byrne`) and to LinkedIn, if `site.social.linkedin` is set.

### Post layout (`_layouts/blog_post.html`)
- **Article column:** 720px.
- **Back link:** "← All writing" (`/#writing`), Ubuntu Mono 15px.
- **Meta line:** Ubuntu Mono 15px, muted: long date (`%-d %B %Y`) · topics (front matter `topics`, joined " · ") · reading time (`words / 200`, rounded up, "N min read").
- **Title block:** h1 from `page.title`, then the dek from `page.description` (20px, muted).
- **Banner:** `page.backdrop` at `aspect-ratio: 10 / 3`, radius 12px, 1px line border. It uses `object-fit: contain` on #F2F2F2 when `smallBackdropImage` is "true", otherwise `cover`. Alt is empty, because it's decorative.
- **Then:** `{{ content }}` styled by `.prose` (below).
- **Author aside:**
  - surface background, line border, radius 12px, 28px padding
  - an 88×101 hex-clipped headshot, `alt="James Byrne"`
  - "James Byrne" in 17px/600
  - "Full-stack developer: Ember and Rails web apps, iPhone and Apple Watch apps, and payments." plus a "Get in touch" link
- **Older/newer nav:** `page.previous` / `page.next` in two columns, each with a mono label "← Older" / "Newer →" and the title at 17px/600. Hide a side when it doesn't exist.

### Prose (`.prose`, replacing the GitHub-markdown CSS)
- **p:** 18px, lh 1.75, body, `text-wrap: pretty`.
- **Links:** accent-text, underlined; accent-hover on hover.
- **h2:** Ubuntu Mono 400, 30px, about 48px space above.
- **h3:** Inter 600, 22px, lh 1.3.
- **h4:** Inter 600, 18px.
- **blockquote (default, an aside):** almost every blockquote in the posts is an aside ("skip this if…", "For Vim users…"), including stacked pairs. Style: 17px, lh 1.65, muted text, 3px line-colour left border, padding-left 20px, no background. Consecutive blockquotes get 12px between them.
- **blockquote.pull (a pull quote):** no border. A 22×25 filled accent hex sits to the left (a `::before` mask or an inline SVG background), and the text is 22px/500 ink. The mockup's one blockquote is this style. Apply it with a kramdown IAL, `{: .pull}`, on the line after the quote.
- **ul/ol:** padding-left 24px, 10px between items, lh 1.7.
- **Inline code:** Ubuntu Mono 16px, accent-tint background, accent-hover text, padding 2px 6px, radius 4px.
- **pre:** ink background, radius 12px, padding 22px 24px, Ubuntu Mono 16px, lh 1.6, `overflow-x: auto`. Inline-code styles are reset inside it.
- **img:** max-width 100%, radius 12px, 1px line border. The posts' wrapping `<div class="flex justify-center my-6">` keeps working.
- **table:** 1px line cells with 6px 12px padding. None are in posts today; it's only a safety net.

### Syntax theme (rouge classes, on ink)
Replace both Pygments themes in `style.css` with this one:

| Rouge classes | Colour | Contrast on ink |
|---|---|---|
| default text, `.p`, `.o` | #E2E8F0 | 13.2 |
| `.c`, `.c1`, `.cm`, `.cs`, `.cp` (italic) | #A0AEC0 | 7.2 |
| `.k`, `.kd`, `.kn`, `.kr`, `.kc`, `.kp`, `.nt` | #F6A28C | 8.1 |
| `.na`, `.nf`, `.nc`, `.nb`, `.fm` | #90CDF4 | 9.5 |
| `.s`, `.s1`, `.s2`, `.sb`, `.sx`, `.sd`, `.dl`, `.sr` | #9AE6B4 | 11.2 |
| `.m`, `.mi`, `.mf`, `.mh`, `.kt`, `.no` | #FBD38D | 11.5 |
| `.err` | default text, no box | — |

### 404 (`404.html`)
The default layout: h1 "Page not found", one line "That page doesn’t exist, or it moved.", and a link back to `/`. Netlify serves it automatically.

## Content changes
- **Post headings:** delete the body H1 in `2018-07-18-ember-a-retrospective.md` and `2019-06-05-types-in-ember.md`; the layout renders the title. Promote the headings in `2020-01-03-ember-and-tailwind.md` one level (`###` → `##`) so every post starts at h2.
- **Descriptions:** drop the trailing " ..." from each, so they read as deks.
- **Pull quote:** add `{: .pull}` after the "I also love it's component system…" blockquote in the tailwind post. It's the only pull quote; every other blockquote keeps the default aside style. This is markup, not wording.
- **Post images:** the six `<img>` tags in the posts have no `alt`. Add a short description of each (look at the image), e.g. "A pink button reading Press ME!".
- **Topics:** add front matter: retrospective `[Ember]`; types `[Ember, TypeScript]`; tailwind `[Ember, CSS]`.
- **Typos:** "it's" → "its" in the tailwind post (twice) and the retrospective description, *only with James's OK*. Otherwise leave the wording as it is.
- **`_config.yml`:**
  - `title: Byrnecodes`
  - `url: https://byrnecodes.com` (the canonical host: `www` and `http` both 301 to it; `jekyll-seo-tag` needs it for canonical and OG URLs)
  - `permalink: /:year/:month/:day/:title`. The live links have no `.html`; Netlify's link rewriting has been stripping it. This keeps the output files where they are, but makes Jekyll's own URLs and canonicals extensionless too.
  - the new `description`
  - `author: James Byrne`
  - `availability: ""`
  - `social: { github: james-byrne, linkedin: "" }`
  - `twitter: { username: jamesdesbyrne }` only if James keeps it
  - `plugins: [jekyll-seo-tag]`
  - `docs` added to `exclude`
- **Remove:**
  - `assets/img/ember-logo.svg`, `elixir-logo.svg`, `stripe-logo.svg` and `b-hex.svg`
  - the Formspree form
  - the unused `.clip-right-side`, `.max-w-xxs`, `.-right-7`, nudge and shadow utilities

## Decisions (Claude's calls; check them)
- Approach 1 for the pipeline (above).
- The Ticketing card has no screenshot: its box-office UI is the employer's product. It shows a name tile instead.
- No writing archive until there are more than 6 posts.
- The phone menu uses a JS toggle with a no-JS inline fallback, rather than `<details>`, so it can close itself after a link is tapped.
- The existing `byrnecodes.svg` is reused rather than redrawn, so the brand mark stays identical. The artboards approximate it with a hex plus live Ubuntu Mono text. That one difference is expected in the side-by-side check (24px tall on phone, 52px on desktop).
- Default blockquotes are quiet asides; only `.pull` blockquotes get the pull-quote treatment. The mockup showed only the pull quote, but the posts are mostly asides.
- The GitHub repo is public. Nothing under `docs/` names the employer, and the canvas link only opens for James.
- `jekyll-seo-tag` only. A sitemap and an RSS feed are cheap follow-ups but out of scope.
- Built 2026-11-15:
  - Ruby is pinned to 3.4.12 in `.ruby-version` (for Netlify) and in `mise.toml` (locally). Jekyll 4.4.1 needed no extra stdlib gems on it.
  - Reading time is the rendered text (`strip_html`) ÷ 200, rounded up.
  - A work image with no `image_alt` falls back to its title as alt text.

## Left to the builder
- Class naming, and whether components are Liquid includes or inline.
- The image pipeline (a WebP or 2x headshot is welcome, not required).
- The exact JS for the menu, within the behaviour above.

## Verification
- `npm ci && bundle install && npm run build` succeeds from a clean clone with the pinned Ruby and Node. `_site` contains `assets/css/style.css`, and it includes the utility classes the posts use (e.g. `my-6`).
- The three old URLs return 200 at the same paths:
  - `/2018/07/18/ember-a-retrospective`
  - `/2019/06/05/types-in-ember`
  - `/2020/01/03/ember-and-tailwind`
- Side-by-side check against the artboards at 1280px and 390px: home, menu open and closed, and a post. The logo is the SVG, not the artboards' live text.
- The retrospective and types posts render their stacked asides and the tailwind post's pull quote in the right styles.
- Keyboard: Tab reaches every link and button in order, the focus ring is visible, the menu opens and closes with Enter/Space, and it closes after a link is followed.
- With JS disabled, the nav links are visible and work.
- Lighthouse accessibility and SEO scores of 95 or more on home and one post. No console errors.
- The Netlify deploy preview is checked on a real phone before merging.
