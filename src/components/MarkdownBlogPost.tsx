import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const MarkdownBlogPost: React.FC = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');

  useEffect(() => {
    fetch('/posts/posts.json')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetch(`/posts/${selectedPost}`)
        .then(response => response.text())
        .then(markdown => setPostContent(marked.parse(markdown)));
    }
  }, [selectedPost]);

  const handlePostChange = (event: SelectChangeEvent<string>) => {
    setSelectedPost(event.target.value as string);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="post-selector-label">Select Post</InputLabel>
        <Select
          labelId="post-selector-label"
          id="post-selector"
          value={selectedPost}
          label="Select Post"
          onChange={handlePostChange}
        >
          {posts.map((post, index) => (
            <MenuItem key={index} value={post}>
              {post.replace('.md', '')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div dangerouslySetInnerHTML={{ __html: postContent }} />
    </div>
  );
};

export default MarkdownBlogPost;
