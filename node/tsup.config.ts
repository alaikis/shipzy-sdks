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
    external: ['react', 'react-native', 'react-native-webview'],
  },
  {
    entry: ['vue/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/vue',
    external: ['vue'],
  },
  {
    entry: ['solid/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/solid',
    external: ['solid-js'],
  },
  {
    entry: ['react/index.tsx'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/react',
    external: ['react', 'react-dom'],
  },
])
