import React from "react";

interface NumberControlProps {
  onChange: (value: number) => void;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  sliderMin?: number;
  sliderMax?: number;
}

export function NumberControl({
  label,
  max,
  min,
  sliderMin,
  sliderMax,
  onChange,
  step,
  value,
}: NumberControlProps) {
  return (
    <div className="num-control">
      <label>
        <span>{label}</span>
        <div>
          <input
            type="range"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            min={sliderMin ?? min}
            max={sliderMax ?? max}
            step={step}
          />
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </label>
    </div>
  );
}
