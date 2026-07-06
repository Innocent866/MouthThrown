"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { loadDraft, type CaseDraft } from "@/lib/caseStore";
import { draftToAnswerPdfData } from "@/lib/pdf/fromDraft";

// Code splitting: pdf-lib + worker plumbing load only on this screen.
const PdfPreview = dynamic(() => import("@/components/PdfPreview"), {
  ssr: false,
  loading: () => (
    <Stack sx={{ alignItems: "center", py: 6 }}>
      <CircularProgress />
    </Stack>
  ),
});

export default function PreviewPage() {
  const router = useRouter();
  const [draft, setDraft] = React.useState<CaseDraft>();
  const [error, setError] = React.useState<string>();
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    const d = loadDraft();
    if (!d.answers || !d.deadline) {
      router.replace("/intake");
      return;
    }
    setDraft(d);
  }, [router]);

  const pdfData = React.useMemo(
    () => (draft ? draftToAnswerPdfData(draft) : undefined),
    [draft],
  );

  async function handleCheckout() {
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loadDraft()),
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(body.error ?? "Payment isn't available right now. Please try again.");
        return;
      }
      window.location.assign(body.url);
    } catch {
      setError("Payment isn't available right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!draft || !pdfData) return null;

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">Preview your Answer</Typography>
        <Typography color="text.secondary">
          This is your completed response, built from your answers. The
          watermark comes off when you purchase.
        </Typography>

        <PdfPreview data={pdfData} />

        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h2" gutterBottom>
            $99 — one time
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Download your court-ready Answer (no watermark), a certificate of
            service, and step-by-step filing instructions for your court.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ my: 2, textAlign: "left" }}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleCheckout}
            disabled={busy}
            sx={{ py: 1.5, mt: 1 }}
          >
            {busy ? "Opening secure checkout…" : "Get my Answer — $99"}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            Secure payment by Stripe. Settlement letter generator coming soon.
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
