"use client";

import * as React from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { COURTS, findCourt, type Court } from "@/config/courts";
import { useDebouncedValue } from "@/lib/timing";

interface Props {
  value?: string;
  onChange: (courtId: string) => void;
}

const ROW_HEIGHT = 64;

/**
 * Searchable court picker. The result list is virtualized with react-window
 * and the search input is debounced so typing on low-end phones stays smooth
 * even with a full statewide court list.
 */
export default function CourtSelect({ value, onChange }: Props) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const debouncedQuery = useDebouncedValue(query, 150);

  const results: Court[] = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return COURTS;
    return COURTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.county.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);

  const selected = findCourt(value);

  const Row = React.useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const court = results[index];
      return (
        <ListItemButton
          style={style}
          key={court.id}
          selected={court.id === value}
          onClick={() => {
            onChange(court.id);
            setOpen(false);
            setQuery("");
          }}
        >
          <ListItemText
            primary={court.name}
            secondary={`${court.county} County`}
            slotProps={{ primary: { noWrap: true, sx: { fontSize: 14 } } }}
          />
        </ListItemButton>
      );
    },
    [results, value, onChange],
  );

  return (
    <Box>
      <TextField
        fullWidth
        label="Court name (from your summons)"
        placeholder="Search by court or county…"
        value={open ? query : (selected?.name ?? "")}
        onFocus={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        helperText={
          selected && !open
            ? `${selected.county} County`
            : "Start typing your county, e.g. “Harris”"
        }
      />
      {open && (
        <Paper variant="outlined" sx={{ mt: 1 }}>
          {results.length === 0 ? (
            <Typography sx={{ p: 2 }} color="text.secondary">
              No courts match — check the court name printed on your summons.
            </Typography>
          ) : (
            <FixedSizeList
              height={Math.min(4, results.length) * ROW_HEIGHT}
              width="100%"
              itemCount={results.length}
              itemSize={ROW_HEIGHT}
            >
              {Row}
            </FixedSizeList>
          )}
        </Paper>
      )}
    </Box>
  );
}
