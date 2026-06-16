import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "core/index": "src/core/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Ship the stylesheet as a standalone file referenced by the
  // `./styles.css` export. It is not bundled into the JS.
  onSuccess: "node scripts/copy-css.mjs",
});
