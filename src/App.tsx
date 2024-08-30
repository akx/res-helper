import React, { useState } from "react";
import { calculateResolutions } from "./helpers/resolutions.ts";
import useDebouncedMemo from "./hooks/useDebouncedMemo.ts";
import { NumberControl } from "./components/NumberControl.tsx";
import { ResolutionsTable } from "./components/ResolutionsTable.tsx";
import { getDefaultState, State, stateSchema } from "./state.ts";

const ResolutionsTableMemo = React.memo(ResolutionsTable);

const arFilters = {
  all: () => true,
  landscape: (ar: number) => ar > 1,
  portrait: (ar: number) => ar < 1,
} as const;

const localStorageStateKey = "res-helper-state-v1";

function usePersistedState() {
  const [state, setState] = useState<State>(() => {
    try {
      return stateSchema.parse(
        JSON.parse(localStorage.getItem(localStorageStateKey) ?? "{}"),
      );
    } catch (e) {
      return getDefaultState();
    }
  });

  const setStateValue = React.useCallback(function setStateValue(
    key: keyof State,
    value: State[keyof State],
  ) {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(localStorageStateKey, JSON.stringify(state));
  }, [state]);
  return { state, setState, setStateValue };
}

export default function App() {
  const { state, setState, setStateValue } = usePersistedState();

  const {
    targetMpix,
    pixLeeway,
    minAR,
    maxAR,
    minSize,
    maxSize,
    quantization,
    arFilter,
    useTargetAR,
    targetAR,
    onlyTrainedResolutions,
  } = state;

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
    setState((prev) => ({
      ...prev,
      minSize: size / 2,
      maxSize: size * 2,
      targetMpix: (size * size) / 1024 / 1024,
    }));
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
            onChange={(v) => setStateValue("targetMpix", v)}
          />
          <NumberControl
            label="Allowed Target Leeway"
            value={pixLeeway}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => setStateValue("pixLeeway", v)}
          />
          <NumberControl
            label="Minimum Size"
            min={0}
            step={8}
            sliderMax={4096}
            value={minSize}
            onChange={(v) => setStateValue("minSize", v)}
          />
          <NumberControl
            label="Maximum Size"
            min={0}
            step={8}
            sliderMax={4096}
            value={maxSize}
            onChange={(v) => setStateValue("maxSize", v)}
          />
          <NumberControl
            label="Quantization"
            min={8}
            step={1}
            value={quantization}
            onChange={(v) => setStateValue("quantization", v)}
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
            onChange={(v) => setStateValue("minAR", v)}
          />
          <NumberControl
            label="Maximum AR"
            min={0}
            step={0.01}
            sliderMax={4}
            value={maxAR}
            onChange={(v) => setStateValue("maxAR", v)}
          />
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={arFilter === "all"}
                onChange={() => setStateValue("arFilter", "all")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                checked={arFilter === "landscape"}
                onChange={() => setStateValue("arFilter", "landscape")}
              />
              Landscape
            </label>
            <label>
              <input
                type="radio"
                checked={arFilter === "portrait"}
                onChange={() => setStateValue("arFilter", "portrait")}
              />
              Portrait
            </label>
          </div>
          <label>
            <input
              type="checkbox"
              checked={useTargetAR}
              onChange={(e) => setStateValue("useTargetAR", e.target.checked)}
            />
            Use target AR:&nbsp;
          </label>
          <input
            type="text"
            value={targetAR}
            onChange={(e) => setStateValue("targetAR", e.target.value)}
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
                  onChange={(e) =>
                    setStateValue("onlyTrainedResolutions", e.target.checked)
                  }
                />
                Show only SDXL trained resolutions
              </label>
            </li>
          </ul>
          <hr />
          <button onClick={() => setState(getDefaultState())}>Reset</button>
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
