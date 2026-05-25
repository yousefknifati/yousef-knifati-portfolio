# Agent Rules

This file defines the working rules for coding agents in this repository. Read the existing code before changing it, keep user work intact, and use these rules when making new decisions.

## Project Description

This repository is a multilingual personal portfolio website built with the Next.js App Router. The active home page is a designer/developer portfolio landing experience with a header, hero content, portrait image, social actions, and statistics section. It is currently being split from a single layout component into smaller home-specific components.

The repository also contains reusable controls, tables, media widgets, form-adjacent components, auth/session helpers, and API infrastructure inherited from a broader application foundation. Do not assume those components imply that corresponding application routes or workflows are active; verify usage before extending them.

## Verified Stack

- Next.js `16.2.4` with the App Router under `app/`.
- React `19.2.4` and TypeScript with `strict: true`.
- Tailwind CSS v4 configured through [app/globals.css](app/globals.css).
- `next/font` using Geist and Geist Mono in [app/layout.tsx](app/layout.tsx).
- Cookie-driven translations for `en`, `ar`, and `de`, provided by [providers/I18nProvider.tsx](providers/I18nProvider.tsx).
- TanStack Query through [providers/ReactQueryProvider.tsx](providers/ReactQueryProvider.tsx).
- Axios API client infrastructure in [lib/config/axiosInstance.ts](lib/config/axiosInstance.ts).
- Zustand stores are present under `lib/store/` for shared client state.
- Motion and UI support packages include Framer Motion, React Icons, React Hot Toast, and React Loading Skeleton.

Do not document or introduce React Hook Form, Zod, MUI, Jest, OpenAPI generation, route groups, or middleware/proxy behavior as established conventions unless they are added by a task and verified in the repository.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

There is currently no `test` script in `package.json`. Do not claim tests ran unless a test setup is added and executed.

## Current Structure

```text
app/
  globals.css               Tailwind theme tokens and global styles
  layout.tsx                Root HTML layout and application providers
  page.tsx                  Home route composition
components/
  layout/                   Reusable layout-level sections and navigation
  shared/                   Shared controls and application primitives
  ui/                       Reusable UI widgets and cards
feature/
  home/components/          Home-page-specific sections under active refactor
languages/
  en.json                   Flat English message dictionary
  ar.json                   Flat Arabic message dictionary
  de.json                   Flat German message dictionary
lib/
  api/                      Shared API helpers
  config/                   Axios and route configuration
  hooks/                    Shared hooks
  store/                    Zustand stores
  utils/                    Reusable utilities
providers/                 App, query, and i18n providers
public/                    Static images and icons
stitch/                    Downloaded design references, not runtime app code
types/                     Shared TypeScript declarations
```

Use the existing singular `feature/` directory for feature-specific work unless a deliberate repository-wide migration is requested. Do not create a parallel `features/` tree.

## Architecture

- Keep Next.js route files in `app/` focused on composition, metadata, and routing concerns.
- Put home-only landing page sections in `feature/home/components/`.
- Put reusable shell pieces such as headers and footers in `components/layout/`.
- Reuse controls from `components/shared/` and widgets from `components/ui/` before creating duplicates.
- Put cross-cutting helpers in `lib/`; keep page-specific display logic close to its feature.
- Treat `stitch/` content as source design reference material. Do not import it into runtime code without an explicit implementation decision.
- When refactoring the current hero, avoid leaving duplicate live implementations in `components/layout/HeroSection.tsx` and `feature/home/components/`.

## Imports And TypeScript

- Use the `@/` alias for project imports.
- Keep imports grouped readably: framework and React, third-party packages, then local modules.
- Prefer exact types over `any`.
- Add `"use client"` only when hooks, context, browser APIs, events, or client-only libraries require it.
- Keep public component props and utility inputs/outputs explicitly typed where they are not obvious from inference.

## Styling And UI

- Use Tailwind utility classes and the design tokens exposed in `app/globals.css`.
- Existing active color tokens include `background`, `foreground`, `primary`, `blue-500`, `yellow-500`, and `red-500`.
- Prefer a shared token over scattering hard-coded color values through components.
- Keep the landing page responsive across mobile and desktop layouts.
- Preserve RTL behavior for Arabic. For direction-dependent layouts or icons, use `dir` or `lang` from `useI18n()`.
- Use `cn` from `@/lib/utils/cn` when conditional Tailwind class assembly grows beyond a simple template expression.
- Keep accessibility intact: meaningful alternative text, labeled controls, `aria-label` on icon-only actions, keyboard access, and visible focus behavior.

## Text And Translations

- New visible UI text must use `useI18n()` and a translation key.
- Add new keys to all three dictionaries:
  - `languages/en.json`
  - `languages/ar.json`
  - `languages/de.json`
- The current dictionaries use flat dotted keys such as `home.heroDescription` and `home.stats.projectsCompleted`; follow that form.
- Keep equivalent keys available across all languages and preserve Arabic RTL presentation.
- Do not replace translations with hard-coded copy while implementing a Stitch or screenshot reference.

## Providers And State

- The root layout reads the `lang` cookie and sets document `lang` and `dir`.
- `AppProviders` mounts query, i18n, top-loader, and toast infrastructure through the current provider chain.
- Use TanStack Query for asynchronous server state when adding data-backed client UI.
- Use local React state for local interactions; use Zustand only where state genuinely needs sharing across components or screens.

## API And Session Infrastructure

- Use the default `api` export from `@/lib/config/axiosInstance` for backend requests.
- Do not add another Axios client or direct base-URL request pattern without a concrete reason.
- The Axios interceptor attaches the auth token when available and applies `Accept-Language`.
- For deliberately public endpoints, the existing convention is `headers: { "x-skip-auth": "1" }`; the interceptor strips this marker before sending the request.
- Use existing helpers such as `getApiErrorMessage` and session-clearing utilities where relevant.
- The route/auth configuration in `lib/config/route.ts` is infrastructure carried in the repository; check active routing before assuming a page or redirect flow exists.

## Images And Design References

- Runtime static assets belong in `public/` and should be consumed through the existing image patterns such as `components/shared/AppImage.tsx`.
- Downloaded Stitch exports under `stitch/` are reference artifacts. Keep them separate from production assets until a screen is implemented.
- When implementing from a design reference, adapt the design to current translation, accessibility, responsiveness, and token conventions instead of pasting generated HTML directly into the app.

## Change Discipline

- Search for existing components, utilities, translation keys, and active usage before adding code.
- Work with existing uncommitted changes; do not discard or overwrite unrelated user edits.
- Keep edits scoped to the requested feature and avoid unrelated cleanup.
- When moving or splitting UI sections, update route composition deliberately and remove duplication only when it is part of the requested implementation.
- Avoid adding dependencies for functionality already covered by the repository.

## Quality Checks

- Run `npm run lint` after TypeScript, JSX, styling, translation, or configuration changes.
- Run `npm run build` for changes affecting routing, root layout, provider boundaries, Next.js configuration, or dependencies.
- For visual landing-page work, check the relevant screen at responsive widths when a local server or browser workflow is available.
- Verify that each new translation key exists in `en`, `ar`, and `de`.
- In the final summary, name changed files and report the checks that actually ran.
