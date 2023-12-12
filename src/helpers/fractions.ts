export type Fraction = [number, number];

export function fractionToDecimal(fraction: Fraction): number {
  return fraction[0] / fraction[1];
}

function greatestCommonDivisor(a: number, b: number) {
  if (b === 0) {
    return a;
  }
  return greatestCommonDivisor(b, a % b);
}

export function simplifyFraction(fraction: Fraction): Fraction {
  const gcd = greatestCommonDivisor(fraction[0], fraction[1]);
  return [fraction[0] / gcd, fraction[1] / gcd];
}

export function formatFraction(fraction: Fraction): string {
  return `${fraction[0]}:${fraction[1]}`;
}
