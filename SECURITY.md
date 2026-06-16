# Security Policy

## Supported versions

consent-kit is pre-1.0. Security fixes land on the latest `0.x` release.

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅        |

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Instead, use GitHub's private vulnerability reporting:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Describe the issue, affected versions, and a reproduction if possible.

You'll get an acknowledgement as soon as the report is triaged. Once a fix is
available, we'll coordinate a disclosure timeline with you and credit you in the
release notes (unless you prefer to stay anonymous).

## Scope and threat model

consent-kit runs entirely in the browser and stores a small JSON record in
`localStorage`. It does not:

- send data to any server, third party, or the maintainers;
- read or write cookies itself (it records a _decision_; gating actual cookies
  is your integration's job);
- execute or inject third-party scripts.

Relevant security considerations we care about:

- **No untrusted code execution.** The stored record is parsed defensively and
  never `eval`'d; malformed storage falls back to a pending record.
- **No prototype pollution.** Parsed category keys are coerced from your own
  configured category list, not blindly merged.
- **No data exfiltration.** There are zero network calls in the library.

If you find a way to violate any of the above, that's a vulnerability — please
report it.
