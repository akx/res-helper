import { Fraction, simplifyFraction } from "./fractions.ts";

function quantize(n: number, q: number): number {
  return Math.round(n / q) * q;
}

interface ResolutionCalculationOptions {
  targetMpix: number;
  pixLeeway: number;
  minAR: number;
  maxAR: number;
  quantization: number;
  minSize: number;
  maxSize: number;
  arFilter: (ar: number) => boolean;
}

export interface Resolution {
  width: number;
  height: number;
  ar: number;
  arFraction: Fraction;
  pix: number;
}

export function calculateResolutions({
  targetMpix,
  pixLeeway,
  minAR,
  maxAR,
  minSize,
  maxSize,
  quantization,
  arFilter,
}: ResolutionCalculationOptions): Resolution[] {
  const targetPix = targetMpix * 1024 * 1024;
  const pixLeewayMultiplier = 1 + pixLeeway;
  const minPix = targetPix / pixLeewayMultiplier;
  const maxPix = targetPix * pixLeewayMultiplier;

  const seenResolutions = new Set<string>();
  const options: Resolution[] = [];

  for (
    let w = quantize(minSize, quantization);
    w < maxSize;
    w += quantization
  ) {
    for (
      let h = quantize(minSize, quantization);
      h < maxSize;
      h += quantization
    ) {
      const width = quantize(w, quantization);
      const height = quantize(h, quantization);
      const pix = width * height;
      const ar = width / height;

      if (!arFilter(ar)) continue;

      if (minPix <= pix && pix <= maxPix && minAR <= ar && ar <= maxAR) {
        const resolutionKey = `${width}-${height}`;
        if (seenResolutions.has(resolutionKey)) {
          continue;
        }
        seenResolutions.add(resolutionKey);
        options.push({
          width: width,
          height: height,
          ar,
          pix,
          arFraction: simplifyFraction([width, height]),
        });
      }
    }
  }

  return options.sort((a, b) => a.ar - b.ar);
}
