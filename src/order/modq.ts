const MODULUS_Q =
  0x29cbc14e5e0a72f05397829cbc14e5dfbd004dfe0f79992fb2540ec7768ce7n;

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

function bigIntToBytes32LE(value: bigint): Uint8Array {
  if (value < 0n) {
    throw new RangeError("value must be non-negative");
  }
  const out = new Uint8Array(32);
  let v = value;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  if (v !== 0n) {
    throw new RangeError("value does not fit in 32 bytes");
  }
  return out;
}

export function reduceScalar32LE(bytes32: Uint8Array): Uint8Array {
  assertUint8ArrayLength(bytes32, 32, "bytes32");
  return bigIntToBytes32LE(bytesToBigIntLE(bytes32) % MODULUS_Q);
}

export function mulModQ32LE(a32: Uint8Array, b32: Uint8Array): Uint8Array {
  assertUint8ArrayLength(a32, 32, "a32");
  assertUint8ArrayLength(b32, 32, "b32");
  return bigIntToBytes32LE((bytesToBigIntLE(a32) * bytesToBigIntLE(b32)) % MODULUS_Q);
}

export function subModQ32LE(a32: Uint8Array, b32: Uint8Array): Uint8Array {
  assertUint8ArrayLength(a32, 32, "a32");
  assertUint8ArrayLength(b32, 32, "b32");
  let r = (bytesToBigIntLE(a32) - bytesToBigIntLE(b32)) % MODULUS_Q;
  if (r < 0n) r += MODULUS_Q;
  return bigIntToBytes32LE(r);
}

export function modulusQ(): bigint {
  return MODULUS_Q;
}

