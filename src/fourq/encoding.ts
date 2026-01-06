function isU8(bytes: unknown): bytes is Uint8Array {
  return bytes instanceof Uint8Array;
}

function isU8Len(bytes: unknown, length: number): bytes is Uint8Array {
  return isU8(bytes) && bytes.byteLength === length;
}

export function isValidEncodedPublicKey32(publicKey32: unknown): publicKey32 is Uint8Array {
  if (!isU8Len(publicKey32, 32)) return false;
  return ((publicKey32[15] ?? 0) & 0x80) === 0;
}

export function isValidEncodedSignature64(signature64: unknown): signature64 is Uint8Array {
  if (!isU8Len(signature64, 64)) return false;
  return (
    (((signature64[15] ?? 0) & 0x80) === 0) &&
    (((signature64[62] ?? 0) & 0xc0) === 0) &&
    (signature64[63] ?? 0) === 0
  );
}

export function assertEncodedPublicKey32(publicKey32: unknown): asserts publicKey32 is Uint8Array {
  if (!isValidEncodedPublicKey32(publicKey32)) {
    throw new Error("invalid publicKey32 encoding");
  }
}

export function assertEncodedSignature64(signature64: unknown): asserts signature64 is Uint8Array {
  if (!isValidEncodedSignature64(signature64)) {
    throw new Error("invalid signature64 encoding");
  }
}

