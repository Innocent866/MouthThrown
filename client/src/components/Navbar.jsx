import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Container, Box, Button, IconButton, Badge, Drawer,
  List, ListItemButton, ListItemText, Typography, Menu, MenuItem, Divider,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import { useStore } from '../store';
import { useThrottledCallback } from '../hooks';
import { brand } from '../theme';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, count, dispatch } = useStore();
  const navigate = useNavigate();
  const [elevated, setElevated] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);

  // throttled scroll listener drives the elevated app-bar style
  const onScroll = useThrottledCallback(() => setElevated(window.scrollY > 8), 150);
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const logout = () => {
    setAnchor(null);
    dispatch({ type: 'logout' });
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: elevated ? 'rgba(20,24,31,0.92)' : brand.ink,
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transition: 'background-color .25s',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <IconButton color="inherit" sx={{ display: { md: 'none' } }} onClick={() => setDrawer(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>

            <Typography
              component={Link} to="/" variant="h6"
              sx={{ color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em', flexShrink: 0 }}
            >
              Mouth<Box component="span" sx={{ color: brand.gold }}>Thrown</Box>
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, gap: 0.5 }}>
              {LINKS.map((l) => (
                <Button key={l.to} component={Link} to={l.to} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {l.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton color="inherit" component={Link} to="/cart" aria-label="cart">
              <Badge badgeContent={count} color="secondary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <Button
                  onClick={(e) => setAnchor(e.currentTarget)}
                  startIcon={<PersonOutlineIcon />}
                  sx={{ color: '#fff', display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  {user.firstname}
                </Button>
                <IconButton color="inherit" sx={{ display: { sm: 'none' } }} onClick={(e) => setAnchor(e.currentTarget)}>
                  <PersonOutlineIcon />
                </IconButton>
                <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
                  <MenuItem component={Link} to="/orders" onClick={() => setAnchor(null)}>My orders</MenuItem>
                  <Divider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/auth" variant="contained" color="secondary" size="small" sx={{ ml: 1 }}>
                Sign in
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer open={drawer} onClose={() => setDrawer(false)}>
        <List sx={{ width: 240, pt: 3 }}>
          {[...LINKS, { label: 'Cart', to: '/cart' }, user && { label: 'My orders', to: '/orders' }]
            .filter(Boolean)
            .map((l) => (
              <ListItemButton key={l.to} component={Link} to={l.to} onClick={() => setDrawer(false)}>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary={l.label} />
              </ListItemButton>
            ))}
        </List>
      </Drawer>
    </>
  );
}
