# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
