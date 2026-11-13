# Small Tech Business

Static site for [smalltechbusiness.com](https://www.smalltechbusiness.com/): newsletter landing page, archive, and articles.

Built with [Astro](https://astro.build/) and Markdown. Hosted on Netlify.

## Quick start

```bash
npm install
npm run dev
```

App: [http://127.0.0.1:4321](http://127.0.0.1:4321)

```bash
npm run build     # writes dist/
npm run preview   # serves the production build
```

## Docs

| Doc | Use it for |
| --- | --- |
| [docs/HANDOFF.md](docs/HANDOFF.md) | What changed in the Gatsby → Astro migration, and what to leave alone |
| [docs/LOCAL_DEV.md](docs/LOCAL_DEV.md) | Install, run, build, and check the site locally |
| [docs/DEV_RAMPUP.md](docs/DEV_RAMPUP.md) | How the codebase is organized, including the old Gatsby map |

## Content

Posts live in `content/blog/<slug>/index.md`. The public URL is `/<slug>/`.

## Deploy

Netlify build command: `npm run build`. Publish directory: `dist` (see `netlify.toml`). Node 22.

The apex host already redirects to `www`. Leave that redirect in place.
