import { encodePoint } from "../fourq/codec.js";
import { scalarMultBase } from "../fourq/point.js";
import { k12 } from "../k12.js";
import { modulusQ, mulModQ32LE, reduceScalar32LE, subModQ32LE } from "../order/modq.js";

function assertUint8ArrayLength(bytes: Uint8Array, length: number, name: string) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError(`${name} must be a Uint8Array`);
  }
  if (bytes.byteLength !== length) {
    throw new RangeError(`${name} must be ${length} bytes`);
  }
}

function bytesToBigIntLE(bytes: Uint8Array): bigint {
  let out = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    out = (out << 8n) | BigInt(bytes[i] ?? 0);
  }
  return out;
}

// Security: this is a pure-JS/TS implementation and is not side-channel hardened.
export function unsafeSign(
  subSeed32: Uint8Array,
  publicKey32: Uint8Array,
  messageDigest32: Uint8Array,
): Uint8Array {
  assertUint8ArrayLength(subSeed32, 32, "subSeed32");
  assertUint8ArrayLength(publicKey32, 32, "publicKey32");
  assertUint8ArrayLength(messageDigest32, 32, "messageDigest32");

  const subSeedHash64 = k12(subSeed32, 64);

  const tempTail = new Uint8Array(64);
  tempTail.set(subSeedHash64.subarray(32, 64), 0);
  tempTail.set(messageDigest32, 32);

  const tempHash64 = k12(tempTail, 64);
  const q = modulusQ();
  const rScalar = bytesToBigIntLE(tempHash64.subarray(0, 32)) % q;
  const R = scalarMultBase(rScalar);
  const Renc = encodePoint(R);

  const temp = new Uint8Array(96);
  temp.set(Renc, 0);
  temp.set(publicKey32, 32);
  temp.set(messageDigest32, 64);
  const finalHash64 = k12(temp, 64);

  const tempReduced = reduceScalar32LE(tempHash64.subarray(0, 32));
  const finalReduced = reduceScalar32LE(finalHash64.subarray(0, 32));
  const subSeedReduced = reduceScalar32LE(subSeedHash64.subarray(0, 32));

  const prod = mulModQ32LE(subSeedReduced, finalReduced);
  const sBytes = subModQ32LE(tempReduced, prod);

  const signature64 = new Uint8Array(64);
  signature64.set(Renc, 0);
  signature64.set(sBytes, 32);
  return signature64;
}

