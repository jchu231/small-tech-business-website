import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/** Matches Gatsby's `date(formatString: "MMMM DD, YYYY")` in UTC. */
export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function postPath(post: BlogPost): string {
  return `/${post.id}/`;
}

/** Newest first — home, archive, and RSS. */
export async function getPostsNewestFirst(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Oldest first — previous/next walk, same as gatsby-node.js ASC sort. */
export async function getPostsOldestFirst(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
}
