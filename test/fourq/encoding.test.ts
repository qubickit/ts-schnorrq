import { describe, expect, it } from "bun:test";
import {
  assertEncodedPublicKey32,
  assertEncodedSignature64,
  isValidEncodedPublicKey32,
  isValidEncodedSignature64,
} from "../../src/fourq/encoding.js";

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

const GOLDEN_PUBLIC_KEY_32_HEX =
  "39665f596c87c5eb34b7c2027ea87737dc5a178dda273a1e67d673e5925b4e82";
const GOLDEN_SIGNATURE_64_HEX =
  "77a4fecbd22d99e419c44408e11f8921194c06309c255fc21edc9fce4782b92bfec0190c01169fe0e6eb10b55188bb7daf28746faa552e0e564379a9400a2700";

describe("fourq/encoding", () => {
  it("accepts the golden fixture encodings", () => {
    const publicKey32 = hexToBytes(GOLDEN_PUBLIC_KEY_32_HEX);
    const signature64 = hexToBytes(GOLDEN_SIGNATURE_64_HEX);

    expect(isValidEncodedPublicKey32(publicKey32)).toBe(true);
    expect(isValidEncodedSignature64(signature64)).toBe(true);
    expect(() => assertEncodedPublicKey32(publicKey32)).not.toThrow();
    expect(() => assertEncodedSignature64(signature64)).not.toThrow();
  });

  it("rejects invalid public key encodings", () => {
    const publicKey32 = hexToBytes(GOLDEN_PUBLIC_KEY_32_HEX);
    publicKey32[15] = (publicKey32[15] ?? 0) | 0x80;
    expect(isValidEncodedPublicKey32(publicKey32)).toBe(false);
    expect(() => assertEncodedPublicKey32(publicKey32)).toThrow();
  });

  it("rejects invalid signature encodings", () => {
    const base = hexToBytes(GOLDEN_SIGNATURE_64_HEX);

    const bad0 = base.slice();
    bad0[15] = (bad0[15] ?? 0) | 0x80;
    expect(isValidEncodedSignature64(bad0)).toBe(false);

    const bad1 = base.slice();
    bad1[62] = (bad1[62] ?? 0) | 0xc0;
    expect(isValidEncodedSignature64(bad1)).toBe(false);

    const bad2 = base.slice();
    bad2[63] = 1;
    expect(isValidEncodedSignature64(bad2)).toBe(false);

    expect(() => assertEncodedSignature64(bad0)).toThrow();
    expect(() => assertEncodedSignature64(bad1)).toThrow();
    expect(() => assertEncodedSignature64(bad2)).toThrow();
  });

  it("returns false on non-Uint8Array inputs", () => {
    expect(isValidEncodedPublicKey32(null)).toBe(false);
    expect(isValidEncodedSignature64("nope")).toBe(false);
  });
});
