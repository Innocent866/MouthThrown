"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { DISCLAIMER } from "@/config/jurisdiction";

export function AppHeader() {
  return (
    <AppBar position="static" elevation={0} color="transparent" sx={{ borderBottom: "1px solid #e2e8f0", bgcolor: "white" }}>
      <Toolbar sx={{ minHeight: 56 }}>
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{ fontWeight: 800, color: "primary.main", textDecoration: "none" }}
        >
          Answered
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

/** Required on every screen. */
export function DisclaimerFooter() {
  return (
    <Box component="footer" sx={{ py: 3, mt: "auto" }}>
      <Container maxWidth="sm">
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
          {DISCLAIMER} The information provided is general legal information
          and document preparation, not a substitute for an attorney.
        </Typography>
      </Container>
    </Box>
  );
}
