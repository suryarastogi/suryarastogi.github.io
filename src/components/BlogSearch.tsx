import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot, Root } from "react-dom/client";
import { marked } from "marked";
import { Autocomplete, TextField } from "@mui/material";
import BitcoinGraph from "./BitcoinGraph";

// Convert [[wiki-links]] to clickable anchor tags
function resolveWikiLinks(html: string): string {
  return html.replace(
    /\[\[([^\]]+)\]\]/g,
    '<a href="#" class="wiki-link" data-post="$1">$1</a>'
  );
}

const BlogSearch: React.FC = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const vizRootsRef = useRef<Root[]>([]);

  useEffect(() => {
    fetch("/posts/posts.json")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetch(`/posts/${selectedPost}`)
        .then((response) => response.text())
        .then((markdown) => {
          const html = marked.parse(markdown) as string;
          setPostContent(resolveWikiLinks(html));
        })
        .catch((error) => console.error("Error fetching post content:", error));
    }
  }, [selectedPost]);

  const navigateToPost = useCallback((postName: string) => {
    setSelectedPost(postName + ".md");
    setSearchTerm(postName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const mountVizComponents = useCallback(() => {
    if (!contentRef.current) return;

    // Cleanup previous roots
    vizRootsRef.current.forEach((root) => root.unmount());
    vizRootsRef.current = [];

    // Mount graph visualizations
    const vizDivs = contentRef.current.querySelectorAll<HTMLElement>(
      "[data-viz]"
    );

    vizDivs.forEach((div) => {
      const dataFile = div.getAttribute("data-viz");
      const title = div.getAttribute("data-title") || undefined;
      if (dataFile) {
        const root = createRoot(div);
        root.render(<BitcoinGraph dataFile={dataFile} title={title} />);
        vizRootsRef.current.push(root);
      }
    });

    // Attach click handlers to wiki-links
    const wikiLinks = contentRef.current.querySelectorAll<HTMLAnchorElement>(
      ".wiki-link"
    );
    wikiLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const postName = link.getAttribute("data-post");
        if (postName) navigateToPost(postName);
      });
    });
  }, [navigateToPost]);

  useEffect(() => {
    mountVizComponents();
    return () => {
      vizRootsRef.current.forEach((root) => root.unmount());
      vizRootsRef.current = [];
    };
  }, [postContent, mountVizComponents]);

  const handleSearchChange = (
    event: React.ChangeEvent<{}>,
    value: string | null
  ) => {
    if (value) {
      setSearchTerm(value);
    } else {
      setSearchTerm("");
    }
  };

  const handlePostSelect = (
    event: React.ChangeEvent<{}>,
    value: string | null
  ) => {
    if (value) {
      setSelectedPost(value + ".md");
      setSearchTerm(value);
    }
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        options={posts.map((post) => post.replace(".md", ""))}
        value={searchTerm}
        onInputChange={(event, value) =>
          handleSearchChange(event as React.ChangeEvent<{}>, value)
        }
        onChange={(event, value) =>
          handlePostSelect(event as React.ChangeEvent<{}>, value)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for a post"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: postContent }}
      />
    </div>
  );
};

export default BlogSearch;
