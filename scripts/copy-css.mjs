// Copies the standalone stylesheet into dist so it is published alongside the
// compiled JS and resolvable via the `consent-kit/styles.css` export.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/styles.css", "dist/styles.css");
console.log("✓ copied src/styles.css → dist/styles.css");
