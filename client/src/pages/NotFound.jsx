import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Container sx={{ py: 14, textAlign: 'center' }}>
      <Typography variant="h1" color="secondary.main">404</Typography>
      <Typography variant="h5" sx={{ mt: 1, mb: 3 }}>That page doesn’t exist.</Typography>
      <Button component={Link} to="/" variant="contained" color="secondary">Back home</Button>
    </Container>
  );
}
