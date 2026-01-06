import { describe, expect, it } from "bun:test";
import { verify } from "../../src/index.js";

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
const GOLDEN_DIGEST_32_HEX =
  "3ee42f561ac090694fb35e12ba6f642fd0725f77368fc6f0ebaa4d6181476d9d";
const GOLDEN_SIGNATURE_64_HEX =
  "77a4fecbd22d99e419c44408e11f8921194c06309c255fc21edc9fce4782b92bfec0190c01169fe0e6eb10b55188bb7daf28746faa552e0e564379a9400a2700";

const GOLDEN_VECTORS = [
  {
    publicKey32Hex: "1f590d03e613bdded38b4c0820ac44615f91af12435980b3ede3c08c315a2544",
    digest32Hex: "37a0d11d30adfecd8e506da210c8a6c5e1d86542c29b0a591c60ef915f3a3bf2",
    signature64Hex:
      "ce7626396d148c8c8e5ccd2da7c0c3301b473275b67219d2c2a463ee68f82e69444de434656dbb6314f5387449c7de7ceec3e45571f3fcd10c85f97d01541300",
  },
  {
    publicKey32Hex: "91f6cf904f7cdfa15911812e8d1f6d4cc55019873ef321fe814ceb89c4dfb78e",
    digest32Hex: "6eee5adf0b51f127942cb265f02986007c97d01818a023a75b1c630768cd3ac3",
    signature64Hex:
      "0c8157af8a339909b472ab68e8bb6a10d38e16a754ea93273f93bc95b6ab3de742b306ab754b22cc52b808f2a70c32f15eb4f1c4d6eea06e7cf442fb81830900",
  },
  {
    publicKey32Hex: "4ff271bc629a2be278fd020e0e1ae9670485adfc0e46ff853f26a905f0516317",
    digest32Hex: "60d3b10d64f82d65b8424c88b1943490a4ae0169d02b20aee82a9b802ba095dd",
    signature64Hex:
      "ed7c0afab38f00aa97a1cd11eff29159f42b9564a162a806d46ea5a5f73f84648b0b9b139692772df4a6d32adee1fdd49e08cce9780cd4a06cf8abb6d6c62900",
  },
  {
    publicKey32Hex: GOLDEN_PUBLIC_KEY_32_HEX,
    digest32Hex: "7f80905b2aee289f448193827a0a96ecc99de08f446b71c0f581255403778904",
    signature64Hex:
      "ee65334ebf9a12407b85ae25d2e9eb0ff634fddc8e8bf2aab9ecd2a80fefca164b3fd48fbae7767e8f17bb794dd9d1698d03ee04db642546cd491ba76bd72700",
  },
] as const;

describe("schnorrq verify", () => {
  it("matches the golden fixture", () => {
    for (const vector of GOLDEN_VECTORS) {
      const publicKey32 = hexToBytes(vector.publicKey32Hex);
      const digest32 = hexToBytes(vector.digest32Hex);
      const signature64 = hexToBytes(vector.signature64Hex);
      expect(verify(publicKey32, digest32, signature64)).toBe(1);
    }
  });

  it("rejects a modified signature", () => {
    const publicKey32 = hexToBytes(GOLDEN_PUBLIC_KEY_32_HEX);
    const digest32 = hexToBytes(GOLDEN_DIGEST_32_HEX);
    const signature64 = hexToBytes(GOLDEN_SIGNATURE_64_HEX);
    signature64[0] = (signature64[0] ?? 0) ^ 0x01;
    expect(verify(publicKey32, digest32, signature64)).toBe(0);
  });

  it("returns 0 on invalid lengths", () => {
    expect(verify(new Uint8Array(31), new Uint8Array(32), new Uint8Array(64))).toBe(0);
    expect(verify(new Uint8Array(32), new Uint8Array(31), new Uint8Array(64))).toBe(0);
    expect(verify(new Uint8Array(32), new Uint8Array(32), new Uint8Array(63))).toBe(0);
  });
});
