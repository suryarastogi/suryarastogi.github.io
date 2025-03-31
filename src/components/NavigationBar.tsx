import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TwitterIcon from '@mui/icons-material/Twitter';
import { AppBar, Toolbar, Typography } from '@mui/material';


// Define the type for the props
interface NavigationBarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

// Adjust the function component definition to correctly receive props
const NavigationBar: React.FC<NavigationBarProps> = ({ toggleDarkMode, darkMode }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Surya Rastogi
        </Typography>
        
        <IconButton color="inherit" href="https://x.com/TheImperialDuke">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit" href="https://github.com/suryarastogi">
          <GitHubIcon />
        </IconButton>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;