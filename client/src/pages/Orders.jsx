import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Card, Stack, Chip, Button, Divider, Box,
} from '@mui/material';
import Loader from '../components/Loader';
import { api, money, errMsg } from '../api';
import { useStore } from '../store';

export default function Orders() {
  const { user } = useStore();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let on = true;
    // backend reads the user from the token; the path param is unused
    api.get('/order/single/me')
      .then((r) => on && setOrders(r.data.orders || []))
      .catch((e) => {
        if (!on) return;
        if (e?.response?.status === 400) setOrders([]);
        else setError(errMsg(e, 'Could not load orders'));
      });
    return () => { on = false; };
  }, [user]);

  if (!user) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Sign in to see your orders</Typography>
        <Button component={Link} to="/auth?next=/orders" variant="contained" color="secondary">Sign in</Button>
      </Container>
    );
  }
  if (error) return <Container sx={{ py: 12, textAlign: 'center' }}><Typography color="error">{error}</Typography></Container>;
  if (orders === null) return <Loader />;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>My orders</Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">You haven’t placed any orders yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {orders.map((o) => (
            <Card key={o._id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {new Date(o.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </Typography>
                <Chip label={money(o.totalprice)} color="secondary" size="small" />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.5}>
                {o.orderItems.map((item, i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    <Box component="img" src={item.images} alt="" loading="lazy" sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover' }} />
                    <Typography variant="body2" sx={{ flex: 1 }} noWrap>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">×{item.quantity}</Typography>
                    <Typography variant="body2">{money(item.price * item.quantity)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
