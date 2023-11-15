import * as React from 'react';
import { Typography, Box, Button } from '@mui/material';
import Link from '@mui/material/Link';

const Main: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4">Data Scientist & Researcher</Typography>
      <Typography variant="h5">Visualisations, Data, and AI</Typography>
      <Typography variant="body1">
        Senior Staff Data Scientist @ {<Link href="https://www.chainalysis.com">Chainalysis Research</Link>}
      </Typography>
    </Box>
  );
};

export default Main;