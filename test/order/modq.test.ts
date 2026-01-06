import { describe, expect, it } from "bun:test";
import { modulusQ, mulModQ32LE, reduceScalar32LE, subModQ32LE } from "../../src/order/modq.js";

function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== "string") throw new TypeError("hex must be a string");
  if (hex.length % 2 !== 0) throw new RangeError("hex length must be even");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (!Number.isFinite(byte)) throw new Error("invalid hex");
    out[i] = byte;
  }
  return out;
}

function bytesToBigIntLE(bytes: Uint8Array): bigint {
  let out = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    out = (out << 8n) | BigInt(bytes[i] ?? 0);
  }
  return out;
}

function bigIntToBytes32LE(value: bigint): Uint8Array {
  const out = new Uint8Array(32);
  let v = value;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

describe("order/modq", () => {
  it("reduces canonical cases", () => {
    const q = modulusQ();
    expect(q > 0n).toBe(true);

    const zero = new Uint8Array(32);
    const one = bigIntToBytes32LE(1n);
    const qBytes = bigIntToBytes32LE(q);
    const qMinusOne = bigIntToBytes32LE(q - 1n);
    const qPlusOne = bigIntToBytes32LE(q + 1n);

    expect(reduceScalar32LE(zero)).toEqual(zero);
    expect(reduceScalar32LE(one)).toEqual(one);
    expect(reduceScalar32LE(qBytes)).toEqual(zero);
    expect(reduceScalar32LE(qPlusOne)).toEqual(one);
    expect(reduceScalar32LE(qMinusOne)).toEqual(qMinusOne);
  });

  it("sub mod q wraps underflow", () => {
    const q = modulusQ();
    const zero = new Uint8Array(32);
    const one = bigIntToBytes32LE(1n);
    const qMinusOne = bigIntToBytes32LE(q - 1n);

    expect(subModQ32LE(zero, one)).toEqual(qMinusOne);
    expect(subModQ32LE(one, one)).toEqual(zero);
  });

  it("mul mod q has expected identities", () => {
    const q = modulusQ();
    const one = bigIntToBytes32LE(1n);
    const qMinusOne = bigIntToBytes32LE(q - 1n);

    expect(mulModQ32LE(one, one)).toEqual(one);
    expect(mulModQ32LE(qMinusOne, qMinusOne)).toEqual(one);
  });

  it("reduce matches BigInt computation for 0xff..ff", () => {
    const q = modulusQ();
    const bytes = new Uint8Array(32).fill(0xff);
    const expected = bigIntToBytes32LE(bytesToBigIntLE(bytes) % q);
    expect(reduceScalar32LE(bytes)).toEqual(expected);
  });

  it("accepts little-endian fixture scalars", () => {
    const sig64 = hexToBytes(
      "77a4fecbd22d99e419c44408e11f8921194c06309c255fc21edc9fce4782b92bfec0190c01169fe0e6eb10b55188bb7daf28746faa552e0e564379a9400a2700",
    );
    const s = sig64.subarray(32, 64);
    expect(reduceScalar32LE(s).byteLength).toBe(32);
  });
});
