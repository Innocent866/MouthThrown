import { Box, CircularProgress } from '@mui/material';

export default function Loader({ h = '60vh' }) {
  return (
    <Box sx={{ minHeight: h, display: 'grid', placeItems: 'center' }}>
      <CircularProgress color="secondary" />
    </Box>
  );
}
