# ts-schnorrq

Standalone SchnorrQ (FourQ) + K12 library for Qubic.

Status: scaffolding only (Phase A). Crypto primitives are not implemented yet.

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
