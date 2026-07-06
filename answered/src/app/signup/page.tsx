"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { saveDraft } from "@/lib/caseStore";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your full legal name — it goes on your Answer.");
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabaseBrowser();
      if (supabase) {
        const { error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
          setError(authError.message);
          return;
        }
      }
      const draft = saveDraft({ email, defendantName: fullName.trim() });
      // Persist the case and schedule 7/3/1-day reminder emails (no-op in demo mode).
      void fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      }).catch(() => {});
      router.push("/interview");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Typography variant="h1" gutterBottom>
        Create your free account
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        We&apos;ll save your progress and email you reminders at 7, 3, and 1
        days before your deadline so you never miss it.
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Your full legal name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            helperText="Exactly as it appears on the summons"
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="At least 8 characters"
            required
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={busy}
            sx={{ py: 1.5 }}
          >
            {busy ? "Creating account…" : "Continue to my response"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
