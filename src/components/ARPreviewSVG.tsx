import React from "react";
import { fractionToDecimal } from "../helpers/fractions.ts";

interface ARPreviewSVGProps extends React.SVGProps<SVGSVGElement> {
  ar: [number, number];
}

export const ARPreviewSVG = React.memo(function ARPreviewSVG({
  ar,
  ...props
}: ARPreviewSVGProps) {
  const arFraction = fractionToDecimal(ar);
  const viewboxSize = 20;
  const figureSize = viewboxSize * 0.9;
  const [width, height] =
    arFraction > 1
      ? [figureSize, figureSize / arFraction]
      : [figureSize * arFraction, figureSize];
  const x = (viewboxSize - width) / 2;
  const y = (viewboxSize - height) / 2;

  return (
    <svg viewBox={`0 0 ${viewboxSize} ${viewboxSize}`} {...props}>
      <rect width={width} height={height} x={x} y={y} fill="currentColor" />
    </svg>
  );
});
