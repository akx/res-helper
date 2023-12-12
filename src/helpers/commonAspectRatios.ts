import { Fraction, fractionToDecimal } from "./fractions.ts";

export const COMMON_ASPECT_RATIOS: Fraction[] = [
  [1, 1],
  [5, 4],
  [4, 3],
  [3, 2],
  [16, 10],
  [5, 3],
  [16, 9],
];

COMMON_ASPECT_RATIOS.push(
  ...COMMON_ASPECT_RATIOS.map((ar) => [ar[1], ar[0]] as Fraction),
);

export function getNearestCommonAspectRatio(ar: Fraction): Fraction {
  const ard = fractionToDecimal(ar);
  let nearestDistance = Infinity;
  let nearestAR = ar;
  for (const commonAR of COMMON_ASPECT_RATIOS) {
    const commonARD = fractionToDecimal(commonAR);
    const distance = Math.abs(commonARD - ard);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestAR = commonAR;
    }
  }
  return nearestAR;
}
