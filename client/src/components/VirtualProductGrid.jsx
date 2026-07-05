import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { useThrottledCallback } from '../hooks';

const ROW_H = 430;
const GAP = 16;

// One virtualized row = `cols` product cards
const Row = memo(function Row({ index, style, data: { products, cols } }) {
  const slice = products.slice(index * cols, index * cols + cols);
  return (
    <div style={style}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${GAP}px`, height: ROW_H - GAP }}>
        {slice.map((p) => <ProductCard key={p._id} product={p} />)}
      </Box>
    </div>
  );
});

// List virtualization — only visible rows are mounted, no matter the catalogue size
export default function VirtualProductGrid({ products }) {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  const onResize = useThrottledCallback((w) => setWidth(w), 200);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => onResize(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [onResize]);

  const cols = width < 460 ? 1 : width < 740 ? 2 : width < 1040 ? 3 : 4;
  const rows = Math.ceil(products.length / cols);
  const height = Math.min(rows * ROW_H, 2 * ROW_H + 120);
  const itemData = useMemo(() => ({ products, cols }), [products, cols]);

  return (
    <Box ref={boxRef}>
      {products.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          No products match your search.
        </Typography>
      ) : width > 0 && (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={rows}
          itemSize={ROW_H}
          itemData={itemData}
          overscanCount={2}
        >
          {Row}
        </FixedSizeList>
      )}
    </Box>
  );
}
