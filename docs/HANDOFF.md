# Handoff: Gatsby to Astro (Small Tech Business)

Draft PR: https://github.com/jchu231/small-tech-business-website/pull/1
Branch: `cursor/astro-migration-c64a`

This is only the Small Tech Business site (`www.smalltechbusiness.com`). jkchu.com was discussed and was not migrated.

## What changed

The Gatsby 4 / React 16 starter is gone. The site is Astro 5.18.2, pinned because Astro 6+ needs a newer Node than the Netlify Node 22 pin. Package manager is npm (`package-lock.json`). `yarn.lock` is removed.

Pages are static `.astro` files. There is no React in this cut. Markdown posts still live in `content/blog/<slug>/index.md` and still publish at `/<slug>/`.

| Before | After |
| --- | --- |
| `gatsby build` → `public/` | `npm run build` → `dist/` |
| GraphQL + `gatsby-node.js` | Content collection in `src/content.config.ts` |
| `static/` | `public/` |
| `gatsby-plugin-react-helmet` | `src/components/BaseHead.astro` |
| `gatsby-remark-twitter-cards` | `scripts/site-assets.mjs` writes `/{slug}/twitter-card.jpg` at the end of the build |
| `gatsby-plugin-offline` | Removed. `public/sw.js` clears the old worker cache |

`site` in `astro.config.mjs` is `https://www.smalltechbusiness.com`. Canonicals, the sitemap, the feed, and share images are absolute on **www**. The apex-to-www 301 stays in Netlify domain settings. It is not in this repo.

## What was kept on purpose

- URLs, trailing slashes, titles, H1s, and article copy for the five posts
- CSS (`src/styles/style.css` and `normalize.css`)
- Substack iframe and the “Join 1,100+” line
- Plausible domain `smalltechbusiness.com` (`https://plausible.io/js/plausible.js`)
- Indie Hackers discuss links
- Previous = older post, next = newer post. Lists are newest first
- Dates in UTC as `June 03, 2021` (`MMMM DD`)
- NEW chip in the nav points at the newest post. About and 404 do not show it

Article body text was diffed against production and matched. Home, archive, and the Carrd article were checked visually against the live site.

## Behavior that is intentionally different

These are the SEO fixes. They do not change article URLs.

- `rel=canonical` on the www host. The live site has none.
- Sitemap is `/sitemap-index.xml` (plus `sitemap-0.xml`). Live `/sitemap.xml` is 404. `robots.txt` points at the new index.
- Homepage and non-post social images use the 1200×630 brand card. Live homepage image is the broken URL `https://smalltechbusiness.comundefinedtwitter-card.jpg`.
- Post `twitter:image` / `og:image` are absolute on www. Live cards pointed at the apex and 301’d.
- Posts use `og:type=article`. Other pages stay `website`.
- `/rss.xml` is new.
- `/using-typescript/` is gone. `netlify.toml` 301s it to `/`.
- No service worker. `public/sw.js` unregisters the old Gatsby worker so browsers do not keep stale HTML.
- About Twitter link is `https://twitter.com/jstnchu`. Live About was `https://twitter.com/` because the page query never selected `social`. The bio already used the handle.

Image alts that contain an apostrophe use a curly apostrophe (`Carrd’s`). Astro’s markdown image pipeline double-escapes a straight apostrophe into the literal text `&#x27;`. `scripts/rehype-image-alt.mjs` avoids that. Do not “fix” those alts back to `'`.

Share cards are regenerated with Satori + Sharp (Aleo, brand background, title, “by Justin Chu”). The path matches the old plugin. The pixels are close, not byte-identical.

## Deploy

Netlify publish directory must be **`dist`**, not `public`. `netlify.toml` sets the build command, Node 22, and that directory. If the Netlify UI overrides the file, change it there too.

After the first production deploy, hard-refresh once. The old service worker can serve pre-migration HTML until `sw.js` runs.

Do not change titles, H1s, or slugs in the same release as the cutover.

## How to work in the repo

```bash
npm install
npm run dev       # http://127.0.0.1:4321
npm run build && npm run preview
```

Deeper docs:

- `docs/LOCAL_DEV.md` — commands and the parity checklist
- `docs/DEV_RAMPUP.md` — file map and how a request becomes HTML

A new post is a folder `content/blog/<slug>/index.md` with `title`, `date`, `description`, and optional `indieHackersLink`. Images sit next to the markdown and are referenced as `./file.png`. The share card is generated. You do not draw it.

React later: `npx astro add react`, then `<Widget client:load />` for the interactive piece only. Leave `<head>` in the Astro layout so canonicals stay static HTML.

## Not in this PR

jkchu.com (WordPress.com) is a separate migration. Its permalinks are `/YYYY/MM/DD/slug/`, and WordPress.com stops serving the domain the moment DNS moves. Do not fold that work into this branch.
