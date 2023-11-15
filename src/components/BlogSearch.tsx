import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Paper, InputBase, IconButton, Divider, Box, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const BlogSearch: React.FC = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/posts/posts.json')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setFilteredPosts(data); // Initialize filteredPosts with all posts
      });
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetch(`/posts/${selectedPost}`)
        .then(response => response.text())
        .then(markdown => setPostContent(marked.parse(markdown)));
    }
  }, [selectedPost]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget as unknown as HTMLDivElement); // Correctly cast the target
  
    if (value !== '') {
      const filtered = posts.filter(post => post.includes(value));
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  const handlePostSelect = (post: string) => {
    setSelectedPost(post);
    setSearchTerm(post.replace('.md', ''));
    setAnchorEl(null); // Close the popover when a post is selected
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLDivElement); // Correctly cast the target
    setFilteredPosts(posts);
  };

  const getHeaderMessage = () => {
    return searchTerm ? 'Search Matches' : 'All Posts';
  };

  return (
    <div>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', marginBottom: 2 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for a post"
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
      </Paper>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          <div style={{ padding: '10px' }}>{getHeaderMessage()}</div>
          {filteredPosts.map((post, index) => (
            <div key={index} onClick={() => handlePostSelect(post)} style={{ cursor: 'pointer', padding: '10px' }}>
              {post.replace('.md', '')}
            </div>
          ))}
        </Box>
      </Popover>
      <div dangerouslySetInnerHTML={{ __html: postContent }} />
    </div>
  );
};

export default BlogSearch;
