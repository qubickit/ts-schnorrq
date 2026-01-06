import { describe, expect, it } from "bun:test";
import { generatePublicKey } from "../../src/index.js";
import { schnorrqWasmFixture } from "../__fixtures__/schnorrq-wasm.js";
import { hexToBytes } from "../utils/hex.js";

describe("fourq public key", () => {
  it("matches the golden fixture", () => {
    const secretKey32 = hexToBytes(schnorrqWasmFixture.secretKey32Hex);
    const expectedPublicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    expect(generatePublicKey(secretKey32)).toEqual(expectedPublicKey32);
  });
});

