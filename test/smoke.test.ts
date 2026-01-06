import { describe, expect, it } from "bun:test";
import { createSchnorrq, generatePublicKey, k12, verify } from "../src/index.js";

describe("ts-schnorrq (Phase A)", () => {
  it("delegates sign() to injected signer", () => {
    const signature = new Uint8Array(64).fill(7);

    const schnorrq = createSchnorrq({
      signer: {
        sign: () => signature,
      },
    });

    const out = schnorrq.sign(new Uint8Array(32), new Uint8Array(32), new Uint8Array(32));
    expect(out).toBe(signature);
  });

  it("exports stubbed crypto functions", () => {
    expect(() => verify(new Uint8Array(32), new Uint8Array(32), new Uint8Array(64))).toThrow();
    expect(k12(new Uint8Array(1), 32).byteLength).toBe(32);
    expect(generatePublicKey(new Uint8Array(32)).byteLength).toBe(32);
  });
});
