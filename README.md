# ts-schnorrq

Standalone SchnorrQ (FourQ) + K12 library for Qubic.

Status: implemented (pure TS). `unsafeSign`/`sign` is not side-channel hardened.

## Development

```bash
bun install
bun test
bun run build
```

## API (planned)

- `k12(input, dkLen)`
- `verify(publicKey32, messageDigest32, signature64)`
- `generatePublicKey(secretKey32)`
- `createSchnorrq({ signer })` for pluggable signing backends
- `unsafeSign(subSeed32, publicKey32, messageDigest32)` (not hardened)
- `sign(...)` alias for `unsafeSign(...)` (not hardened)
