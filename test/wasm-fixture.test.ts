import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { schnorrqWasmFixture } from "./__fixtures__/schnorrq-wasm.js";
import { hexToBytes } from "./utils/hex.js";

function assertHexLength(hex: string, bytes: number, name: string) {
  expect(typeof hex).toBe("string");
  expect(hex.length).toBe(bytes * 2);
  expect(() => hexToBytes(hex)).not.toThrow();
}

describe("WASM golden fixture", () => {
  it("has expected shapes and lengths", () => {
    expect(schnorrqWasmFixture.seed.length).toBe(55);
    assertHexLength(schnorrqWasmFixture.secretKey32Hex, 32, "secretKey32Hex");
    assertHexLength(schnorrqWasmFixture.publicKey32Hex, 32, "publicKey32Hex");
    assertHexLength(schnorrqWasmFixture.destinationPublicKey32Hex, 32, "destinationPublicKey32Hex");
    expect(schnorrqWasmFixture.unsignedTxHex.length).toBeGreaterThan(0);
    assertHexLength(schnorrqWasmFixture.digest32Hex, 32, "digest32Hex");
    assertHexLength(schnorrqWasmFixture.signature64Hex, 64, "signature64Hex");
    expect(schnorrqWasmFixture.k12InputHex.length).toBeGreaterThan(0);
    assertHexLength(schnorrqWasmFixture.k12Out32Hex, 32, "k12Out32Hex");
  });

  const wasmPath = new URL("../temp/wasm/index.js", import.meta.url);
  const hasLocalWasm = existsSync(fileURLToPath(wasmPath));

  (hasLocalWasm ? it : it.skip)("matches local WASM backend (optional)", async () => {
    const wasmCryptoPromise = (await import(wasmPath.href)).default as Promise<{
      schnorrq: {
        generatePublicKey(secretKey: Uint8Array): Uint8Array;
        sign(secretKey: Uint8Array, publicKey: Uint8Array, messageDigest32: Uint8Array): Uint8Array;
        verify(publicKey: Uint8Array, messageDigest32: Uint8Array, signature64: Uint8Array): number;
      };
      K12(input: Uint8Array, output: Uint8Array, outputLength: number, outputOffset?: number): void;
    }>;

    const wasmCrypto = await wasmCryptoPromise;
    const secretKey32 = hexToBytes(schnorrqWasmFixture.secretKey32Hex);
    const publicKey32 = hexToBytes(schnorrqWasmFixture.publicKey32Hex);
    const digest32 = hexToBytes(schnorrqWasmFixture.digest32Hex);

    expect(wasmCrypto.schnorrq.generatePublicKey(secretKey32)).toEqual(publicKey32);

    const sig = wasmCrypto.schnorrq.sign(secretKey32, publicKey32, digest32);
    expect(sig).toEqual(hexToBytes(schnorrqWasmFixture.signature64Hex));
    expect(wasmCrypto.schnorrq.verify(publicKey32, digest32, sig)).toBe(1);

    const k12Input = hexToBytes(schnorrqWasmFixture.k12InputHex);
    const out = new Uint8Array(32);
    wasmCrypto.K12(k12Input, out, 32);
    expect(out).toEqual(hexToBytes(schnorrqWasmFixture.k12Out32Hex));
  });
});
