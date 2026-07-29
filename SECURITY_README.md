# Security & Privacy Audit Protocol

This repository enforces strict **ephemeral privacy invariants** and **isomorphic state execution**.

## Auditor's Quick-Start

1. **Open the Live Audit Dashboard**: Navigate to `/audit-dashboard` (or view the status badge in GitHub Actions).
2. **Verify CI Status**: Confirm the workflow badge reads **PASSING** (`✅ PASSING`). If failing, deployment is blocked.
3. **Inspect Response Headers**: Confirm response headers served by the application contain:
   - `Content-Security-Policy: default-src 'self'; connect-src 'self';`
   - `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
4. **Run Local Verification**:
   ```bash
   cd omarg-ui
   npm run test
   ```
   This executes `scripts/cross_validate.js` to assert 100% Python/JS engine isomorphism and verify defensive header configurations.

## Ethical & Privacy Principles
- **Ephemeral Only**: Zero database writes of user prompt content.
- **Client-Side Export**: Export functionality generates downloadable JSON blobs strictly in browser memory.
- **No Third-Party Tracking**: No analytics scripts, no third-party cookies, no exfiltration vectors.
