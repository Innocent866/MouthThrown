import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardActionArea, CardMedia, CardContent, Typography, Rating, Box, Button, Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { money } from '../api';

// Memoized — re-renders only when its product changes
const ProductCard = memo(function ProductCard({ product }) {
  const { dispatch } = useStore();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ height: '100%' }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <CardActionArea component={Link} to={`/product/${product._id}`}>
          <CardMedia
            component="img"
            image={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            sx={{ height: 200, objectFit: 'cover', bgcolor: '#eee' }}
          />
          <CardContent sx={{ pb: 1 }}>
            <Chip label={product.category} size="small" sx={{ mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} noWrap>{product.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, my: 0.5 }}>
              <Rating value={product.ratings?.averageRating || 0} precision={0.5} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                ({product.ratings?.numberOfRatings || 0})
              </Typography>
            </Box>
            <Typography variant="h6">{money(product.price)}</Typography>
          </CardContent>
        </CardActionArea>
        <Box sx={{ p: 1.5, pt: 0, mt: 'auto' }}>
          <Button
            fullWidth variant="outlined" size="small" startIcon={<AddShoppingCartIcon />}
            onClick={() => dispatch({ type: 'add', item: product })}
          >
            Add to cart
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
});

export default ProductCard;
