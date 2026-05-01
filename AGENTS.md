# Foursa Codex Rules

This file defines project-specific rules for Codex and contributors working in this repository.

## Project Snapshot

- Framework: Next.js App Router (`app/`) with TypeScript (`strict: true`)
- UI: Tailwind CSS v4 + MUI
- Data layer: Axios (`lib/config/axiosInstance.ts`) + React Query
- Forms: React Hook Form + Zod
- State: Zustand (when needed)
- i18n: Cookie-driven language (`en`, `ar`, `de`) with RTL support for Arabic

## Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build check: `npm run build`

## Architecture Rules

- Keep routing in `app/` and business/domain UI logic in `features/`.
- Respect existing route groups: `(client)`, `(client-auth)`, `(company)`, `(company-auth)`.
- Reuse shared UI primitives from `components/shared` and `components/ui` before adding new ones.
- Place domain API calls under their feature (`features/**/api`) unless truly global.
- Keep global reusable helpers in `lib/` (not feature folders).

## API and Data-Fetching Rules

- Use `api` from `@/lib/config/axiosInstance` for backend API calls.
- Do not create new ad-hoc axios instances unless there is a strong, documented reason.
- Use React Query for async server state in client components.
- Use stable query keys and invalidate/refetch only related keys after mutations.
- Normalize and show API errors via existing helpers (for example `getApiErrorMessage`).

## Auth and Routing Rules

- Do not bypass or duplicate auth/role redirect logic from `proxy.ts` and `lib/config/route.ts`.
- Company-only pages must remain under `/company` flows.
- Keep token handling aligned with current cookie-based behavior and axios interceptor logic.

## i18n Rules

- All new user-facing strings must be translatable.
- Add new translation keys to:
  - `languages/en.json`, `languages/ar.json`, `languages/de.json`
  - `languages/company/en.json`, `languages/company/ar.json`, `languages/company/de.json` (if company-specific)
- Use `useI18n()` in client components for text labels.
- Preserve RTL/LTR behavior from `I18nProvider`.

## Form and Validation Rules

- Use React Hook Form for non-trivial forms.
- Use Zod schemas for validation in feature-level `schema` folders when possible.
- Keep validation messages consistent with translation strategy.

## Styling and UI Rules

- Follow existing style patterns in the touched area; do not redesign unrelated screens.
- Prefer reusable components and utility classes over one-off duplicated markup.
- Keep responsive behavior intact on mobile and desktop.

## Code Quality Rules

- Keep TypeScript types explicit for public function inputs/outputs.
- Avoid `any`; if unavoidable, isolate and document why.
- Keep files focused; split large components/hooks when complexity grows.
- Do not introduce unrelated refactors in the same change.

## Change Safety Checklist

Before finishing any task:

- Run `npm run lint` on touched files or full repo when practical.
- Run `npm run build` for changes affecting routing, config, or shared foundations.
- Verify i18n keys exist for any new UI text.
- Verify role-based navigation still works for client/company paths.

