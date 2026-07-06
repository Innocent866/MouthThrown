"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {
  INTERVIEW_QUESTIONS,
  type InterviewAnswers,
  type InterviewQuestion,
} from "@/lib/interview";
import { loadDraft, saveDraft } from "@/lib/caseStore";

function formatUsd(n?: number) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/** Memoized answer button — only re-renders when its selected state changes. */
const OptionButton = React.memo(function OptionButton({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <Button
      variant={selected ? "contained" : "outlined"}
      size="large"
      fullWidth
      onClick={() => onSelect(value)}
      sx={{ py: 1.5, justifyContent: "flex-start" }}
    >
      {label}
    </Button>
  );
});

function QuestionScreen({
  question,
  answer,
  plaintiffName,
  amountClaimed,
  onAnswer,
}: {
  question: InterviewQuestion;
  answer?: string;
  plaintiffName: string;
  amountClaimed: string;
  onAnswer: (value: string) => void;
}) {
  const prompt = question.prompt
    .replace("{plaintiff}", plaintiffName)
    .replace("{amount}", amountClaimed);
  const [dateValue, setDateValue] = React.useState(
    answer && answer !== "unknown" ? answer : "",
  );

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        {prompt}
      </Typography>
      {question.helpText && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {question.helpText}
        </Typography>
      )}
      {question.type === "choice" ? (
        <Stack spacing={1.5}>
          {question.options!.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              value={opt.value}
              selected={answer === opt.value}
              onSelect={onAnswer}
            />
          ))}
        </Stack>
      ) : (
        <Stack spacing={1.5}>
          <TextField
            type="date"
            label="Approximate date of last payment"
            slotProps={{ inputLabel: { shrink: true } }}
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            size="large"
            disabled={!dateValue}
            onClick={() => onAnswer(dateValue)}
            sx={{ py: 1.5 }}
          >
            Continue
          </Button>
          <Button variant="text" onClick={() => onAnswer("unknown")}>
            I don&apos;t remember
          </Button>
        </Stack>
      )}
    </>
  );
}

export default function InterviewPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<InterviewAnswers>({});
  const [draftMeta, setDraftMeta] = React.useState({ plaintiff: "", amount: "" });
  const [ready, setReady] = React.useState(false);
  // useTransition keeps the tap responsive while the next step renders.
  const [, startTransition] = React.useTransition();

  React.useEffect(() => {
    const draft = loadDraft();
    if (!draft.deadline) {
      router.replace("/intake");
      return;
    }
    setAnswers(draft.answers ?? {});
    setDraftMeta({
      plaintiff: draft.plaintiffName ?? "the plaintiff",
      amount: formatUsd(draft.amountClaimed),
    });
    setReady(true);
  }, [router]);

  const question = INTERVIEW_QUESTIONS[step];
  const progress = (step / INTERVIEW_QUESTIONS.length) * 100;

  const handleAnswer = React.useCallback(
    (value: string) => {
      const nextAnswers = { ...answers, [question.key]: value };
      setAnswers(nextAnswers);
      saveDraft({ answers: nextAnswers });
      startTransition(() => {
        if (step + 1 >= INTERVIEW_QUESTIONS.length) {
          router.push("/summary");
        } else {
          setStep(step + 1);
        }
      });
    },
    [answers, question, step, router],
  );

  if (!ready) return null;

  return (
    <Container maxWidth="sm" component="main" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="caption" color="text.secondary">
          Question {step + 1} of {INTERVIEW_QUESTIONS.length}
        </Typography>
      </Box>

      <QuestionScreen
        key={question.key}
        question={question}
        answer={answers[question.key]}
        plaintiffName={draftMeta.plaintiff}
        amountClaimed={draftMeta.amount}
        onAnswer={handleAnswer}
      />

      {step > 0 && (
        <Button sx={{ mt: 3 }} onClick={() => startTransition(() => setStep(step - 1))}>
          ← Back
        </Button>
      )}
    </Container>
  );
}
