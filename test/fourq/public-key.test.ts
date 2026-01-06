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

const GOLDEN_VECTORS = [
  {
    subSeed32Hex: "4453512f1ef597b365cc384f0a2b10ceb5c94f516b911acc8e8bc1b55e646c74",
    publicKey32Hex: "1f590d03e613bdded38b4c0820ac44615f91af12435980b3ede3c08c315a2544",
  },
  {
    subSeed32Hex: "00aceaf093fd94d8ce3b315696a38edfb5d5c247182d0f0d3a97960fc2a829c7",
    publicKey32Hex: "91f6cf904f7cdfa15911812e8d1f6d4cc55019873ef321fe814ceb89c4dfb78e",
  },
  {
    subSeed32Hex: "951e0e6ce03690760117cd862d2ce1a1434deeaead371e88fe63ac8a291f6c35",
    publicKey32Hex: "4ff271bc629a2be278fd020e0e1ae9670485adfc0e46ff853f26a905f0516317",
  },
  {
    subSeed32Hex: GOLDEN_SECRET_KEY_32_HEX,
    publicKey32Hex: GOLDEN_PUBLIC_KEY_32_HEX,
  },
] as const;

describe("fourq public key", () => {
  it("matches the golden fixture", () => {
    for (const vector of GOLDEN_VECTORS) {
      const secretKey32 = hexToBytes(vector.subSeed32Hex);
      const expectedPublicKey32 = hexToBytes(vector.publicKey32Hex);
      expect(generatePublicKey(secretKey32)).toEqual(expectedPublicKey32);
    }
  });
});
