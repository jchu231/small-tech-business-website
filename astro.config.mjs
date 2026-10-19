// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { rehypeImageAlt } from "./scripts/rehype-image-alt.mjs";
import { siteAssets } from "./scripts/site-assets.mjs";

const site = "https://www.smalltechbusiness.com";

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  markdown: {
    syntaxHighlight: "prism",
    smartypants: true,
    rehypePlugins: [rehypeImageAlt],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
    siteAssets({ site }),
  ],
});
