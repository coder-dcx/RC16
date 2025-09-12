import { createMuiTheme } from '@material-ui/core/styles';

// Define custom colors
const primaryColor = '#1976d2';
const secondaryColor = '#dc004e';

// Create theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryColor,
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
      },
    },
    MuiCard: {
      root: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
  },
});

export default theme;