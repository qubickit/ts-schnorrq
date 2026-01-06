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

const GOLDEN_VECTORS = [
  {
    publicKey32Hex: "1f590d03e613bdded38b4c0820ac44615f91af12435980b3ede3c08c315a2544",
    signature64Hex:
      "ce7626396d148c8c8e5ccd2da7c0c3301b473275b67219d2c2a463ee68f82e69444de434656dbb6314f5387449c7de7ceec3e45571f3fcd10c85f97d01541300",
  },
  {
    publicKey32Hex: "91f6cf904f7cdfa15911812e8d1f6d4cc55019873ef321fe814ceb89c4dfb78e",
    signature64Hex:
      "0c8157af8a339909b472ab68e8bb6a10d38e16a754ea93273f93bc95b6ab3de742b306ab754b22cc52b808f2a70c32f15eb4f1c4d6eea06e7cf442fb81830900",
  },
  {
    publicKey32Hex: "4ff271bc629a2be278fd020e0e1ae9670485adfc0e46ff853f26a905f0516317",
    signature64Hex:
      "ed7c0afab38f00aa97a1cd11eff29159f42b9564a162a806d46ea5a5f73f84648b0b9b139692772df4a6d32adee1fdd49e08cce9780cd4a06cf8abb6d6c62900",
  },
  {
    publicKey32Hex: "39665f596c87c5eb34b7c2027ea87737dc5a178dda273a1e67d673e5925b4e82",
    signature64Hex:
      "ee65334ebf9a12407b85ae25d2e9eb0ff634fddc8e8bf2aab9ecd2a80fefca164b3fd48fbae7767e8f17bb794dd9d1698d03ee04db642546cd491ba76bd72700",
  },
] as const;

describe("fourq/encoding", () => {
  it("accepts the golden fixture encodings", () => {
    for (const vector of GOLDEN_VECTORS) {
      const publicKey32 = hexToBytes(vector.publicKey32Hex);
      const signature64 = hexToBytes(vector.signature64Hex);

      expect(isValidEncodedPublicKey32(publicKey32)).toBe(true);
      expect(isValidEncodedSignature64(signature64)).toBe(true);
      expect(() => assertEncodedPublicKey32(publicKey32)).not.toThrow();
      expect(() => assertEncodedSignature64(signature64)).not.toThrow();
    }
  });

  it("rejects invalid public key encodings", () => {
    const publicKey32 = hexToBytes(GOLDEN_VECTORS[0].publicKey32Hex);
    publicKey32[15] = (publicKey32[15] ?? 0) | 0x80;
    expect(isValidEncodedPublicKey32(publicKey32)).toBe(false);
    expect(() => assertEncodedPublicKey32(publicKey32)).toThrow();
  });

  it("rejects invalid signature encodings", () => {
    const base = hexToBytes(GOLDEN_VECTORS[0].signature64Hex);

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
