import { bytes16LEToFp, fpToBytes16LE } from "./fp.js";
import { fp2, fp2Add, fp2Div2, fp2Inv, fp2Mul, fp2Neg, fp2One, fp2Sqr, fp2Sub, fp2Sqrt, type Fp2 } from "./fp2.js";
import { FOURQ_D } from "./params.js";
import { pointFromAffine, pointIsOnCurve, pointNormalizeForEncoding, type PointAffine, type PointExt } from "./point.js";

function assertUint8ArrayLength(bytes: Uint8Array, length: number, name: string) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError(`${name} must be a Uint8Array`);
  if (bytes.byteLength !== length) throw new RangeError(`${name} must be ${length} bytes`);
}

function fp2ToBytes32LE(x: Fp2): Uint8Array {
  const out = new Uint8Array(32);
  out.set(fpToBytes16LE(x.a), 0);
  out.set(fpToBytes16LE(x.b), 16);
  return out;
}

function bytes32LEToFp2(bytes32: Uint8Array): Fp2 {
  assertUint8ArrayLength(bytes32, 32, "bytes32");
  const a = bytes16LEToFp(bytes32.subarray(0, 16));
  const b = bytes16LEToFp(bytes32.subarray(16, 32));
  return fp2(a, b);
}

export function encodePoint(p: PointExt): Uint8Array {
  const { x, y, sign } = pointNormalizeForEncoding(p);
  const out = fp2ToBytes32LE(y);
  out[31] = (out[31] ?? 0) & 0x7f;
  out[31] = (out[31] ?? 0) | (sign << 7);
  return out;
}

export function decodePoint(encoded: Uint8Array): PointExt {
  assertUint8ArrayLength(encoded, 32, "encoded");
  if (((encoded[15] ?? 0) & 0x80) !== 0) {
    throw new Error("invalid encoding (y0 out of range)");
  }
  const sign = ((encoded[31] ?? 0) >> 7) & 1;
  const yBytes = encoded.slice();
  yBytes[31] = (yBytes[31] ?? 0) & 0x7f;
  const y = bytes32LEToFp2(yBytes);

  // x^2 = (y^2 - 1) / (d*y^2 + 1)
  const y2 = fp2Sqr(y);
  const u = fp2Sub(y2, fp2One());
  const v = fp2Add(fp2Mul(FOURQ_D, y2), fp2One());
  const x2 = fp2Mul(u, fp2Inv(v));
  const xRoot = fp2Sqrt(x2);
  if (xRoot === null) throw new Error("invalid encoding (no square root)");
  let x = xRoot;

  // Adjust sign to match encoding convention.
  const signDec = (((x.a === 0n ? x.b : x.a) >> 126n) & 1n) === 1n ? 1 : 0;
  if (signDec !== sign) x = fp2Neg(x);

  const affine: PointAffine = { x, y };
  if (!pointIsOnCurve(affine)) throw new Error("invalid encoding (not on curve)");
  return pointFromAffine(affine);
}

