import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip, Stack } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { motion } from 'motion/react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useProducts } from '../hooks';
import { CATEGORIES } from '../data';

const PERKS = [
  { icon: <LocalShippingOutlinedIcon />, title: 'Fast delivery', text: 'Nationwide shipping in 1–3 working days.' },
  { icon: <VerifiedOutlinedIcon />, title: 'Quality promise', text: '30-day free returns on every order.' },
  { icon: <SupportAgentOutlinedIcon />, title: 'Real support', text: 'Reach us any time by e-mail — we reply fast.' },
];

export default function Home() {
  const products = useProducts();
  const featured = useMemo(() => (products || []).slice(0, 8), [products]);

  return (
    <>
      <Hero />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {/* perks */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
          {PERKS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ color: 'secondary.main', mt: 0.5 }}>{p.icon}</Box>
                <Box>
                  <Typography fontWeight={700}>{p.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{p.text}</Typography>
                </Box>
              </Stack>
            </motion.div>
          ))}
        </Box>

        {/* categories */}
        <Typography variant="h4" sx={{ mt: 8, mb: 2 }}>Shop by category</Typography>
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} component={Link} to={`/shop?category=${encodeURIComponent(c)}`} clickable />
          ))}
        </Stack>

        {/* featured */}
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mt: 8, mb: 3 }}>
          <Typography variant="h4">Featured picks</Typography>
          <Button component={Link} to="/shop">View all</Button>
        </Stack>
        {products === null ? (
          <Loader h="30vh" />
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2 }}>
            {featured.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
                style={{ height: '100%' }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
