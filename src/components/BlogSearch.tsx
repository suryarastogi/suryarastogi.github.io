import React, { useState, useEffect } from "react";
import { marked } from "marked";
import {
  Autocomplete,
  TextField,
} from "@mui/material";

const BlogSearch: React.FC = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");

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
        .then((markdown) => setPostContent(marked.parse(markdown)))
        .catch((error) => console.error("Error fetching post content:", error));
    }
  }, [selectedPost]);

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
      <div dangerouslySetInnerHTML={{ __html: postContent }} />
    </div>
  );
};

export default BlogSearch;
