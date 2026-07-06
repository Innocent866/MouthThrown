"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { loadDraft } from "@/lib/caseStore";
import { formatLongDate } from "@/lib/deadline";
import { JURISDICTION } from "@/config/jurisdiction";

/**
 * Hard stop: we do not sell the product once the response deadline has
 * passed. The user needs individualized help (motion to vacate / new trial),
 * which is beyond document preparation.
 */
export default function DeadlinePassedPage() {
  const [deadline, setDeadline] = React.useState<string>();
  React.useEffect(() => {
    setDeadline(loadDraft().deadline);
  }, []);

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">
          Your response deadline has likely passed
        </Typography>
        {deadline && (
          <Alert severity="error">
            Based on the date you were served, your Answer was due by{" "}
            <strong>{formatLongDate(deadline)}</strong>.
          </Alert>
        )}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h3" gutterBottom>
            What this means
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            When a defendant doesn&apos;t respond in time, the court can enter
            a <strong>default judgment</strong> — a ruling for the plaintiff
            without a trial. A judgment can lead to garnished bank accounts and
            liens.
          </Typography>
          <Typography variant="h3" gutterBottom>
            It may not be over
          </Typography>
          <Typography color="text.secondary">
            Courts can sometimes undo a default judgment through a{" "}
            <strong>motion for new trial</strong> or <strong>motion to
            vacate</strong>, especially soon after the judgment. These motions
            have strict, short deadlines and depend on your specific facts —
            this is a situation where talking to a lawyer or legal aid
            organization quickly matters.
          </Typography>
        </Paper>
        <Button
          variant="contained"
          size="large"
          fullWidth
          href={JURISDICTION.legalAidUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ py: 1.5 }}
        >
          Find free legal help at {JURISDICTION.legalAidName}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          href={JURISDICTION.courtSelfHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {JURISDICTION.stateName} courts self-help resources
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
          Because your deadline has passed, Answered&apos;s document
          preparation service isn&apos;t the right fit for your situation, and
          we won&apos;t charge you for it.
        </Typography>
      </Stack>
    </Container>
  );
}
