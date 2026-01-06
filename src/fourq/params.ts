import { fpFromU64LE, type Fp } from "./fp.js";
import { fp2, type Fp2 } from "./fp2.js";

// Values from FourQlib `FourQ_64bit_and_portable/FourQ_params.h`.

export const FOURQ_D: Fp2 = fp2(
  fpFromU64LE(0x0000000000000142n, 0x00000000000000e4n),
  fpFromU64LE(0xb3821488f1fc0c8dn, 0x5e472f846657e0fcn),
);

export const FOURQ_BASE_X: Fp2 = fp2(
  fpFromU64LE(0x286592ad7b3833aan, 0x1a3472237c2fb305n),
  fpFromU64LE(0x96869fb360ac77f6n, 0x1e1f553f2878aa9cn),
);

export const FOURQ_BASE_Y: Fp2 = fp2(
  fpFromU64LE(0xb924a2462bcbb287n, 0x0e3fee9ba120785an),
  fpFromU64LE(0x49a7c344844c8b5cn, 0x6e1c4af8630e0242n),
);

export const FOURQ_A: Fp = -1n;

