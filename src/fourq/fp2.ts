import { fpAdd, fpDiv2, fpInv, fpMod, fpMul, fpNeg, fpSqr, fpSqrt, fpSub, type Fp } from "./fp.js";

export type Fp2 = Readonly<{
  a: Fp; // real
  b: Fp; // imag, i^2 = -1
}>;

export function fp2(a: bigint, b: bigint): Fp2 {
  return { a: fpMod(a), b: fpMod(b) };
}

export function fp2Zero(): Fp2 {
  return { a: 0n, b: 0n };
}

export function fp2One(): Fp2 {
  return { a: 1n, b: 0n };
}

export function fp2Eq(x: Fp2, y: Fp2): boolean {
  return x.a === y.a && x.b === y.b;
}

export function fp2IsZero(x: Fp2): boolean {
  return x.a === 0n && x.b === 0n;
}

export function fp2Add(x: Fp2, y: Fp2): Fp2 {
  return { a: fpAdd(x.a, y.a), b: fpAdd(x.b, y.b) };
}

export function fp2Sub(x: Fp2, y: Fp2): Fp2 {
  return { a: fpSub(x.a, y.a), b: fpSub(x.b, y.b) };
}

export function fp2Neg(x: Fp2): Fp2 {
  return { a: fpNeg(x.a), b: fpNeg(x.b) };
}

export function fp2Mul(x: Fp2, y: Fp2): Fp2 {
  // (a+bi)(c+di) = (ac - bd) + (ad + bc)i
  const ac = fpMul(x.a, y.a);
  const bd = fpMul(x.b, y.b);
  const ad = fpMul(x.a, y.b);
  const bc = fpMul(x.b, y.a);
  return { a: fpSub(ac, bd), b: fpAdd(ad, bc) };
}

export function fp2Sqr(x: Fp2): Fp2 {
  // (a+bi)^2 = (a^2 - b^2) + 2ab i
  const aa = fpSqr(x.a);
  const bb = fpSqr(x.b);
  const twoab = fpAdd(fpMul(x.a, x.b), fpMul(x.a, x.b));
  return { a: fpSub(aa, bb), b: twoab };
}

export function fp2Inv(x: Fp2): Fp2 {
  // (a+bi)^-1 = (a-bi)/(a^2+b^2)
  const denom = fpAdd(fpSqr(x.a), fpSqr(x.b));
  const invDenom = fpInv(denom);
  return { a: fpMul(x.a, invDenom), b: fpMul(fpNeg(x.b), invDenom) };
}

export function fp2Div2(x: Fp2): Fp2 {
  return { a: fpDiv2(x.a), b: fpDiv2(x.b) };
}

export function fp2Sqrt(x: Fp2): Fp2 | null {
  // For i^2 = -1: if x = a + bi, compute:
  // t = sqrt(a^2 + b^2)
  // r = sqrt((a + t)/2)
  // s = b / (2r)
  // then (r + si)^2 = x
  if (x.b === 0n) {
    const r = fpSqrt(x.a);
    if (r === null) return null;
    return { a: r, b: 0n };
  }

  const t = fpSqrt(fpAdd(fpSqr(x.a), fpSqr(x.b)));
  if (t === null) return null;

  const twoInv = fpInv(2n);
  let r = fpSqrt(fpMul(fpAdd(x.a, t), twoInv));
  if (r === null) {
    r = fpSqrt(fpMul(fpSub(x.a, t), twoInv));
    if (r === null) return null;
  }
  if (r === 0n) return null;

  const inv2r = fpInv(fpAdd(r, r));
  const s = fpMul(x.b, inv2r);

  const candidate = { a: r, b: s };
  if (!fp2Eq(fp2Sqr(candidate), x)) {
    const negCandidate = fp2Neg(candidate);
    if (!fp2Eq(fp2Sqr(negCandidate), x)) return null;
    return negCandidate;
  }
  return candidate;
}

