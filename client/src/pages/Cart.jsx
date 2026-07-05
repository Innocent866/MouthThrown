import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Stack, IconButton, Button, Card, Divider,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion, AnimatePresence } from 'motion/react';
import QtyStepper from '../components/QtyStepper';
import { useStore } from '../store';
import { money } from '../api';

const FREE_SHIPPING_AT = 100;

export default function Cart() {
  const { cart, total, user, dispatch } = useStore();
  const navigate = useNavigate();

  const shipping = useMemo(() => (total === 0 || total >= FREE_SHIPPING_AT ? 0 : 6.99), [total]);

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Your cart is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Find something you love in the shop.</Typography>
        <Button component={Link} to="/shop" variant="contained" color="secondary">Browse products</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>Your cart</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
        <Stack spacing={2} sx={{ flex: 2, width: '100%' }}>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <Card sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    component="img" src={item.images?.[0]} alt={item.name} loading="lazy"
                    sx={{ width: 88, height: 88, borderRadius: 2, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{money(item.price)} each</Typography>
                    <Box sx={{ mt: 1 }}>
                      <QtyStepper value={item.qty} onChange={(q) => dispatch({ type: 'qty', id: item._id, qty: q })} />
                    </Box>
                  </Box>
                  <Stack alignItems="flex-end" spacing={1}>
                    <Typography fontWeight={700}>{money(item.price * item.qty)}</Typography>
                    <IconButton size="small" onClick={() => dispatch({ type: 'remove', id: item._id })} aria-label="remove">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>

        <Card sx={{ p: 3, flex: 1, width: '100%', position: { md: 'sticky' }, top: 90 }}>
          <Typography variant="h6" gutterBottom>Order summary</Typography>
          <Stack spacing={1} sx={{ my: 2 }}>
            <Row label="Subtotal" value={money(total)} />
            <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
            {total < FREE_SHIPPING_AT && (
              <Typography variant="caption" color="text.secondary">
                Free shipping on orders over {money(FREE_SHIPPING_AT)}
              </Typography>
            )}
          </Stack>
          <Divider />
          <Box sx={{ my: 2 }}>
            <Row label={<b>Total</b>} value={<b>{money(total + shipping)}</b>} />
          </Box>
          <Button
            fullWidth variant="contained" color="secondary" size="large"
            onClick={() => navigate(user ? '/checkout' : '/auth?next=/checkout')}
          >
            Checkout
          </Button>
        </Card>
      </Stack>
    </Container>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary" component="span">{label}</Typography>
      <Typography component="span">{value}</Typography>
    </Stack>
  );
}
