import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
  },
  {
    entry: ['src/epod-elements/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    outDir: 'dist/epod-elements',
  },
])
