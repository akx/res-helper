import React, { useState } from "react";
import { calculateResolutions } from "./helpers/resolutions.ts";
import useDebouncedMemo from "./hooks/useDebouncedMemo.ts";
import { NumberControl } from "./components/NumberControl.tsx";
import { ResolutionsTable } from "./components/ResolutionsTable.tsx";

const ResolutionsTableMemo = React.memo(ResolutionsTable);

const arFilters = {
  all: () => true,
  landscape: (ar: number) => ar > 1,
  portrait: (ar: number) => ar < 1,
} as const;

export default function App() {
  const [targetMpix, setTargetMpix] = useState<number>(1);
  const [pixLeeway, setPixLeeway] = useState<number>(0.1);
  const [minAR, setMinAR] = useState<number>(0.5);
  const [maxAR, setMaxAR] = useState<number>(2.0);
  const [minSize, setMinSize] = useState<number>(512);
  const [maxSize, setMaxSize] = useState<number>(2048);
  const [quantization, setQuantization] = useState<number>(64);
  const [arFilter, setARFilter] = useState<"all" | "landscape" | "portrait">(
    "all",
  );

  const setMidSize = (size: number) => {
    setTargetMpix((size * size) / 1024 / 1024);
    setMinSize(size / 2);
    setMaxSize(size * 2);
  };

  const loadSD15Preset = () => {
    setMidSize(512);
  };

  const loadSDXLPreset = () => {
    setMidSize(1024);
  };

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
        arFilter: arFilters[arFilter],
      }),
    [
      targetMpix,
      pixLeeway,
      minAR,
      maxAR,
      minSize,
      maxSize,
      quantization,
      arFilter,
    ],
    200,
  );
  return (
    <>
      <aside>
        <fieldset>
          <legend>Presets</legend>
          <div className="button-group">
            <button onClick={loadSD15Preset}>SD1.5 (512&times;512)</button>
            <button onClick={loadSDXLPreset}>SDXL (1024&times;1024)</button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Target Size</legend>
          <NumberControl
            label="Target Megapixels"
            value={targetMpix}
            min={0.01}
            step={0.5}
            sliderMax={5}
            onChange={setTargetMpix}
          />
          <NumberControl
            label="Allowed Target Leeway"
            value={pixLeeway}
            min={0}
            max={1}
            step={0.01}
            onChange={setPixLeeway}
          />
          <NumberControl
            label="Minimum Size"
            min={0}
            step={8}
            sliderMax={4096}
            value={minSize}
            onChange={setMinSize}
          />
          <NumberControl
            label="Maximum Size"
            min={0}
            step={8}
            sliderMax={4096}
            value={maxSize}
            onChange={setMaxSize}
          />
        </fieldset>
        <fieldset>
          <legend>Aspect Ratio</legend>
          <NumberControl
            label="Minimum AR"
            min={0}
            step={0.01}
            sliderMax={4}
            value={minAR}
            onChange={setMinAR}
          />
          <NumberControl
            label="Maximum AR"
            min={0}
            step={0.01}
            sliderMax={4}
            value={maxAR}
            onChange={setMaxAR}
          />
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={arFilter === "all"}
                onChange={() => setARFilter("all")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                checked={arFilter === "landscape"}
                onChange={() => setARFilter("landscape")}
              />
              Landscape
            </label>
            <label>
              <input
                type="radio"
                checked={arFilter === "portrait"}
                onChange={() => setARFilter("portrait")}
              />
              Portrait
            </label>
          </div>
        </fieldset>
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
    </>
  );
}
