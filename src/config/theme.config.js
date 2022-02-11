import { createTheme } from '@mui/material/styles';

export const themeConfig = createTheme({
  typography: {
    fontFamily: 'Montserrat Alternates, sans-serif, cursive',
    fontSize: 13,
  },
  components: {
    MuiCard: {
      backgroundColor: '#1f2937'
    },
    MuiCardContent: {
      backgroundColor: '#1f2937'
    }
  },
  palette: {
    backgroundColor: '#bbb',
    primary: {
      main: '#f66810'
    },
    secondary: {
      main: '#ef4444'
    },
    info: {
      main: '#312881'
    },
    mode: 'dark'
  },
});