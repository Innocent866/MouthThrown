import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Rating, Chip, Button, Stack, Divider,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { motion } from 'motion/react';
import Loader from '../components/Loader';
import QtyStepper from '../components/QtyStepper';
import { useProduct } from '../hooks';
import { useStore } from '../store';
import { money } from '../api';

export default function Product() {
  const { id } = useParams();
  const product = useProduct(id);
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  if (product === null) return <Loader />;
  if (product === 'missing') {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">Product not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/shop')}>Back to shop</Button>
      </Container>
    );
  }

  const addToCart = () => dispatch({ type: 'add', item: product, qty });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>
        <Box sx={{ flex: 1 }}>
          <motion.img
            key={img}
            src={product.images?.[img]}
            alt={product.name}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 20 }}
          />
          {product.images?.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              {product.images.map((src, i) => (
                <Box
                  key={src} component="img" src={src} alt="" onClick={() => setImg(i)}
                  sx={{
                    width: 72, height: 72, objectFit: 'cover', borderRadius: 2, cursor: 'pointer',
                    outline: i === img ? '2px solid' : 'none', outlineColor: 'secondary.main',
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Chip label={product.category} size="small" />
          <Typography variant="h3" sx={{ mt: 1.5 }}>{product.name}</Typography>
          {product.brand && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>by {product.brand}</Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
            <Rating value={product.ratings?.averageRating || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.ratings?.numberOfRatings || 0} ratings
            </Typography>
          </Stack>

          <Typography variant="h4" sx={{ mt: 3 }}>{money(product.price)}</Typography>
          <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'} sx={{ mt: 0.5 }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Typography>

          <Divider sx={{ my: 3 }} />
          <Typography color="text.secondary">{product.description}</Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <QtyStepper value={qty} onChange={setQty} max={product.stock || 99} />
            <Button
              variant="contained" color="secondary" size="large" startIcon={<AddShoppingCartIcon />}
              disabled={product.stock <= 0} onClick={addToCart}
            >
              Add to cart
            </Button>
          </Stack>
          <Button sx={{ mt: 2 }} onClick={() => { addToCart(); navigate('/cart'); }} disabled={product.stock <= 0}>
            Buy now →
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
