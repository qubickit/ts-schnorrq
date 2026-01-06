import { modulusQ } from "../order/modq.js";
import { k12 } from "../k12.js";
import { encodePoint } from "./codec.js";
import { scalarMultBase } from "./point.js";

function assertUint8ArrayLength(bytes: Uint8Array, length: number, name: string) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError(`${name} must be a Uint8Array`);
  if (bytes.byteLength !== length) throw new RangeError(`${name} must be ${length} bytes`);
}

function bytesToBigIntLE(bytes: Uint8Array): bigint {
  let out = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    out = (out << 8n) | BigInt(bytes[i] ?? 0);
  }
  return out;
}

export function generatePublicKey(secretKey32: Uint8Array): Uint8Array {
  assertUint8ArrayLength(secretKey32, 32, "secretKey32");
  const q = modulusQ();
  // Qubic convention: secretKey32 here is a "subSeed"; the scalar comes from K12Hash64(subSeed)[:32].
  const subSeedHash64 = k12(secretKey32, 64);
  const scalar = bytesToBigIntLE(subSeedHash64.subarray(0, 32)) % q;
  const point = scalarMultBase(scalar);
  return encodePoint(point);
}
