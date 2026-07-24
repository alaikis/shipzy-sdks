import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'ShipzyEpodElements',
            formats: ['umd', 'es'],
            fileName: function(format) {
                if (format === 'umd') return 'epod-elements.umd.js';
                if (format === 'es') return 'epod-elements.mjs';
                return 'epod-elements.' + format + '.js';
            },
        },
        rollupOptions: {
            output: {
                globals: {},
            },
        },
    },
});
