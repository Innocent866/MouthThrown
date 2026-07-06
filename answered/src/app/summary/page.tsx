"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { loadDraft } from "@/lib/caseStore";
import { mapAnswersToDefenses, type Defense } from "@/lib/defenses";

export default function SummaryPage() {
  const router = useRouter();
  const [defenses, setDefenses] = React.useState<Defense[]>();

  React.useEffect(() => {
    const draft = loadDraft();
    if (!draft.answers) {
      router.replace("/interview");
      return;
    }
    setDefenses(
      mapAnswersToDefenses(draft.answers, { plaintiffName: draft.plaintiffName }),
    );
  }, [router]);

  if (!defenses) return null;

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">
          {defenses.length > 0
            ? "Based on your answers, your response will include:"
            : "Your response is ready to prepare"}
        </Typography>

        {defenses.length === 0 && (
          <Alert severity="info">
            You didn&apos;t dispute any part of the lawsuit, so your Answer
            will simply appear in the case and require the plaintiff to prove
            its claims — which still prevents an automatic default judgment.
          </Alert>
        )}

        {defenses.map((d) => (
          <Paper key={d.key} variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h3" gutterBottom>
              ✓ {d.title}
            </Typography>
            <Typography color="text.secondary">{d.plainLanguage}</Typography>
          </Paper>
        ))}

        <Button
          component={Link}
          href="/preview"
          variant="contained"
          size="large"
          fullWidth
          sx={{ py: 1.5 }}
        >
          Preview my Answer — free
        </Button>
        <Button component={Link} href="/interview" variant="text" fullWidth>
          ← Change my answers
        </Button>
      </Stack>
    </Container>
  );
}
