# Contributing to consent-kit

Thanks for your interest! This project aims to stay small, dependency-light, and
genuinely useful. Contributions of all sizes are welcome — bug reports, docs,
tests, new recipes, and features.

## Getting started

```bash
git clone https://github.com/ivandrenc/consent-kit.git
cd consent-kit
npm install        # also builds via the `prepare` script
```

> **No committed lockfile.** `package-lock.json` is intentionally git-ignored.
> A lockfile generated on one OS makes `npm` skip the cross-platform native
> binaries (rollup/rolldown) on another ([npm/cli#4828](https://github.com/npm/cli/issues/4828)),
> which breaks CI. Since consumers never use a library's lockfile, fresh
> resolution via `npm install` is the reliable choice. Pin exact versions in
> `package.json` if you need stricter reproducibility.

### Useful scripts

| Command                | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm run build`        | Bundle ESM + CJS + types into `dist/` (tsup) |
| `npm run dev`          | Rebuild on change                            |
| `npm test`             | Run the Vitest suite once                    |
| `npm run test:watch`   | Watch mode                                   |
| `npm run typecheck`    | `tsc --noEmit` (strict)                      |
| `npm run format`       | Format with Prettier                         |
| `npm run format:check` | Verify formatting (CI gate)                  |

## The bar for a PR

CI runs on Node 20 and 22 and must be green (the toolchain requires Node 20+).
Before opening a PR, run locally:

```bash
npm run typecheck && npm test && npm run format:check
```

- **Tests.** New behavior needs a test. The store and React layers are covered
  in `src/__tests__/`; follow the existing patterns.
- **Types.** The library is strict TypeScript with `verbatimModuleSyntax`. Use
  `import type` for type-only imports.
- **No new runtime dependencies** without discussion — staying zero-dependency
  (React as the only peer) is a goal, not an accident.
- **Keep it accessible.** The banner is keyboard- and screen-reader-operable
  (focus management, `role`/`aria-*`, visible focus rings). Don't regress this.
- **Styling** lives in `src/styles.css` with `--ck-*` tokens and `.ck-`
  prefixed classes. Add new tokens rather than hard-coding values.

## Architecture in one minute

```
src/
  core/        framework-agnostic store, types, DNT/GPC detection (no React)
    types.ts     ConsentConfig and friends
    store.ts     createStore(): get/set/hasConsent/subscribe + persistence
    defaults.ts  privacy-signal detection, pending-record builder
    presets.ts   ready-made categories
  react/       React bindings
    context.tsx          ConsentProvider + hooks
    CookieBanner.tsx     the banner UI
    CookieSettingsLink.tsx
    CookieDisclosureTable.tsx
    copy.ts              default English strings + merge helper
  styles.css   one importable stylesheet, themeable via --ck-* vars
```

The split is deliberate: anything in `core/` must never import React, so it can
power non-React integrations. UI and copy live in `react/`.

## Reporting bugs / proposing features

Open an issue using the templates. For security issues, please follow
[SECURITY.md](./SECURITY.md) instead of filing a public issue.

## Code of Conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By
participating you agree to uphold it.

## License

By contributing, you agree your contributions are licensed under the project's
[MIT License](./LICENSE).
