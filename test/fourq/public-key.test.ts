import { describe, expect, it } from "bun:test";
import { generatePublicKey } from "../../src/index.js";

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

const GOLDEN_SECRET_KEY_32_HEX =
  "179c2d6db171f1af86efbaded25aeb0bc12bf90c0244566aee23e08f082d3863";
const GOLDEN_PUBLIC_KEY_32_HEX =
  "39665f596c87c5eb34b7c2027ea87737dc5a178dda273a1e67d673e5925b4e82";

describe("fourq public key", () => {
  it("matches the golden fixture", () => {
    const secretKey32 = hexToBytes(GOLDEN_SECRET_KEY_32_HEX);
    const expectedPublicKey32 = hexToBytes(GOLDEN_PUBLIC_KEY_32_HEX);
    expect(generatePublicKey(secretKey32)).toEqual(expectedPublicKey32);
  });
});
