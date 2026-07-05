import { useState } from 'react';
import {
  Container, Typography, TextField, Button, Card, Alert, Box, Stack,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { motion } from 'motion/react';
import { api, errMsg } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { data } = await api.post('/contact', form);
      setMsg({ ok: true, text: data.message });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setMsg({ ok: false, text: errMsg(err, 'Could not send your message') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Typography variant="h3" gutterBottom>Contact us</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
          <MailOutlineIcon color="secondary" fontSize="small" />
          <Typography color="text.secondary">
            We reply by e-mail, usually within one working day.
          </Typography>
        </Stack>

        <Card sx={{ p: { xs: 3, sm: 4 } }}>
          {msg && <Alert severity={msg.ok ? 'success' : 'error'} sx={{ mb: 2 }}>{msg.text}</Alert>}
          <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
            <TextField required label="Your name" value={form.name} onChange={set('name')} />
            <TextField required type="email" label="Your e-mail" value={form.email} onChange={set('email')} />
            <TextField required multiline minRows={5} label="Message" value={form.message} onChange={set('message')} />
            <Button type="submit" variant="contained" color="secondary" size="large" disabled={busy}>
              {busy ? 'Sending…' : 'Send message'}
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Container>
  );
}
