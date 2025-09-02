# Simulator Usage

This directory contains a CLI simulator to pit the built-in CPU policies (weak, normal, strong) against each other offline (outside the UI).

## Prerequisites

- Node.js (>= 16)
- ts-node (will be auto-installed when using npx)

## Run

PowerShell (Windows):

1) Set compiler option (avoids ESM warnings):

```powershell
$env:TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}'
```

2) Run the simulator (defaults to 20 games per pairing, progress every 1 game):

```powershell
npx ts-node simulator/index.ts
```

### Arguments

```text
npx ts-node simulator/index.ts [gamesPerPair] [progressInterval]
```

- gamesPerPair: number of games for each pairing (weak vs normal, weak vs strong, normal vs strong). Default: 20
- progressInterval: how often to print progress (in games). Default: 1

Examples:

- 30 games per pairing, progress every game (1):
```powershell
$env:TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}'
npx ts-node simulator/index.ts 30 1
```

- 50 games per pairing, progress every 5 games:
```powershell
$env:TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}'
npx ts-node simulator/index.ts 50 5
```

## Output

- Per-pairing progress lines like:
```
[Progress weak vs normal] 10/20 -> weak:5, normal:4, strong:0, draw:1
```
- Summary at the end:
```
=== Summary ===
weak_vs_normal: weak:12, normal:6, strong:0, draw:2
weak_vs_strong: weak:3, normal:0, strong:15, draw:2
normal_vs_strong: weak:0, normal:8, strong:10, draw:2
```

## Notes

- The simulator uses the same AI implementations as the app (`src/ai/*`).
- Gravity rules are respected; gravity change is treated as a valid action.
- Simultaneous win (both sides connect-4) is treated as a draw.
