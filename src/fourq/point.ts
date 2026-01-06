import { fpAdd, fpNeg, fpSub, type Fp } from "./fp.js";
import {
  fp2,
  fp2Add,
  fp2Div2,
  fp2Eq,
  fp2Inv,
  fp2IsZero,
  fp2Mul,
  fp2Neg,
  fp2One,
  fp2Sqr,
  fp2Sub,
  fp2Zero,
  type Fp2,
} from "./fp2.js";
import { FOURQ_BASE_X, FOURQ_BASE_Y, FOURQ_D } from "./params.js";

export type PointExt = Readonly<{
  X: Fp2;
  Y: Fp2;
  Z: Fp2;
  T: Fp2;
}>;

export type PointAffine = Readonly<{
  x: Fp2;
  y: Fp2;
}>;

const TWO = fp2(2n, 0n);
const TWO_D = fp2Mul(TWO, FOURQ_D);

export function pointIdentity(): PointExt {
  return {
    X: fp2Zero(),
    Y: fp2One(),
    Z: fp2One(),
    T: fp2Zero(),
  };
}

export function pointFromAffine(p: PointAffine): PointExt {
  return {
    X: p.x,
    Y: p.y,
    Z: fp2One(),
    T: fp2Mul(p.x, p.y),
  };
}

export function pointToAffine(p: PointExt): PointAffine {
  const invZ = fp2Inv(p.Z);
  const x = fp2Mul(p.X, invZ);
  const y = fp2Mul(p.Y, invZ);
  return { x, y };
}

export function pointAdd(p: PointExt, q: PointExt): PointExt {
  // a=-1 extended coordinates addition (Edwards)
  const y1MinusX1 = fp2Sub(p.Y, p.X);
  const y2MinusX2 = fp2Sub(q.Y, q.X);
  const A = fp2Mul(y1MinusX1, y2MinusX2);

  const y1PlusX1 = fp2Add(p.Y, p.X);
  const y2PlusX2 = fp2Add(q.Y, q.X);
  const B = fp2Mul(y1PlusX1, y2PlusX2);

  const C = fp2Mul(fp2Mul(p.T, q.T), TWO_D);
  const D = fp2Mul(fp2Mul(p.Z, q.Z), TWO);

  const E = fp2Sub(B, A);
  const F = fp2Sub(D, C);
  const G = fp2Add(D, C);
  const H = fp2Add(B, A);

  return {
    X: fp2Mul(E, F),
    Y: fp2Mul(G, H),
    Z: fp2Mul(F, G),
    T: fp2Mul(E, H),
  };
}

export function pointDouble(p: PointExt): PointExt {
  const A = fp2Sqr(p.X);
  const B = fp2Sqr(p.Y);
  const C = fp2Mul(fp2Sqr(p.Z), TWO);
  const D = fp2Neg(A);
  const E = fp2Sub(fp2Sub(fp2Sqr(fp2Add(p.X, p.Y)), A), B);
  const G = fp2Add(D, B);
  const F = fp2Sub(G, C);
  const H = fp2Sub(D, B);
  return {
    X: fp2Mul(E, F),
    Y: fp2Mul(G, H),
    Z: fp2Mul(F, G),
    T: fp2Mul(E, H),
  };
}

export function pointIsOnCurve(p: PointAffine): boolean {
  // -x^2 + y^2 == 1 + d x^2 y^2 (a=-1)
  const x2 = fp2Sqr(p.x);
  const y2 = fp2Sqr(p.y);
  const left = fp2Add(fp2Neg(x2), y2);
  const right = fp2Add(fp2One(), fp2Mul(fp2Mul(FOURQ_D, x2), y2));
  return fp2Eq(left, right);
}

export function scalarMultBase(scalarLE: bigint): PointExt {
  return scalarMult(pointFromAffine({ x: FOURQ_BASE_X, y: FOURQ_BASE_Y }), scalarLE);
}

export function scalarMult(p: PointExt, scalarLE: bigint): PointExt {
  let n = scalarLE;
  let acc = pointIdentity();
  let dbl = p;
  while (n > 0n) {
    if ((n & 1n) === 1n) {
      acc = pointAdd(acc, dbl);
    }
    n >>= 1n;
    if (n > 0n) dbl = pointDouble(dbl);
  }
  return acc;
}

export function pointSignBit(x: Fp2): 0 | 1 {
  // Match FourQlib encode()/decode() convention:
  // use bit 126 (top bit of 127-bit field element) from x0 unless x0==0, then from x1.
  const component: Fp = x.a === 0n ? x.b : x.a;
  return ((component >> 126n) & 1n) === 1n ? 1 : 0;
}

export function pointNormalizeForEncoding(p: PointExt): { x: Fp2; y: Fp2; sign: 0 | 1 } {
  const { x, y } = pointToAffine(p);
  return { x, y, sign: pointSignBit(x) };
}

