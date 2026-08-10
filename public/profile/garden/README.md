# Floating Garden Asset Pack

Production-ready transparent PNG assets for the interactive portfolio crow environment.

## Rendering

- Compose the environment on a 960 × 240 design canvas.
- Render at 50% for a crisp 480 × 120 desktop strip.
- Keep sprite scaling on integer or half-integer ratios and use `image-rendering: pixelated`.
- Use the surface and baseline values from `manifest.json` for walking and landing alignment.
- Keep the crow and waterfall as separate animated layers.
- The speech bubble, shortcuts, collision paths, and reduced-motion behavior should remain code-generated.

## Layer order

1. `garden-background.png`
2. Waterfall instances from `waterfall-atlas.png`
3. Crow and optional props
4. `garden-ground.png`
5. Foreground particles and the code-generated speech bubble

## Atlas maps

- `platforms-atlas.png`: 3 columns × 1 row, 320px cells.
- `waterfall-atlas.png`: 8 columns × 1 row, 96 × 256px cells.
- `props-atlas.png`: 4 columns × 2 rows, 160 × 256px cells.
- `crow-atlas.png`: 4 columns × 4 rows, 128px cells.

Individual small, medium, and tall platform PNG files are included for simpler positioning.
