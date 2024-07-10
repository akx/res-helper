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
  const [useTargetAR, setUseTargetAR] = useState<boolean>(false);
  const [targetAR, setTargetAR] = useState<string>("1");
  const [onlyTrainedResolutions, setOnlyTrainedResolutions] =
    useState<boolean>(false);

  const parsedTargetAR = React.useMemo(() => {
    if (!useTargetAR) return null;
    const m = targetAR.match(/^(\d+)\s*[:/x]\s*(\d+)$/);
    if (m) {
      const parsedAr = Number(m[1]) / Number(m[2]);
      if (!isNaN(parsedAr) && parsedAr > 0) return parsedAr;
    }
    const parsedAr = Number(targetAR);
    if (isNaN(parsedAr) || parsedAr < 0) return null;
    return parsedAr;
  }, [useTargetAR, targetAR]);

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
    (lastDeps, currentDeps) => {
      // Update immediately if a string or boolean value is changed, otherwise
      // debounce a bit.
      if (lastDeps.length !== currentDeps.length) return 0;
      for (let i = 0; i < lastDeps.length; i++) {
        if (
          lastDeps[i] !== currentDeps[i] &&
          typeof currentDeps[i] !== "number"
        )
          return 0;
      }
      return 100;
    },
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
          <NumberControl
            label="Quantization"
            min={8}
            step={1}
            value={quantization}
            onChange={setQuantization}
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
          <label>
            <input
              type="checkbox"
              checked={useTargetAR}
              onChange={() => setUseTargetAR(!useTargetAR)}
            />
            Use target AR:&nbsp;
          </label>
          <input
            type="text"
            value={targetAR}
            onChange={(e) => setTargetAR(e.target.value)}
            disabled={!useTargetAR}
          />
        </fieldset>

        <fieldset>
          <legend>Help</legend>
          <ul>
            <li>
              <a href="https://www.reddit.com/r/StableDiffusion/comments/15c3rf6/sdxl_resolution_cheat_sheet/">
                SDXL trained resolutions
              </a>{" "}
              are marked with a golden background.
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={onlyTrainedResolutions}
                  onChange={(e) => setOnlyTrainedResolutions(e.target.checked)}
                />
                Show only SDXL trained resolutions
              </label>
            </li>
          </ul>
        </fieldset>
      </aside>
      <main>
        <ResolutionsTableMemo
          resolutions={resolutions}
          targetMpix={targetMpix}
          pixLeeway={pixLeeway}
          targetAR={parsedTargetAR}
          onlyTrainedResolutions={onlyTrainedResolutions}
        />
      </main>
    </>
  );
}
