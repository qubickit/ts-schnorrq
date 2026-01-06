import { notImplemented } from "./internal/not-implemented.js";

export type SchnorrqSigner = Readonly<{
  sign(subSeed32: Uint8Array, publicKey32: Uint8Array, messageDigest32: Uint8Array): Uint8Array;
}>;

export type CreateSchnorrqParams = Readonly<{
  signer: SchnorrqSigner;
}>;

export type Schnorrq = Readonly<{
  sign(subSeed32: Uint8Array, publicKey32: Uint8Array, messageDigest32: Uint8Array): Uint8Array;
}>;

export function createSchnorrq(params: CreateSchnorrqParams): Schnorrq {
  return {
    sign(subSeed32: Uint8Array, publicKey32: Uint8Array, messageDigest32: Uint8Array): Uint8Array {
      return params.signer.sign(subSeed32, publicKey32, messageDigest32);
    },
  };
}

export function verify(
  _publicKey32: Uint8Array,
  _messageDigest32: Uint8Array,
  _signature64: Uint8Array,
): 0 | 1 {
  return notImplemented("verify()");
}

export function k12(_input: Uint8Array, _dkLen: number): Uint8Array {
  return notImplemented("k12()");
}

export function generatePublicKey(_secretKey32: Uint8Array): Uint8Array {
  return notImplemented("generatePublicKey()");
}
