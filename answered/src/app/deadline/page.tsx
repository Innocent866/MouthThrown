"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { loadDraft, type CaseDraft } from "@/lib/caseStore";
import {
  daysUntil,
  formatLongDate,
  hasDeadlinePassed,
  todayISO,
} from "@/lib/deadline";

function formatUsd(n?: number) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function DeadlinePage() {
  const router = useRouter();
  const [draft, setDraft] = React.useState<CaseDraft>();

  React.useEffect(() => {
    const d = loadDraft();
    if (!d.deadline) {
      router.replace("/intake");
      return;
    }
    if (hasDeadlinePassed(d.deadline)) {
      router.replace("/deadline-passed");
      return;
    }
    setDraft(d);
  }, [router]);

  if (!draft?.deadline) return null;

  const days = daysUntil(draft.deadline, todayISO());

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: "center", bgcolor: "primary.main", color: "white", borderRadius: 3 }}
        >
          <Typography variant="h1" component="p" sx={{ fontSize: "3.5rem", fontWeight: 800 }}>
            {days}
          </Typography>
          <Typography variant="h3" component="p">
            {days === 1 ? "day" : "days"} to respond
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9 }}>
            Your Answer is due by {formatLongDate(draft.deadline)}.
          </Typography>
        </Paper>

        <Alert severity="warning" variant="outlined">
          If you do nothing, the court will likely enter a{" "}
          <strong>default judgment</strong> against you for{" "}
          {formatUsd(draft.amountClaimed)} plus interest and fees. Wages and
          bank accounts can then be garnished.
        </Alert>

        <Typography color="text.secondary">
          Filing a response on time stops a default judgment and requires{" "}
          {draft.plaintiffName || "the plaintiff"} to prove its case. Many
          debt-collection lawsuits are dismissed once a defendant responds.
        </Typography>

        <Button
          component={Link}
          href="/signup"
          variant="contained"
          size="large"
          fullWidth
          sx={{ py: 1.5, fontSize: "1.05rem" }}
        >
          Start my response — free
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
          Free to prepare and preview. Pay only if you decide to download your
          completed Answer.
        </Typography>
      </Stack>
    </Container>
  );
}
