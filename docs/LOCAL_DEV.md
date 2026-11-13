# Local build, run, and test

How to work on the Small Tech Business site after the Astro migration.

## Prerequisites

- Node.js 22 or newer (`node -v`)
- npm 10 or newer (ships with Node)

Astro is pinned to 5.x because Astro 6+ needs a newer Node than `22.0`. Netlify is set to Node 22 in `netlify.toml`.

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). Pages, components, CSS, and Markdown under `content/blog/` reload on save.

| Path | What to check |
| --- | --- |
| `/` | Hero, Substack iframe, bio, three latest posts, NEW chip in the nav |
| `/archive/` | Full post list, newest first |
| `/about/` | About copy and signup |
| `/build-niche-mvp-carrd/` | Article, images, Indie Hackers link, previous/next |
| `/build-niche-mvp-carrd/twitter-card.jpg` | JPEG share card |
| `/rss.xml` | Feed, newest first |

The sitemap (`/sitemap-index.xml`) is written by the production build, so check it with `preview`, not `dev`.

## Production build

```bash
npm run build
npm run preview
```

`build` writes static HTML to `dist/`. `preview` serves that folder the way Netlify will.

Netlify publish directory is **`dist`**. The old Gatsby site published `public/`. `netlify.toml` sets the new directory. If the Netlify UI overrides the config file, change the publish directory there too.

## Parity checklist

Run through this before merging or deploying:

1. **Look** — home, archive, about, and one article still use the same fonts, cards, nav, logo, and signup iframe.
2. **URLs** — every post is still `/{folder-name}/` with a trailing slash. The folder name under `content/blog/` is the slug.
3. **Nav** — Archive and About work. The logo returns home. NEW points at the newest post by date.
4. **Article footer** — Indie Hackers link only when `indieHackersLink` is set. Bio and the Substack embed are still there.
5. **Previous / next** — previous is the older post, next is the newer post.
6. **Images** — relative `./image.png` files in a post render inside the article.
7. **Dates** — `June 03, 2021` style (month name, zero-padded day, year), matching the live site.
8. **SEO tags** — view source: `<title>`, description, `rel=canonical` on `https://www.smalltechbusiness.com/...`, and `twitter:image` / `og:image` as absolute `www` URLs. The homepage image must not contain the string `undefined`.
9. **Share card** — `/{slug}/twitter-card.jpg` returns `200` and `image/jpeg`.
10. **Analytics** — HTML includes the Plausible script with `data-domain="smalltechbusiness.com"`.
11. **Removed route** — `/using-typescript/` is not a page. Netlify 301s it to `/`.

### Smoke test against preview

```bash
BASE=http://127.0.0.1:4321
for path in / /archive/ /about/ \
  /how-plausible-finds-success-and-differentiates-from-google-analytics/ \
  /monetizing-open-source-tailwind/ \
  /building-the-next-creator-platform/ \
  /build-niche-mvp-carrd/ \
  /indie-differentiation-path-convertkit/ \
  /rss.xml \
  /sitemap-index.xml \
  /build-niche-mvp-carrd/twitter-card.jpg
do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path")
  echo "$code  $path"
done
```

Expect `200` for each.

## Editing content

1. Add `content/blog/my-post-slug/index.md`.
2. Frontmatter:

   ```md
   ---
   title: "My title"
   date: "2026-04-01T07:30:00.000Z"
   description: "One line used in lists and the meta description."
   indieHackersLink: "https://www.indiehackers.com/post/..."
   ---
   ```

   `indieHackersLink` is optional.

3. Put images next to `index.md` and reference them as `./image.png`.
4. The public URL is `/my-post-slug/`.
5. A share image is generated at `/my-post-slug/twitter-card.jpg` from the title. You do not draw it by hand.

## Deploy notes

- Build command: `npm run build`
- Publish directory: `dist`
- Keep the existing **apex → www** redirect in Netlify domain settings. It is not in this repo.
- `public/sw.js` replaces the old Gatsby service worker and clears its cache, so visitors are not stuck on pre-migration HTML. Hard-refresh once after the first Astro deploy if a page looks stale.
