import { describe, expect, it } from "bun:test";
import { k12 } from "../src/index.js";

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

const GOLDEN = {
  seed: "jvhbyzjinlyutyuhsweuxiwootqoevjqwqmdhjeohrytxjxidpbcfyg",
  secretKey32Hex: "179c2d6db171f1af86efbaded25aeb0bc12bf90c0244566aee23e08f082d3863",
  publicKey32Hex: "39665f596c87c5eb34b7c2027ea87737dc5a178dda273a1e67d673e5925b4e82",
  digest32Hex: "3ee42f561ac090694fb35e12ba6f642fd0725f77368fc6f0ebaa4d6181476d9d",
  signature64Hex:
    "77a4fecbd22d99e419c44408e11f8921194c06309c255fc21edc9fce4782b92bfec0190c01169fe0e6eb10b55188bb7daf28746faa552e0e564379a9400a2700",
  k12InputHex: "00010203040506070809",
  k12Out32Hex: "e5ef1dd415a069d5c1ee20a731c271d751ec9f301bfb8a51acf27828d231e305",
} as const;

function assertHexLength(hex: string, bytes: number, name: string) {
  expect(typeof hex).toBe("string");
  expect(hex.length).toBe(bytes * 2);
  expect(() => hexToBytes(hex)).not.toThrow();
}

describe("golden vectors", () => {
  it("has expected shapes and lengths", () => {
    expect(GOLDEN.seed.length).toBe(55);
    assertHexLength(GOLDEN.secretKey32Hex, 32, "secretKey32Hex");
    assertHexLength(GOLDEN.publicKey32Hex, 32, "publicKey32Hex");
    assertHexLength(GOLDEN.digest32Hex, 32, "digest32Hex");
    assertHexLength(GOLDEN.signature64Hex, 64, "signature64Hex");
    expect(GOLDEN.k12InputHex.length).toBeGreaterThan(0);
    assertHexLength(GOLDEN.k12Out32Hex, 32, "k12Out32Hex");

    const k12Input = hexToBytes(GOLDEN.k12InputHex);
    expect(k12(k12Input, 32)).toEqual(hexToBytes(GOLDEN.k12Out32Hex));
  });

  // This file intentionally does not depend on a local WASM oracle.
});
