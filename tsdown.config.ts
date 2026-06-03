import { defineConfig } from 'tsdown'

// Bundle the action into a single self-contained CommonJS file that the
// node24 runtime executes directly (no shipped node_modules). Runtime deps are
// force-bundled because tsdown externalizes `dependencies` by default.
export default defineConfig({
  entry: { index: 'src/main.ts' },
  format: 'cjs',
  sourcemap: true,
  dts: false,
  outDir: 'dist',
  // action.yml runs `dist/index.js`; force the plain .js extension (tsdown
  // would otherwise emit .cjs for the cjs format).
  outExtensions: () => ({ js: '.js' }),
  deps: {
    alwaysBundle: ['@actions/core', '@slack/webhook', 'slack-block-builder']
  }
})
