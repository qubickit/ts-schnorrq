# ts-schnorrq

Standalone SchnorrQ (FourQ) + K12 library for Qubic.

Status: implemented (pure TypeScript). `unsafeSign`/`sign` is not side-channel hardened.

## When to use this

- You need a pure-TS SchnorrQ implementation for Qubic-compatible keygen, signing, and verification.
- You’re targeting browsers, Bun, or Node and want a single, portable crypto backend.
- You need deterministic compatibility with the existing Qubic SchnorrQ behavior.

## When not to use this

- You need side-channel hardened signing in hostile or multi-tenant environments.
- You need high-throughput signing; use a native/WASM backend instead.

## Where to use this

- **Good fit:** local tools, CLIs, offline signing, server-side verification, browser verification.
- **Use with caution:** browser or shared servers for signing; prefer external signer backends.

## Why this exists

Qubic tooling historically relied on a WASM shim for SchnorrQ. This library replaces that dependency with a portable, readable TypeScript implementation while keeping behavior compatible.

## Install

```bash
bun add @qubic-labs/schnorrq
```

## Usage

```ts
import { generatePublicKey, sign, verify } from "@qubic-labs/schnorrq";

// Qubic convention: `subSeed32` is a 32-byte value derived from the 55-char seed elsewhere.
// `messageDigest32` must be a 32-byte digest (SchnorrQ signs digests, not arbitrary-length messages).
const subSeed32 = new Uint8Array(32);
const publicKey32 = generatePublicKey(subSeed32);
const messageDigest32 = new Uint8Array(32);

const signature64 = sign(subSeed32, publicKey32, messageDigest32);
const ok = verify(publicKey32, messageDigest32, signature64);
```

### External signer (recommended for production)

```ts
import { createSchnorrq } from "@qubic-labs/schnorrq";

const schnorrq = createSchnorrq({
  signer: {
    sign(subSeed32, publicKey32, messageDigest32) {
      // Call into native/WASM/HW/external signer here.
      return mySigner.sign(subSeed32, publicKey32, messageDigest32);
    },
  },
});

const signature64 = schnorrq.sign(subSeed32, publicKey32, messageDigest32);
```

## API

- `k12(input: Uint8Array, dkLen: number): Uint8Array`
- `generatePublicKey(subSeed32: Uint8Array): Uint8Array` (32 bytes)
- `verify(publicKey32: Uint8Array, messageDigest32: Uint8Array, signature64: Uint8Array): 0 | 1`
- `unsafeSign(subSeed32: Uint8Array, publicKey32: Uint8Array, messageDigest32: Uint8Array): Uint8Array` (64 bytes)
- `sign(...)`: alias of `unsafeSign(...)`
- `createSchnorrq({ signer })`: helper for wiring an external signer backend (recommended for production)

## Security notes

- `unsafeSign`/`sign` is a pure-JS/TS implementation and is not designed to be constant-time or side-channel resistant.
- “Side-channel hardened” means the implementation avoids leaking secrets through timing, cache/memory access patterns, or branch behavior.
- Prefer `createSchnorrq({ signer })` with a constant-time backend (native/WASM/HW/external signer) for high-value secrets.

## Performance

- The FourQ math here uses `bigint` and is correctness-first.
- If you need high throughput, use a native/WASM backend and wire it in via `createSchnorrq`.

## Development

```bash
bun install
bun test
bun run build
```

## Release (semantic-release)

Automated releases run on pushes to `main` via `.github/workflows/release.yml`.

Required secrets:

- `NPM_TOKEN` (npm publish)
