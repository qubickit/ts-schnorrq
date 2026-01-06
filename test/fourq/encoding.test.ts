import { describe, expect, it } from "bun:test";
import { hexToBytes } from "../utils/hex.js";
import { schnorrqWasmFixture } from "../__fixtures__/schnorrq-wasm.js";
import {
  assertEncodedPublicKey32,
  assertEncodedSignature64,
  isValidEncodedPublicKey32,
  isValidEncodedSignature64,
} from "../../src/fourq/encoding.js";

describe("fourq/encoding", () => {
  it("accepts the golden fixture encodings", () => {
    const publicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    const signature64 = hexToBytes(schnorrqWasmFixture.signature64Hex);

    expect(isValidEncodedPublicKey32(publicKey32)).toBe(true);
    expect(isValidEncodedSignature64(signature64)).toBe(true);
    expect(() => assertEncodedPublicKey32(publicKey32)).not.toThrow();
    expect(() => assertEncodedSignature64(signature64)).not.toThrow();
  });

  it("rejects invalid public key encodings", () => {
    const publicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    publicKey32[15] = (publicKey32[15] ?? 0) | 0x80;
    expect(isValidEncodedPublicKey32(publicKey32)).toBe(false);
    expect(() => assertEncodedPublicKey32(publicKey32)).toThrow();
  });

  it("rejects invalid signature encodings", () => {
    const base = hexToBytes(schnorrqWasmFixture.signature64Hex);

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

