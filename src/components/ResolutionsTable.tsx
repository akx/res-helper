import React from "react";
import { Resolution } from "../helpers/resolutions.ts";
import { getNearestCommonAspectRatio } from "../helpers/commonAspectRatios.ts";
import { formatFraction, fractionToDecimal } from "../helpers/fractions.ts";
import { ARPreviewSVG } from "./ARPreviewSVG.tsx";
import { CopyButton } from "./CopyButton.tsx";

function formatPercentageDelta(percentageDelta: number) {
  if (percentageDelta === 0) return "\u00B1\u20090%";
  const sign = percentageDelta > 0 ? "+" : "-";
  return `${sign}\u2009${Math.abs(percentageDelta * 100).toFixed(2)}%`;
}

interface ResolutionRowProps {
  res: Resolution;
  targetMpix: number;
  pixLeeway: number;
}

function computeDeltaBarBackground(difference: number, maximum: number) {
  const absDeltaDiff = Math.abs(difference / maximum);
  if (absDeltaDiff < 0.01) return undefined;
  const hue = difference < 0 ? 20 : 140;
  const saturation = Math.max(30, absDeltaDiff * 100);
  const lightness = 70;
  const stopPos = 50 + absDeltaDiff * 50;
  const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 50%)`;
  const innerColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 80%)`;
  const gradientDirection = difference > 0 ? "to right" : "to left";
  const gradient =
    `linear-gradient(${gradientDirection}, ` +
    "transparent 0%, transparent 50%, " +
    `${innerColor} 50%, ${color} ${stopPos}%, ` +
    `transparent ${stopPos}%, transparent 100%` +
    ")";
  return { background: gradient };
}

function ResolutionRow({ res, targetMpix, pixLeeway }: ResolutionRowProps) {
  const { width, height, arFraction, pix } = res;
  const nearestAR = getNearestCommonAspectRatio(arFraction);
  const nearestARDifference = fractionToDecimal(nearestAR) - res.ar;
  const targetMpixDifference = pix / 1024 / 1024 - targetMpix;
  return (
    <tr>
      <td>
        <CopyButton text={`${res.width}x${res.height}`}>Copy</CopyButton>
      </td>
      <td className="frac-col">
        {width}&#x2009;&times;&#x2009;{height}
      </td>
      <td className="num-col">{(pix / 1024 / 1024).toFixed(2)}</td>
      <td
        className="num-col"
        style={computeDeltaBarBackground(targetMpixDifference, pixLeeway * 2)}
      >
        {formatPercentageDelta(targetMpixDifference)}
      </td>
      <td className="frac-col">
        <ARPreviewSVG ar={arFraction} className="ar-preview" />
        &#x2009;
        {formatFraction(arFraction)}
      </td>
      <td className="num-col">{res.ar.toFixed(2)}</td>
      <td className="frac-col">
        <ARPreviewSVG ar={nearestAR} className="ar-preview" />
        &#x2009;
        {formatFraction(nearestAR)}
      </td>
      <td
        className="num-col"
        style={computeDeltaBarBackground(nearestARDifference, 1)}
      >
        {formatPercentageDelta(nearestARDifference)}
      </td>
    </tr>
  );
}

interface ResolutionsTableProps {
  resolutions: Resolution[];
  targetMpix: number;
  pixLeeway: number;
}

export function ResolutionsTable({
  targetMpix,
  resolutions,
  pixLeeway,
}: ResolutionsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Size</th>
          <th>MPix</th>
          <th>&Delta; MPix Target</th>
          <th>Aspect Ratio</th>
          <th>Aspect Ratio (decimal)</th>
          <th>Nearest Common Aspect Ratio</th>
          <th>&Delta; Common Aspect Ratio</th>
        </tr>
      </thead>
      <tbody>
        {resolutions.map((res) => (
          <ResolutionRow
            key={`${res.width}-${res.height}`}
            res={res}
            targetMpix={targetMpix}
            pixLeeway={pixLeeway}
          />
        ))}
      </tbody>
    </table>
  );
}
