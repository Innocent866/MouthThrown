import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container, Card, Tabs, Tab, TextField, Button, Alert, Box, Typography,
} from '@mui/material';
import { motion } from 'motion/react';
import { api, errMsg } from '../api';
import { useStore } from '../store';

const REGISTER_FIELDS = [
  ['firstname', 'First name'], ['lastname', 'Last name'], ['email', 'E-mail'],
  ['phonenumber', 'Phone number'], ['password', 'Password'], ['verifypassword', 'Verify password'],
];

export default function Auth() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // {ok, text}
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (tab === 0) {
        const { data } = await api.post('/user/login', { email: form.email, password: form.password });
        dispatch({ type: 'login', user: data.user });
        navigate(params.get('next') || '/');
      } else {
        const fd = new FormData();
        REGISTER_FIELDS.forEach(([k]) => fd.append(k, form[k] || ''));
        if (image) fd.append('image', image);
        await api.post('/user/registration', fd);
        setMsg({ ok: true, text: 'Account created — you can sign in now.' });
        setTab(0);
      }
    } catch (err) {
      setMsg({ ok: false, text: errMsg(err, 'Authentication failed') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" gutterBottom>Welcome</Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Sign in" />
            <Tab label="Create account" />
          </Tabs>

          {msg && <Alert severity={msg.ok ? 'success' : 'error'} sx={{ mb: 2 }}>{msg.text}</Alert>}

          <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
            {tab === 0 ? (
              <>
                <TextField required type="email" label="E-mail" value={form.email || ''} onChange={set('email')} />
                <TextField required type="password" label="Password" value={form.password || ''} onChange={set('password')} />
              </>
            ) : (
              <>
                {REGISTER_FIELDS.map(([key, label]) => (
                  <TextField
                    key={key} required label={label} value={form[key] || ''} onChange={set(key)}
                    type={key.includes('password') ? 'password' : key === 'email' ? 'email' : 'text'}
                  />
                ))}
                <Button component="label" variant="outlined">
                  {image ? image.name : 'Upload profile photo'}
                  <input hidden type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </Button>
              </>
            )}
            <Button type="submit" variant="contained" color="secondary" size="large" disabled={busy}>
              {busy ? 'Please wait…' : tab === 0 ? 'Sign in' : 'Create account'}
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Container>
  );
}
