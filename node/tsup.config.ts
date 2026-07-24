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
  {
    entry: ['src/rn/index.tsx'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    outDir: 'dist/rn',
    external: ['react', 'react-native', 'react-native-webview'],
    jsxFactory: 'React.createElement',
  },
])
