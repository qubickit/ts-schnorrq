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

describe("schnorrq verify", () => {
  it("matches the golden fixture", () => {
    const publicKey32 = hexToBytes(GOLDEN_PUBLIC_KEY_32_HEX);
    const digest32 = hexToBytes(GOLDEN_DIGEST_32_HEX);
    const signature64 = hexToBytes(GOLDEN_SIGNATURE_64_HEX);
    expect(verify(publicKey32, digest32, signature64)).toBe(1);
  });

  it("rejects a modified signature", () => {
    const publicKey32 = hexToBytes(GOLDEN_PUBLIC_KEY_32_HEX);
    const digest32 = hexToBytes(GOLDEN_DIGEST_32_HEX);
    const signature64 = hexToBytes(GOLDEN_SIGNATURE_64_HEX);
    signature64[0] = (signature64[0] ?? 0) ^ 0x01;
    expect(verify(publicKey32, digest32, signature64)).toBe(0);
  });
});
