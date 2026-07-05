import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'motion/react';
import { brand } from '../theme';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function Hero() {
  return (
    <Box sx={{ bgcolor: brand.ink, color: '#fff', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={6} sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ flex: 1 }}>
            <motion.div {...fadeUp(0)}>
              <Typography variant="overline" sx={{ color: brand.gold, letterSpacing: 3 }}>
                NEW SEASON — NEW ARRIVALS
              </Typography>
            </motion.div>
            <motion.div {...fadeUp(0.1)}>
              <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 56 }, lineHeight: 1.1, mt: 1 }}>
                Everything you love,{' '}
                <Box component="span" sx={{ color: brand.gold }}>thrown your way.</Box>
              </Typography>
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <Typography sx={{ mt: 2.5, color: 'rgba(255,255,255,0.72)', maxWidth: 480 }}>
                Electronics, fashion, home and more — hand-picked quality, fair prices,
                and delivery that keeps up with you.
              </Typography>
            </motion.div>
            <motion.div {...fadeUp(0.3)}>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button component={Link} to="/shop" variant="contained" color="secondary" size="large" endIcon={<ArrowForwardIcon />}>
                  Shop now
                </Button>
                <Button component={Link} to="/contact" variant="outlined" size="large" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Contact us
                </Button>
              </Stack>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1, display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {[0, 1, 2].map((i) => (
              <motion.img
                key={i}
                src={`https://picsum.photos/seed/hero${i}/420/${i === 1 ? 560 : 420}`}
                alt=""
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                style={{
                  width: '100%', borderRadius: 20, objectFit: 'cover',
                  gridRow: i === 1 ? 'span 2' : 'auto',
                }}
              />
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
