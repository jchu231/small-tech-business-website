# Developer ramp-up

How this site is put together after the move from Gatsby. Written for someone who used the Gatsby starter and has not spent much time in Astro.

## What this site is

A static marketing page and blog for [Small Tech Business](https://www.smalltechbusiness.com/). Posts are Markdown. Newsletter signup is a Substack iframe. Analytics is Plausible. Hosting is Netlify.

There is no React in this cut. Pages are `.astro` files that compile to HTML. React can be added later (see the end of this doc) without turning the whole site into a client app.

## Gatsby to Astro

| Gatsby | Here |
| --- | --- |
| `gatsby-config.js` `siteMetadata` | `src/consts.ts` and `site` in `astro.config.mjs` |
| `gatsby-node.js` `createPages` | `getStaticPaths()` in `src/pages/[slug].astro` |
| GraphQL `allMarkdownRemark` | `getCollection("blog")` |
| `src/templates/blog-post.js` | `src/pages/[slug].astro` |
| `src/pages/*.js` | `src/pages/*.astro` |
| `src/components/*.js` | `src/components/*.astro` |
| `static/` | `public/` (copied as-is) |
| `gatsby build` → `public/` | `astro build` → `dist/` |
| `gatsby-plugin-react-helmet` | `src/components/BaseHead.astro` |
| `gatsby-plugin-plausible` | Script tag in `BaseHead.astro` |
| `gatsby-remark-twitter-cards` | `scripts/site-assets.mjs` writes `/{slug}/twitter-card.jpg` |
| `gatsby-plugin-offline` | Removed. `public/sw.js` only clears the old worker |

## Folder map

```
content/blog/<slug>/index.md   Posts and their images. URL = /<slug>/
content/assets/                Logo, avatar, share-card background, Aleo font
public/                        Favicons, robots.txt, webmanifest, legacy sw.js
src/components/                Bio, Signup, Discuss, BaseHead
src/layouts/BaseLayout.astro   Fonts, CSS, nav, footer
src/lib/posts.ts               Sort, date format, path helpers
src/pages/                     File-based routes
src/styles/                    normalize.css and style.css (from the Gatsby site)
src/content.config.ts          Blog frontmatter schema
src/consts.ts                  Title, description, social handles
scripts/site-assets.mjs        RSS feed and share-card images
astro.config.mjs               Site URL, trailing slashes, sitemap
netlify.toml                   Build command, publish dir, legacy redirects
docs/                          Handoff, this guide, and LOCAL_DEV.md
```

## How a request becomes HTML

1. `astro build` reads every file under `src/pages/`.
2. `src/content.config.ts` loads each `content/blog/**/index.md`, checks frontmatter, and sets the id to the folder name. That id is the URL slug.
3. `getStaticPaths()` in `[slug].astro` returns one path per post and wires previous, next, and newest the same way `gatsby-node.js` did.
4. Markdown is rendered with smartypants (curly quotes) and Prism highlighting, matching the old remark plugins.
5. Output is `dist/<slug>/index.html`, so `/slug/` is the public URL.
6. After the HTML is written, `scripts/site-assets.mjs` adds `dist/rss.xml` and `dist/<slug>/twitter-card.jpg`.

In `npm run dev`, that same script serves `/rss.xml` and the share cards through the dev server. The sitemap exists only after a production build.

## Files to read first

1. `astro.config.mjs` — `site` must stay `https://www.smalltechbusiness.com`. Canonicals, the sitemap, the feed, and share images are absolute on **www**.
2. `src/content.config.ts` — the frontmatter contract. Add a field here before using it in a page.
3. `src/layouts/BaseLayout.astro` — nav (NEW chip, Archive, About), global CSS, fonts.
4. `src/pages/[slug].astro` — the article template.
5. `src/styles/style.css` — the visual design. Prefer editing this over adding a new styling system.

## Content collections (no GraphQL)

```ts
import { getCollection, render } from "astro:content";

const posts = await getCollection("blog");
const { Content } = await render(post);
```

- `post.id` — slug, for example `build-niche-mvp-carrd`
- `post.data` — typed frontmatter: `title`, `date`, `description`, optional `indieHackersLink`
- `postPath(post)` in `src/lib/posts.ts` — always `/slug/` with a trailing slash

Sort order matches Gatsby:

- Lists (home, archive, RSS): newest first
- Previous / next on an article: walked oldest-first, so previous is older and next is newer

Dates use UTC and `MMMM DD, YYYY`, so `2021-06-03T07:30:00.000Z` renders as `June 03, 2021`.

## SEO

`BaseHead.astro` emits the title, description, canonical, Open Graph, Twitter tags, and Plausible.

Canonicals use `https://www.smalltechbusiness.com` plus the path with a trailing slash. The apex host already 301s to www in Netlify; this repo does not recreate that redirect.

Share images for posts are generated at `/{slug}/twitter-card.jpg`, which is the path the old site already advertised. The homepage and other non-post pages use the branded 1200×630 background instead of the old broken `undefinedtwitter-card.jpg` URL.

Posts use `og:type` of `article`. Other pages stay `website`.

Sitemap: `@astrojs/sitemap` writes `/sitemap-index.xml`. `public/robots.txt` points at it. `/404/` is left out.

Feed: `/rss.xml`.

## Styling

- Reuse class names in `style.css` (`article-card`, `hero-card`, `stb--page-nav`, and the rest).
- Logo and avatar use `astro:assets` `<Image>` at 50×50, same as the old `gatsby-image` fixed sizes.
- `.stb-logo` and `.bio-avatar` set an explicit size because `gatsby-image` used to do that on its wrapper.
- Article images are `display: block` with `max-width: 630px`, which is what `gatsby-remark-images` (`maxWidth: 630`) produced.
- Do not add a CSS framework unless you are redesigning.
- Prism's default theme is imported in the layout, same as `gatsby-browser.js`.

## What changed on purpose

Kept: post URLs, copy, CSS, Substack embed, Plausible domain, Indie Hackers links, share-card paths, previous/next, and the NEW chip.

SEO fixes that do not change article URLs:

- Canonical URLs on the www host (they were missing)
- A real sitemap ( `/sitemap.xml` was 404; Astro publishes `/sitemap-index.xml` )
- Homepage share image is a real file
- Social image URLs are absolute on www
- `/using-typescript/` removed (Netlify 301s it to `/`)
- Offline service worker removed, with `public/sw.js` clearing the old one
- `/rss.xml` added

One content bugfix: the About page Twitter link was `https://twitter.com/` because the Gatsby page query never selected `social`. It now points at `https://twitter.com/jstnchu`, which is what the bio already used.

## Adding a React page later

```bash
npx astro add react
```

Then in any `.astro` page:

```astro
---
import Widget from "../components/Widget.tsx";
---
<Widget client:load />
```

Without a `client:*` directive, a React component still renders to static HTML and ships no client JavaScript. Use `client:load` or `client:visible` only for the part that needs the browser. Keep the `<head>` in the Astro layout so the title, canonical, and social tags stay static HTML.

## Where to look next

- Commands and the test checklist: [LOCAL_DEV.md](./LOCAL_DEV.md)
- Content collections: https://docs.astro.build/en/guides/content-collections/
- File-based routing: https://docs.astro.build/en/basics/astro-pages/
