import { describe, expect, it } from "bun:test";
import { verify } from "../../src/index.js";
import { schnorrqWasmFixture } from "../__fixtures__/schnorrq-wasm.js";
import { hexToBytes } from "../utils/hex.js";

describe("schnorrq verify", () => {
  it("matches the golden fixture", () => {
    const publicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    const digest32 = hexToBytes(schnorrqWasmFixture.digest32Hex);
    const signature64 = hexToBytes(schnorrqWasmFixture.signature64Hex);
    expect(verify(publicKey32, digest32, signature64)).toBe(1);
  });

  it("rejects a modified signature", () => {
    const publicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    const digest32 = hexToBytes(schnorrqWasmFixture.digest32Hex);
    const signature64 = hexToBytes(schnorrqWasmFixture.signature64Hex);
    signature64[0] = (signature64[0] ?? 0) ^ 0x01;
    expect(verify(publicKey32, digest32, signature64)).toBe(0);
  });
});

