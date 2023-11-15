import { ThemeProvider } from '@mui/material/styles';
import NavigationBar from './components/NavigationBar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import Main from './Main';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import BlogSearch from './components/BlogSearch';

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Courier, monospace', // Set the font family to Courier
  },
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  typography: {
    fontFamily: 'Courier, monospace', // Set the font family to Courier
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Black color
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(true);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Ensures consistent background */}
      <NavigationBar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div>
        {!darkMode ? 
          <Box sx={{ margin: 4, borderLeft: 5, borderColor: 'primary.main', paddingLeft: 2 }}>
            <Typography variant="h5" style={{ fontStyle: 'italic' }}>
              "Any customer can have a car painted any color that [they] want so long as it is black"
            </Typography>
            <Typography variant="subtitle1" align="right" sx={{ mt: 1 }}>
              - Henry Ford
            </Typography>
          </Box>
        : 
        <Container sx={{ padding: '4px' }}>
          <Main />
          <BlogSearch />
        </Container>}
    </div>
    </ThemeProvider>
  );
}

export default App;
