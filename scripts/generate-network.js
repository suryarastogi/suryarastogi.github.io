#!/usr/bin/env node

/**
 * Parses all markdown files in public/posts/ for [[wiki-links]],
 * generates public/data/network.json with nodes and edges.
 *
 * Usage: node scripts/generate-network.js
 */

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "public", "posts");
const OUTPUT = path.join(__dirname, "..", "public", "data", "network.json");

const LINK_RE = /\[\[([^\]]+)\]\]/g;

// Colors for the graph
const NODE_COLOR = "#6C63FF";
const EDGE_COLOR = "#555";

function main() {
  const postsFile = path.join(POSTS_DIR, "posts.json");
  if (!fs.existsSync(postsFile)) {
    console.error("posts.json not found");
    process.exit(1);
  }

  const postFilenames = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const postNames = postFilenames.map((f) => f.replace(/\.md$/, ""));

  // Parse each file for links
  const links = []; // { source, target }
  const postDates = {};

  for (const filename of postFilenames) {
    const filePath = path.join(POSTS_DIR, filename);
    const name = filename.replace(/\.md$/, "");

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${filename} not found, skipping`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");

    // Extract date from second non-empty line (convention: "Mar 16, 2018")
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length > 1) {
      const dateLine = lines[1].trim();
      const parsed = Date.parse(dateLine);
      if (!isNaN(parsed)) {
        postDates[name] = dateLine;
      }
    }

    // Find all [[wiki-links]]
    let match;
    while ((match = LINK_RE.exec(content)) !== null) {
      const target = match[1].trim();
      if (postNames.includes(target)) {
        links.push({ source: name, target });
      } else {
        console.warn(`Warning: "${name}" links to "${target}" which is not in posts.json`);
      }
    }
  }

  // Deduplicate edges (A->B and B->A become one edge)
  const edgeSet = new Set();
  const edges = [];
  for (const { source, target } of links) {
    const key = [source, target].sort().join("|||");
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({
        id: `e-${edges.length}`,
        source,
        target,
        color: EDGE_COLOR,
      });
    }
  }

  // Layout nodes in a circle
  const nodes = postNames.map((name, i) => {
    const angle = (2 * Math.PI * i) / postNames.length;
    const radius = 200;
    return {
      id: name,
      label: name,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 10,
      color: NODE_COLOR,
      date: postDates[name] || null,
    };
  });

  const network = { nodes, edges };

  // Ensure output dir exists
  const outputDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(network, null, 2));
  console.log(
    `Generated ${OUTPUT}: ${nodes.length} nodes, ${edges.length} edges`
  );
}

main();
