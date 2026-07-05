import { createTheme } from '@mui/material/styles';

// MouthThrown brand — warm ink + amber, shared with the mobile app
export const brand = {
  ink: '#14181F',
  inkSoft: '#242B36',
  gold: '#E8A33D',
  goldDark: '#B87A1E',
  bg: '#F6F4EF',
  paper: '#FFFFFF',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: brand.ink, light: brand.inkSoft },
    secondary: { main: brand.gold, dark: brand.goldDark, contrastText: brand.ink },
    background: { default: brand.bg, paper: brand.paper },
    text: { primary: '#1C212B', secondary: '#5A616E' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Inter','Segoe UI',system-ui,-apple-system,sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 999, paddingInline: 22, paddingBlock: 8 } },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid rgba(20,24,31,0.08)', boxShadow: '0 1px 2px rgba(20,24,31,0.06)' },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
