# byrnecodes.com

James Byrne's site: who I am, what I do, and occasional writing. Built with Jekyll and Tailwind CSS, deployed on Netlify.

## Requirements

- Ruby, version in `.ruby-version` (`mise install` picks it up from `mise.toml`)
- Node, version in `.nvmrc`

## Setup

```bash
bundle install
npm ci
```

## Commands

| Command | What it does |
|---|---|
| `npm start` | Watches the CSS and serves the site with live reload at http://localhost:4000 |
| `npm test` | Builds the site, builds the fixture variant in `tmp/variant`, and runs the tests in `test/` |
| `npm run build` | Production build into `_site` |

Home-page content lives in `_data/skills.yml` and `_data/work.yml`; site-wide settings (availability, social links) in `_config.yml`. Posts go in `_posts/`.

## Deploy

Netlify builds `master` on every push, using `netlify.toml`.

Originally based on the MIT-licensed [tailwind-jekyll](https://github.com/taylorbryant/tailwind-jekyll) starter; see `LICENSE.md`.
