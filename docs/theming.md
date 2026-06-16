# Theming

Import the stylesheet once, anywhere in your app:

```ts
import "consentium/styles.css";
```

Then override any `--ck-*` custom property at a scope that contains the banner
(usually `:root`). Every token is namespaced `--ck-` so nothing collides with
your own design tokens, and every class is prefixed `.ck-`.

## Tokens

### Color

| Token                      | Default                 | Used for                        |
| -------------------------- | ----------------------- | ------------------------------- |
| `--ck-color-paper`         | `#ffffff`               | Banner / toggle knob background |
| `--ck-color-paper-2`       | `#f7f6f3`               | (reserved)                      |
| `--ck-color-paper-3`       | `#ececea`               | Toggle track, error chip        |
| `--ck-color-paper-overlay` | `rgba(255,255,255,.92)` | Banner background (with blur)   |
| `--ck-color-rule`          | `#e4e3df`               | Borders / dividers              |
| `--ck-color-ink`           | `#131318`               | Primary text                    |
| `--ck-color-ink-2`         | `#3a3a44`               | Secondary text                  |
| `--ck-color-ink-subtle`    | `rgba(19,19,24,.04)`    | Ghost-button hover              |
| `--ck-color-accent`        | `#1c5b3d`               | Primary button / active toggle  |
| `--ck-color-accent-ink`    | `#f4faf6`               | Text on the accent              |
| `--ck-color-accent-hover`  | `#2a7a55`               | Primary button hover            |
| `--ck-color-focus`         | `#2e8a5f`               | Focus rings                     |

### Type, space, shape, motion

| Token                        | Default                                    |
| ---------------------------- | ------------------------------------------ |
| `--ck-font-display`          | `ui-serif, Georgia, serif`                 |
| `--ck-font-body`             | `ui-sans-serif, system-ui, sans-serif`     |
| `--ck-font-mono`             | `ui-monospace, Menlo, Consolas, monospace` |
| `--ck-space-1 … 6`           | `0.25rem … 1.5rem`                         |
| `--ck-text-xs / sm / md`     | `0.75 / 0.875 / 1.125 rem`                 |
| `--ck-radius-md / lg / pill` | `8px / 16px / 999px`                       |
| `--ck-shadow-lg`             | `0 8px 32px rgba(19,19,24,.1)`             |
| `--ck-dur-short / mid`       | `120ms / 240ms`                            |
| `--ck-ease-out`              | `cubic-bezier(.16,1,.3,1)`                 |
| `--ck-z-banner`              | `2147483000`                               |

## Example: brand it

```css
:root {
  --ck-color-accent: #4f46e5;
  --ck-color-accent-ink: #ffffff;
  --ck-color-accent-hover: #4338ca;
  --ck-color-focus: #6366f1;
  --ck-radius-lg: 12px;
  --ck-font-display: "Inter", system-ui, sans-serif;
}
```

The banner headline is italic serif by default; set `--ck-font-display` to your
sans-serif (and the rule below) if that's not your style:

```css
.ck-headline {
  font-style: normal;
}
```

## Example: dark mode

Scope overrides to your dark selector (this example uses `[data-theme="dark"]`):

```css
[data-theme="dark"] {
  --ck-color-paper: #1a1a1f;
  --ck-color-paper-3: #2b2b33;
  --ck-color-paper-overlay: rgba(26, 26, 31, 0.92);
  --ck-color-rule: #34343d;
  --ck-color-ink: #f4f4f6;
  --ck-color-ink-2: #b8b8c2;
  --ck-color-ink-subtle: rgba(255, 255, 255, 0.06);
  --ck-color-accent: #34d399;
  --ck-color-accent-ink: #06281c;
  --ck-color-accent-hover: #6ee7b7;
}
```

## Going fully custom

If you'd rather not use the bundled banner at all, build your own UI with the
hooks and store — `useConsent()` gives you `store.acceptAll()`,
`store.rejectAll()`, `store.setConsent()`, and `record`. Don't import
`styles.css` and you ship zero of our CSS.
