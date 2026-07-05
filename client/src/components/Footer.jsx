import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Stack, Snackbar, Alert, Divider,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { api, errMsg } from '../api';
import { brand } from '../theme';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/subscribe/userSubscription', { email });
      setToast({ ok: true, msg: 'Subscribed! Watch your inbox.' });
      setEmail('');
    } catch (err) {
      setToast({ ok: false, msg: errMsg(err, 'Could not subscribe') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box component="footer" sx={{ bgcolor: brand.ink, color: 'rgba(255,255,255,0.75)', mt: 10, pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} justifyContent="space-between">
          <Box sx={{ maxWidth: 340 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Mouth<Box component="span" sx={{ color: brand.gold }}>Thrown</Box>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              Everything you love, thrown your way. Quality electronics, fashion,
              home goods and more — delivered fast.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
              <MailOutlineIcon fontSize="small" />
              <Typography variant="body2" component="a" href="mailto:hello@mouththrown.shop" sx={{ color: brand.gold, textDecoration: 'none' }}>
                hello@mouththrown.shop
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: '#fff' }}>Explore</Typography>
            {[['Shop', '/shop'], ['Cart', '/cart'], ['Contact us', '/contact'], ['My orders', '/orders']].map(([label, to]) => (
              <Typography key={to} component={Link} to={to} variant="body2" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: brand.gold } }}>
                {label}
              </Typography>
            ))}
          </Stack>

          <Box component="form" onSubmit={subscribe} sx={{ maxWidth: 360, width: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1.5 }}>
              Get deals by e-mail
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small" fullWidth required type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, input: { color: '#fff' } }}
              />
              <Button type="submit" variant="contained" color="secondary" disabled={busy}>
                Join
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="caption">
          © {new Date().getFullYear()} MouthThrown. All rights reserved.
        </Typography>
      </Container>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        <Alert severity={toast?.ok ? 'success' : 'error'} onClose={() => setToast(null)}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
