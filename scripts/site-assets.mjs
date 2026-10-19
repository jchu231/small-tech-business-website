import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import rss from "@astrojs/rss";
import satori from "satori";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

/** @type {Promise<ArrayBuffer> | null} */
let fontPromise = null;
/** @type {Promise<string> | null} */
let backgroundPromise = null;
/** @type {Map<string, Promise<Buffer>>} */
const cardCache = new Map();

/**
 * @param {string} root
 */
async function loadPosts(root) {
  const base = join(root, "content/blog");
  const slugs = await readdir(base);
  /** @type {{ slug: string, title: string, description: string, date: Date }[]} */
  const posts = [];

  for (const slug of slugs) {
    const raw = await readFile(join(base, slug, "index.md"), "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    /** @type {Record<string, string>} */
    const data = {};
    for (const line of match[1].split(/\r?\n/)) {
      const field = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (!field) continue;
      let value = field[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      data[field[1]] = value;
    }
    if (!data.title || !data.date) continue;
    posts.push({
      slug,
      title: data.title,
      description: data.description ?? "",
      date: new Date(data.date),
    });
  }

  return posts.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

/**
 * @param {string} root
 */
function getFont(root) {
  if (!fontPromise) {
    fontPromise = readFile(join(root, "content/assets/fonts/Aleo-Regular.ttf")).then(
      (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    );
  }
  return fontPromise;
}

/**
 * @param {string} root
 */
function getBackground(root) {
  if (!backgroundPromise) {
    backgroundPromise = readFile(
      join(root, "content/assets/stb-twitter-card-image-2.png"),
    ).then((buf) => `data:image/png;base64,${buf.toString("base64")}`);
  }
  return backgroundPromise;
}

/**
 * Recreate gatsby-remark-twitter-cards: background, title, "by Justin Chu".
 * @param {string} root
 * @param {string} title
 */
export async function renderTwitterCardJpeg(root, title) {
  const cached = cardCache.get(title);
  if (cached) return cached;

  const pending = (async () => {
    const [font, background] = await Promise.all([getFont(root), getBackground(root)]);
    const fontSize = title.length > 60 ? 56 : 72;

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "78px 90px 72px",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#242d3c",
            fontFamily: "Aleo",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  fontSize,
                  lineHeight: 1.12,
                  display: "flex",
                  maxWidth: "1000px",
                },
                children: title,
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: 48,
                  lineHeight: 1.2,
                  display: "flex",
                },
                children: "by Justin Chu",
              },
            },
          ],
        },
      },
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [{ name: "Aleo", data: font, weight: 400, style: "normal" }],
      },
    );

    const png = new Resvg(svg, {
      fitTo: { mode: "width", value: WIDTH },
    })
      .render()
      .asPng();

    return sharp(png).jpeg({ quality: 90 }).toBuffer();
  })();

  cardCache.set(title, pending);
  return pending;
}

/**
 * @param {string} root
 * @param {string} site
 */
export async function renderRss(root, site) {
  const posts = await loadPosts(root);
  const response = await rss({
    title: "Small Tech Business",
    description:
      "Small Tech Business is a curated newsletter for people looking for inspiration and learning around starting their own small internet or technology business.",
    site,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: post.date,
      link: `/${post.slug}/`,
    })),
  });
  return response.text();
}

/**
 * @param {{ site: string }} options
 */
export function siteAssets({ site }) {
  const root = process.cwd();

  return {
    name: "site-assets",
    hooks: {
      /**
       * @param {{ server: import('vite').ViteDevServer }} param0
       */
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          try {
            const pathname = (req.url ?? "").split("?")[0];

            if (pathname === "/rss.xml" || pathname === "/rss.xml/") {
              const xml = await renderRss(root, site);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
              res.end(xml);
              return;
            }

            const card = pathname.match(/^\/([^/]+)\/twitter-card\.jpg\/?$/);
            if (card) {
              const slug = decodeURIComponent(card[1]);
              const posts = await loadPosts(root);
              const post = posts.find((item) => item.slug === slug);
              if (!post) {
                next();
                return;
              }
              const jpeg = await renderTwitterCardJpeg(root, post.title);
              res.statusCode = 200;
              res.setHeader("Content-Type", "image/jpeg");
              res.setHeader("Cache-Control", "public, max-age=0");
              res.end(jpeg);
              return;
            }

            next();
          } catch (error) {
            next(error);
          }
        });
      },
      /**
       * @param {{ dir: URL }} param0
       */
      "astro:build:done": async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const posts = await loadPosts(root);
        const xml = await renderRss(root, site);
        await writeFile(join(outDir, "rss.xml"), xml);

        for (const post of posts) {
          const jpeg = await renderTwitterCardJpeg(root, post.title);
          const dest = join(outDir, post.slug, "twitter-card.jpg");
          await mkdir(dirname(dest), { recursive: true });
          await writeFile(dest, jpeg);
        }
      },
    },
  };
}
