"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { AnswerPdfData } from "@/lib/pdf/answerDocument";
import { throttle } from "@/lib/timing";

type WorkerResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; error: string };

/**
 * Renders the watermarked Answer preview. Generation happens in a Web Worker;
 * this component is itself loaded lazily (next/dynamic) so pdf-lib never
 * lands in the main bundle.
 */
export default function PdfPreview({ data }: { data: AnswerPdfData }) {
  const [url, setUrl] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const workerRef = React.useRef<Worker>();

  React.useEffect(() => {
    const worker = new Worker(
      new URL("../workers/pdfPreview.worker.ts", import.meta.url),
    );
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<WorkerResult>) => {
      if (e.data.ok) {
        const blob = new Blob([e.data.bytes as BlobPart], { type: "application/pdf" });
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      } else {
        setError(e.data.error);
      }
    };
    return () => {
      worker.terminate();
      setUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return undefined;
      });
    };
  }, []);

  // Throttled so rapid data changes (e.g. edits upstream) can't queue a
  // regeneration storm in the worker.
  const generate = React.useMemo(
    () =>
      throttle((d: AnswerPdfData) => {
        workerRef.current?.postMessage(d);
      }, 500),
    [],
  );

  React.useEffect(() => {
    generate(data);
  }, [data, generate]);

  if (error) {
    return (
      <Typography color="error">
        Couldn&apos;t generate the preview: {error}
      </Typography>
    );
  }
  if (!url) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress />
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Preparing your preview…
        </Typography>
      </Box>
    );
  }
  return (
    <>
      <Box
        component="iframe"
        src={url}
        title="Answer preview (watermarked)"
        sx={{
          width: "100%",
          height: { xs: 420, sm: 560 },
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          bgcolor: "white",
        }}
      />
      <Button href={url} target="_blank" rel="noopener" size="small" sx={{ mt: 1 }}>
        Open preview in a new tab
      </Button>
    </>
  );
}
