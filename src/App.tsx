import React, { useState } from "react";
import { calculateResolutions } from "./helpers/resolutions.ts";
import useDebouncedMemo from "./hooks/useDebouncedMemo.ts";
import { NumberControl } from "./components/NumberControl.tsx";
import { ResolutionsTable } from "./components/ResolutionsTable.tsx";

const ResolutionsTableMemo = React.memo(ResolutionsTable);

export default function App() {
  const [targetMpix, setTargetMpix] = useState<number>(1);
  const [pixLeeway, setPixLeeway] = useState<number>(0.1);
  const [minAR, setMinAR] = useState<number>(0.5);
  const [maxAR, setMaxAR] = useState<number>(2.0);
  const [minSize, setMinSize] = useState<number>(512);
  const [maxSize, setMaxSize] = useState<number>(2048);
  const [quantization, setQuantization] = useState<number>(64);
  const resolutions = useDebouncedMemo(
    () =>
      calculateResolutions({
        targetMpix,
        pixLeeway,
        minAR,
        maxAR,
        minSize,
        maxSize,
        quantization,
      }),
    [targetMpix, pixLeeway, minAR, maxAR, minSize, maxSize, quantization],
    200,
  );

  return (
    <div id="container">
      <aside>
        <NumberControl
          label="Target Megapixels"
          value={targetMpix}
          min={0.01}
          step={0.5}
          sliderMax={5}
          onChange={setTargetMpix}
        />
        <NumberControl
          label="Pix Leeway"
          value={pixLeeway}
          min={0}
          max={1}
          step={0.01}
          onChange={setPixLeeway}
        />
        <NumberControl
          label="Min AR"
          min={0}
          step={0.01}
          sliderMax={4}
          value={minAR}
          onChange={setMinAR}
        />
        <NumberControl
          label="Max AR"
          min={0}
          step={0.01}
          sliderMax={4}
          value={maxAR}
          onChange={setMaxAR}
        />
        <NumberControl
          label="Min Size"
          min={0}
          step={8}
          sliderMax={4096}
          value={minSize}
          onChange={setMinSize}
        />
        <NumberControl
          label="Max Size"
          min={0}
          step={8}
          sliderMax={4096}
          value={maxSize}
          onChange={setMaxSize}
        />
        <NumberControl
          label="Quantization"
          min={8}
          step={1}
          value={quantization}
          onChange={setQuantization}
        />
      </aside>
      <main>
        <ResolutionsTableMemo
          resolutions={resolutions}
          targetMpix={targetMpix}
          pixLeeway={pixLeeway}
        />
      </main>
    </div>
  );
}
