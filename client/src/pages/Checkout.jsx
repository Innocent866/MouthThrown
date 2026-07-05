import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Card, Stack, Alert, Box, Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'motion/react';
import { api, money, errMsg } from '../api';
import { useStore } from '../store';

const RECIPIENT = [
  ['firstname', 'First name'], ['lastname', 'Last name'],
  ['email', 'E-mail'], ['phonenumber', 'Phone number'],
];
const ADDRESS = [
  ['city', 'City'], ['street', 'Street (max 15 chars)'],
  ['housenumber', 'House number'], ['busstop', 'Nearest bus stop'],
];

export default function Checkout() {
  const { cart, total, user, dispatch } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: user?.email || '', firstname: user?.firstname || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const orderItems = useMemo(() => cart.map((i) => ({
    title: i.name,
    description: i.description,
    quantity: i.qty,
    images: i.images?.[0] || '',
    price: i.price,
  })), [cart]);

  if (!user) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Please sign in to check out</Typography>
        <Button component={Link} to="/auth?next=/checkout" variant="contained" color="secondary">Sign in</Button>
      </Container>
    );
  }

  if (done) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 88 }} />
        </motion.div>
        <Typography variant="h4" sx={{ mt: 2 }}>Order placed!</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          Thank you — a confirmation is on its way. Track it under “My orders”.
        </Typography>
        <Button component={Link} to="/orders" variant="contained" color="secondary">View my orders</Button>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Nothing to check out yet</Typography>
        <Button component={Link} to="/shop" variant="contained" color="secondary">Browse products</Button>
      </Container>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/order/create', {
        orderItems,
        recipient: {
          firstname: form.firstname, lastname: form.lastname,
          email: form.email, phonenumber: form.phonenumber,
        },
        address: {
          city: form.city, street: form.street,
          housenumber: form.housenumber, busstop: form.busstop,
        },
        totalprice: total,
      });
      dispatch({ type: 'clear' });
      setDone(true);
    } catch (err) {
      setError(errMsg(err, 'Could not place the order'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>Checkout</Typography>
      <Stack component="form" onSubmit={submit} direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
        <Card sx={{ p: 3, flex: 2, width: '100%' }}>
          <Typography variant="h6" gutterBottom>Recipient</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            {RECIPIENT.map(([key, label]) => (
              <TextField
                key={key} required label={label} value={form[key] || ''} onChange={set(key)}
                type={key === 'email' ? 'email' : 'text'}
              />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>Delivery address</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {ADDRESS.map(([key, label]) => (
              <TextField
                key={key} required label={label} value={form[key] || ''} onChange={set(key)}
                inputProps={key === 'street' ? { maxLength: 15 } : undefined}
              />
            ))}
          </Box>
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
        </Card>

        <Card sx={{ p: 3, flex: 1, width: '100%' }}>
          <Typography variant="h6" gutterBottom>Your order</Typography>
          <Stack spacing={1} sx={{ my: 2 }}>
            {cart.map((i) => (
              <Stack key={i._id} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '70%' }}>
                  {i.qty} × {i.name}
                </Typography>
                <Typography variant="body2">{money(i.price * i.qty)}</Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={700}>{money(total)}</Typography>
          </Stack>
          <Button type="submit" fullWidth variant="contained" color="secondary" size="large" disabled={busy}>
            {busy ? 'Placing order…' : 'Place order'}
          </Button>
        </Card>
      </Stack>
    </Container>
  );
}
