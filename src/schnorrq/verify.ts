import { k12 } from "../k12.js";
import { modulusQ } from "../order/modq.js";
import { decodePoint, encodePoint } from "../fourq/codec.js";
import { pointAdd, scalarMult, scalarMultBase } from "../fourq/point.js";
import { isValidEncodedPublicKey32, isValidEncodedSignature64 } from "../fourq/encoding.js";

function bytesToBigIntLE(bytes: Uint8Array): bigint {
  let out = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    out = (out << 8n) | BigInt(bytes[i] ?? 0);
  }
  return out;
}

export function verify(
  publicKey32: Uint8Array,
  messageDigest32: Uint8Array,
  signature64: Uint8Array,
): 0 | 1 {
  if (!(publicKey32 instanceof Uint8Array)) throw new TypeError("publicKey32 must be a Uint8Array");
  if (!(messageDigest32 instanceof Uint8Array)) throw new TypeError("messageDigest32 must be a Uint8Array");
  if (!(signature64 instanceof Uint8Array)) throw new TypeError("signature64 must be a Uint8Array");

  if (publicKey32.byteLength !== 32) return 0;
  if (messageDigest32.byteLength !== 32) return 0;
  if (signature64.byteLength !== 64) return 0;

  if (!isValidEncodedPublicKey32(publicKey32)) return 0;
  if (!isValidEncodedSignature64(signature64)) return 0;

  let pubKeyPoint;
  try {
    pubKeyPoint = decodePoint(publicKey32);
  } catch {
    return 0;
  }

  const Renc = signature64.subarray(0, 32);
  const sBytes = signature64.subarray(32, 64);

  const temp = new Uint8Array(96);
  temp.set(Renc, 0);
  temp.set(publicKey32, 32);
  temp.set(messageDigest32, 64);
  const h64 = k12(temp, 64);

  const q = modulusQ();
  const s = bytesToBigIntLE(sBytes) % q;
  const h = bytesToBigIntLE(h64.subarray(0, 32)) % q;

  const sG = scalarMultBase(s);
  const hA = scalarMult(pubKeyPoint, h);
  const R = pointAdd(sG, hA);
  const encoded = encodePoint(R);

  for (let i = 0; i < 32; i++) {
    if ((encoded[i] ?? 0) !== (Renc[i] ?? 0)) return 0;
  }
  return 1;
}

