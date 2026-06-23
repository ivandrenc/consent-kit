# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-06-23

### Added

- Runnable Vite demo under `examples/vite-demo`, with a one-click
  "try it live" StackBlitz link in the README.
- Documented bundle size in the README — 3.3 KB min+gzip for the full UI,
  1.1 KB for the headless `consentium/core` — plus a minzipped-size badge.

## [0.1.1] - 2026-06-22

### Fixed

- `CookieBanner` now returns focus to the element that opened it (e.g. the
  footer `CookieSettingsLink`) when it closes, instead of stranding keyboard
  users at the top of the document. The banner still moves focus to its headline
  on open.

### Added

- README now includes a visual preview of the banner (initial view and
  per-category customize panel).

## [0.1.0]

Initial public release.

### Added

- Framework-agnostic consent store (`createStore`) with `localStorage`
  persistence and a `window` change event.
- React bindings: `ConsentProvider`, `useConsent`, `useConsentCategory`,
  `useConsentStatus`.
- `CookieBanner` — accessible, SSR-safe banner with accept-all / reject-all /
  per-category-customize flows.
- `CookieSettingsLink` — re-opens the banner so consent can be withdrawn.
- `CookieDisclosureTable` — renders the cookies and processors from your config.
- Do Not Track **and** Global Privacy Control support via per-category
  `respectDoNotTrack`.
- Policy versioning that re-prompts returning visitors on a bump.
- i18n-agnostic copy system with English defaults and a `copy` override prop.
- Themeable stylesheet (`consentium/styles.css`) using namespaced `--ck-*`
  custom properties.
- `presetCategories` for analytics / marketing / functional.
- `consentium/core` subpath export for non-React use.

[Unreleased]: https://github.com/ivandrenc/consentium/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ivandrenc/consentium/releases/tag/v0.1.0
