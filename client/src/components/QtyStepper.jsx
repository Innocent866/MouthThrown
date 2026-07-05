import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function QtyStepper({ value, onChange, max = 99 }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 999 }}>
      <IconButton size="small" onClick={() => onChange(Math.max(1, value - 1))} aria-label="decrease">
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography sx={{ px: 1.5, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{value}</Typography>
      <IconButton size="small" onClick={() => onChange(Math.min(max, value + 1))} aria-label="increase">
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
