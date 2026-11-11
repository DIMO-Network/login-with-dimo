import path from 'path';
import { defineConfig } from 'vitest/config';

const src = (dir: string) => path.resolve(__dirname, 'src', dir);

// Aliases mirror `paths` in tsconfig.json (webpack reads them via TsconfigPathsPlugin).
export default defineConfig({
  resolve: {
    alias: {
      '@auth': src('auth'),
      '@components': src('components'),
      '@dimo-types': src('types'),
      '@enums': src('enums'),
      '@hooks': src('hooks'),
      '@storage': src('storage'),
      '@token': src('token'),
      '@utils': src('utils'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
