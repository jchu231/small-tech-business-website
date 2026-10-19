/**
 * remark-smartypants turns apostrophes in image alts into HTML entities.
 * The later HTML escape then turns those into literal `&amp;#x27;` text.
 * Decode the entities back to characters before serialization.
 */
const NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decode(value) {
  return value.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (entity, body) => {
    if (body[0] !== "#") return NAMED[body] ?? entity;
    const codePoint =
      body[1] === "x" || body[1] === "X"
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
    if (!Number.isFinite(codePoint)) return entity;
    return String.fromCodePoint(codePoint);
  });
}

function walk(node) {
  if (node?.type === "element" && node.tagName === "img") {
    const alt = node.properties?.alt;
    if (typeof alt === "string") {
      // Straight apostrophes are later serialized as &#x27; and then escaped again.
      node.properties.alt = decode(alt).replaceAll("'", "\u2019");
    }
  }
  if (node?.type === "raw" && typeof node.value === "string" && node.value.includes("&#x27;")) {
    node.value = node.value.replaceAll("&#x27;", "\u2019");
  }
  if (Array.isArray(node?.children)) {
    for (const child of node.children) walk(child);
  }
}

export function rehypeImageAlt() {
  return (tree) => {
    walk(tree);
  };
}
