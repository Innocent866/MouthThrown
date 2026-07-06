"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { loadDraft, saveDraft, type CaseDraft } from "@/lib/caseStore";
import { findCourt } from "@/config/courts";
import { formatLongDate } from "@/lib/deadline";

function FilingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [draft, setDraft] = React.useState<CaseDraft>();
  const [state, setState] = React.useState<"checking" | "paid" | "unpaid">("checking");
  const [downloading, setDownloading] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    const d = loadDraft();
    if (!d.deadline) {
      router.replace("/intake");
      return;
    }
    setDraft(d);

    const knownSession = sessionId ?? d.stripeSessionId;
    if (d.status === "paid" && !sessionId) {
      setState("paid");
      return;
    }
    if (!knownSession) {
      setState("unpaid");
      return;
    }
    fetch(`/api/verify-payment?session_id=${encodeURIComponent(knownSession)}`)
      .then((r) => r.json())
      .then((body: { paid?: boolean }) => {
        if (body.paid) {
          saveDraft({ status: "paid", stripeSessionId: knownSession });
          setState("paid");
        } else {
          setState("unpaid");
        }
      })
      .catch(() => setState("unpaid"));
  }, [router, sessionId]);

  async function handleDownload() {
    setDownloading(true);
    setError(undefined);
    try {
      const current = loadDraft();
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: current, sessionId: current.stripeSessionId ?? sessionId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Couldn't generate your PDF. Please try again.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Answer.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Couldn't generate your PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (!draft) return null;

  if (state === "checking") {
    return (
      <Stack sx={{ alignItems: "center", py: 8 }}>
        <CircularProgress />
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Confirming your payment…
        </Typography>
      </Stack>
    );
  }

  if (state === "unpaid") {
    return (
      <Stack spacing={3} sx={{ py: 4 }}>
        <Alert severity="warning">
          We couldn&apos;t confirm a payment for this case yet.
        </Alert>
        <Button variant="contained" size="large" onClick={() => router.push("/preview")}>
          Back to preview &amp; checkout
        </Button>
      </Stack>
    );
  }

  const court = findCourt(draft.courtId);
  const steps = [
    "Download and print 3 copies of your Answer.",
    "Sign each copy in blue ink.",
    `File at the court clerk: ${court?.clerkAddress ?? "the clerk's office listed on your summons"} — bring your case number${draft.caseNumber ? ` (${draft.caseNumber})` : ""}.`,
    "Mail one copy to the plaintiff's attorney at the address shown on your summons, then fill in the mailing date on the Certificate of Service page.",
    "Keep one file-stamped copy for yourself.",
  ];

  return (
    <Stack spacing={3}>
      <Alert severity="success">
        Payment confirmed — your Answer is ready to download and file
        {draft.deadline ? ` by ${formatLongDate(draft.deadline)}` : ""}.
      </Alert>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleDownload}
        disabled={downloading}
        sx={{ py: 1.5 }}
      >
        {downloading ? "Preparing your PDF…" : "⬇ Download my Answer (PDF)"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h2" sx={{ px: 1, pt: 1 }}>
          Filing checklist
        </Typography>
        {court?.filingNotes && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            {court.name}: {court.filingNotes}
          </Typography>
        )}
        <List>
          {steps.map((step, i) => (
            <ListItem key={i} disablePadding>
              <ListItemIcon>
                <Checkbox
                  checked={!!checked[i]}
                  onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                />
              </ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom>
          What happens next
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          After you file, the court notifies the plaintiff. Many debt-buyer
          plaintiffs dismiss cases once a defendant responds, because they must
          now prove ownership of the debt with real records.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          If the case continues, the court will schedule a hearing or trial —
          typically several weeks to a few months out. You&apos;ll get notice
          by mail, so keep your address current with the clerk.
        </Typography>
        <Typography color="text.secondary">
          Preparing for a hearing: bring your file-stamped Answer, any records
          about the debt (statements, letters, payment history), and arrive
          early. If the plaintiff offers to settle, you can negotiate at any
          time — getting any agreement in writing before the hearing is a
          common practice.
        </Typography>
      </Paper>
    </Stack>
  );
}

export default function FilingPage() {
  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <React.Suspense fallback={null}>
        <FilingContent />
      </React.Suspense>
    </Container>
  );
}
