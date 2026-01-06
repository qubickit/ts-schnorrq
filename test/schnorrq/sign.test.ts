import { describe, expect, it } from "bun:test";
import { unsafeSign, verify } from "../../src/index.js";
import { schnorrqWasmFixture } from "../__fixtures__/schnorrq-wasm.js";
import { hexToBytes } from "../utils/hex.js";

describe("schnorrq sign (unsafe)", () => {
  it("matches the golden fixture", () => {
    const subSeed32 = hexToBytes(schnorrqWasmFixture.secretKey32Hex);
    const publicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    const digest32 = hexToBytes(schnorrqWasmFixture.digest32Hex);

    const sig0 = unsafeSign(subSeed32, publicKey32, digest32);
    const sig1 = unsafeSign(subSeed32, publicKey32, digest32);
    expect(sig0).toEqual(sig1);
    expect(sig0).toEqual(hexToBytes(schnorrqWasmFixture.signature64Hex));
    expect(verify(publicKey32, digest32, sig0)).toBe(1);
  });
});

