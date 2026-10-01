# Daygraph

A private habit and expense dashboard, built with React, Vinext, Cloudflare D1, Recharts and ten pinned React Bits components. The selected StitchDesign plugin supplies the design-system workflow in `DESIGN.md`.

## Run locally

Use Node 22.13+ and npm. Install with `npm run install:ci`, then run `npm run build`. Apply the generated schema to local D1 before the first preview:

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careless_plazm.sql
npm run dev
```

The development server runs at `http://127.0.0.1:5173/`. Its sign-in uses the starter's local test identity. Production uses the Sites platform's ChatGPT identity and owner-private access. Each user's records are isolated by their platform user ID. There are no user records in browser storage; only the motion preference is stored there.

## Checks

```powershell
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test scripts/domain.test.ts
npm run build
```

## Behavior

The initial journal is clearly marked sample data. “Start with my own data” clears sample records and preserves categories and the chosen term, with an undo action. Habits support editable categories, schedules, non-negotiables, daily checks and a weekly grid. Overview defaults to the whole term through today; future check-ins do not count as missed. Archived habit data remains in the journal, and restoring reactivates its history.

Expenses use integer paise. A shared purchase contributes only the user's share to spending. Separate balances and repayments affect debt without adding spending. Person names are trimmed and matched without case sensitivity. Partial repayments are supported, and changes update the dashboards automatically.

Writes are serialized and use an optimistic revision check. A stale write is rejected with HTTP 409; the UI preserves the unsaved in-memory draft, shows the save error, and stops further writes until reload. The unload guard warns before leaving a journal with pending or unsaved changes.

See `THIRD_PARTY.md` and `components/react-bits/LICENSE` for upstream animation provenance and license. Sites publishes from the exact pushed source commit and applies the generated Drizzle migration before uploading the Worker.
