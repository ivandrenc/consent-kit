# consentium — Vite demo

A minimal Vite + React app showing the [`consentium`](https://www.npmjs.com/package/consentium)
cookie-consent banner end to end: the banner on first visit, live consent
state via `useConsentCategory`, the `CookieSettingsLink` to reopen it, and
`CookieDisclosureTable`.

## Try it live

[**Open in StackBlitz →**](https://stackblitz.com/github/ivandrenc/consentium/tree/main/examples/vite-demo)

It installs `consentium` from npm and boots the dev server in your browser — no
local setup.

## Run locally

```bash
npm install
npm run dev
```

Click **Reset (simulate a first-time visitor)** to clear the stored choice and
see the banner appear again.
