Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repoRoot "..\\temp\\jskit-core\\src\\crypto\\wasm"
$dest = Join-Path $repoRoot "temp\\wasm"

if (-not (Test-Path $source)) {
  throw "Source WASM folder not found: $source"
}

New-Item -ItemType Directory -Force -Path $dest | Out-Null

Copy-Item -Force (Join-Path $source "index.js") (Join-Path $dest "index.js")
Copy-Item -Recurse -Force (Join-Path $source "vendor") (Join-Path $dest "vendor")

Write-Host "Synced WASM shim to $dest"

