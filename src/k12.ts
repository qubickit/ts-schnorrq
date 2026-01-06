import { k12 as nobleK12 } from "@noble/hashes/sha3-addons";

export function k12(input: Uint8Array, dkLen: number): Uint8Array {
  if (!(input instanceof Uint8Array)) {
    throw new TypeError("input must be a Uint8Array");
  }
  if (!Number.isSafeInteger(dkLen) || dkLen < 0) {
    throw new RangeError("dkLen must be a non-negative integer");
  }

  return nobleK12(input, { dkLen });
}

