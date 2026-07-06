import * as React from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DISCLAIMER, JURISDICTION } from "@/config/jurisdiction";

const STEPS = [
  {
    title: "1. Check your deadline",
    body: "Enter a few details from your summons and we calculate exactly how many days you have left to respond.",
  },
  {
    title: "2. Answer simple questions",
    body: "A short, plain-language interview about the debt. Your answers determine what goes in your response.",
  },
  {
    title: "3. Get your court-ready Answer",
    body: "Preview your completed Answer form free. Pay $99 once to download it with step-by-step filing instructions.",
  },
];

const FAQS = [
  {
    q: "What happens if I ignore the lawsuit?",
    a: "If you don't respond by the deadline, the court will likely enter a default judgment against you for the full amount claimed, plus interest and fees. After that, the plaintiff can try to garnish bank accounts and place liens. Responding on time protects your right to be heard.",
  },
  {
    q: "What is an Answer?",
    a: "An Answer is the official court document a defendant files to respond to a lawsuit. It tells the court which claims you deny and which defenses apply to your situation. Filing an Answer prevents an automatic default judgment.",
  },
  {
    q: "Is this legal advice?",
    a: `No. ${DISCLAIMER} Answered provides legal information and helps you prepare your own documents. If you want advice about your specific situation, a licensed attorney or legal aid organization can help.`,
  },
];

export default function LandingPage() {
  return (
    <Container maxWidth="sm" component="main" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h1" gutterBottom>
            Sued for a debt in {JURISDICTION.stateName}?
          </Typography>
          <Typography variant="h3" color="text.secondary" gutterBottom>
            Respond before your deadline — starting free.
          </Typography>
          <Button
            component={Link}
            href="/intake"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontSize: "1.1rem" }}
          >
            Check my deadline
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {DISCLAIMER}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h2" gutterBottom>
            How it works
          </Typography>
          <Stack spacing={2}>
            {STEPS.map((s) => (
              <Paper key={s.title} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h3">{s.title}</Typography>
                <Typography color="text.secondary">{s.body}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h2" gutterBottom>
            Common questions
          </Typography>
          {FAQS.map((f) => (
            <Accordion key={f.q} disableGutters>
              <AccordionSummary expandIcon={<span aria-hidden>▾</span>}>
                <Typography sx={{ fontWeight: 600 }}>{f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    </Container>
  );
}
