const P = (1n << 127n) - 1n;

export type Fp = bigint;

export function fpMod(x: bigint): Fp {
  let r = x % P;
  if (r < 0n) r += P;
  return r;
}

export function fpAdd(a: Fp, b: Fp): Fp {
  return fpMod(a + b);
}

export function fpSub(a: Fp, b: Fp): Fp {
  return fpMod(a - b);
}

export function fpNeg(a: Fp): Fp {
  return a === 0n ? 0n : P - a;
}

export function fpMul(a: Fp, b: Fp): Fp {
  return fpMod(a * b);
}

export function fpSqr(a: Fp): Fp {
  return fpMod(a * a);
}

export function fpDiv2(a: Fp): Fp {
  if ((a & 1n) === 0n) return a >> 1n;
  return (a + P) >> 1n;
}

function fpPow(base: Fp, exp: bigint): Fp {
  if (exp < 0n) throw new RangeError("exp must be non-negative");
  let result = 1n as Fp;
  let b = base;
  let e = exp;
  while (e > 0n) {
    if ((e & 1n) === 1n) result = fpMul(result, b);
    e >>= 1n;
    if (e > 0n) b = fpSqr(b);
  }
  return result;
}

export function fpInv(a: Fp): Fp {
  if (a === 0n) throw new RangeError("cannot invert 0");
  return fpPow(a, P - 2n);
}

export function fpSqrt(a: Fp): Fp | null {
  if (a === 0n) return 0n;
  // p = 2^127-1 ≡ 3 (mod 4), so sqrt(a) = a^((p+1)/4) = a^(2^125)
  let r = a;
  for (let i = 0; i < 125; i++) {
    r = fpSqr(r);
  }
  if (fpSqr(r) !== a) return null;
  return r;
}

export function fpFromU64LE(lo: bigint, hi: bigint): Fp {
  return fpMod(lo + (hi << 64n));
}

export function fpToBytes16LE(a: Fp): Uint8Array {
  const out = new Uint8Array(16);
  let v = a;
  for (let i = 0; i < 16; i++) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  if (v !== 0n) throw new RangeError("field element does not fit in 16 bytes");
  return out;
}

export function bytes16LEToFp(bytes16: Uint8Array): Fp {
  if (!(bytes16 instanceof Uint8Array)) throw new TypeError("bytes16 must be a Uint8Array");
  if (bytes16.byteLength !== 16) throw new RangeError("bytes16 must be 16 bytes");
  let out = 0n;
  for (let i = 15; i >= 0; i--) {
    out = (out << 8n) | BigInt(bytes16[i] ?? 0);
  }
  return fpMod(out);
}

export function fpPrime(): bigint {
  return P;
}

