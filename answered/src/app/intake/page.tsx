"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import CourtSelect from "@/components/CourtSelect";
import { saveDraft } from "@/lib/caseStore";
import {
  calculateAnswerDeadline,
  hasDeadlinePassed,
  isValidISODate,
  todayISO,
} from "@/lib/deadline";

export default function IntakePage() {
  const router = useRouter();
  const [dateServed, setDateServed] = React.useState("");
  const [courtId, setCourtId] = React.useState<string>();
  const [caseNumber, setCaseNumber] = React.useState("");
  const [plaintiffName, setPlaintiffName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    if (!isValidISODate(dateServed)) {
      setError("Please enter the date you were served.");
      return;
    }
    if (dateServed > todayISO()) {
      setError("The date served can't be in the future.");
      return;
    }
    if (!courtId) {
      setError("Please pick the court named on your summons.");
      return;
    }
    if (!plaintiffName.trim()) {
      setError("Please enter the plaintiff's name from your summons.");
      return;
    }
    const amountClaimed = Number.parseFloat(amount.replace(/[$,\s]/g, ""));
    if (!Number.isFinite(amountClaimed) || amountClaimed <= 0) {
      setError("Please enter the amount claimed on your summons.");
      return;
    }

    const deadline = calculateAnswerDeadline(dateServed);
    saveDraft({
      dateServed,
      courtId,
      caseNumber: caseNumber.trim(),
      plaintiffName: plaintiffName.trim(),
      amountClaimed,
      deadline,
      status: "draft",
    });
    router.push(hasDeadlinePassed(deadline) ? "/deadline-passed" : "/deadline");
  }

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Typography variant="h1" gutterBottom>
        Tell us about your summons
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Copy these details from the papers you received. It takes about two
        minutes.
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Date you were served"
            type="date"
            value={dateServed}
            onChange={(e) => setDateServed(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="The day the papers were delivered to you"
            required
            fullWidth
          />
          <CourtSelect value={courtId} onChange={setCourtId} />
          <TextField
            label="Case number"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            helperText="Printed near the top of the summons (also called “cause number”)"
            fullWidth
          />
          <TextField
            label="Plaintiff name"
            value={plaintiffName}
            onChange={(e) => setPlaintiffName(e.target.value)}
            helperText="The company suing you — the first name in the case title"
            required
            fullWidth
          />
          <TextField
            label="Amount claimed"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
            required
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5 }}>
            Calculate my deadline
          </Button>
          <Tooltip title="Coming soon — for now, please type the details above">
            <span>
              <Button variant="outlined" fullWidth disabled>
                📷 Snap a photo of my summons (coming soon)
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </form>
    </Container>
  );
}
