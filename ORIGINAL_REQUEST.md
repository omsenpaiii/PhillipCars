# Original User Request

## Initial Request — 2026-07-08T02:12:48+05:30

Verify and polish the PhillipCars website end-to-end. Clean up cursor behavior, footer alignments, spelling typos, fleets lists, and confirm production readiness.

Working directory: /Users/omtomar/Documents/PhillipCars/novaride
Integrity mode: development

## Requirements

### R1. Custom Cursor Interactions
Verify that the custom cursor handles text-hover expansions (`data-cursor-text`) and opaque circular hovers (`data-cursor`) across all pages.

### R2. Footer Newsletter Button Alignment
Align the subscribe button within the email input frame in the footer and correct the newsletter header spelling.

### R3. Dynamic Fleet Hydration
Ensure that the fleets page [/cars](file:///Users/omtomar/Documents/PhillipCars/novaride/src/app/cars/page.tsx) renders loading skeletons immediately upon initial visit, preventing "No Cars Found" flashes before hydration is complete.

## Acceptance Criteria

### Verification Guardrails
- [ ] Custom cursor text overlay and scaling effects are functional.
- [ ] Footer newsletter button is contained inside the input bar and does not overflow.
- [ ] Spelling typo 'Newsleeters' in footer is fixed.
- [ ] The cars list page loads skeletons during queries instead of empty lists.
- [ ] The application compiles cleanly with `npm run build`.

## Follow-up — 2026-07-10T03:56:52Z

Make the car listing and selling features fully operational end-to-end. Hosts must be able to list vehicles (supporting either pre-provided styling templates or custom image URLs, along with category selection, specs, features, and rates) after logging in. The system must enforce authentication, store listings in Supabase, and display them instantly in the fleets catalog.

Working directory: /Users/omtomar/Documents/PhillipCars/novaride
Integrity mode: development

## Requirements

### R1. Authentication Guardrails for Hosts
Verify that accessing the `/list-car` portal redirects unauthenticated users to `/auth?redirect=/list-car` and allows listing submissions only for logged-in profiles.

### R2. End-to-End Listing with Custom Image Support
Ensure that the listing form supports custom image URL inputs (overriding pre-selected templates if provided). Verify that submitting the multi-step listing form successfully inserts new vehicle records into the database with appropriate specs, custom/template images, and host reference keys.

### R3. Dynamic Fleet Synchronization
Verify that new listings (with custom images and rates) are dynamically loaded and displayed instantly on the `/cars` page, complete with correct rental rates and specifications.

## Acceptance Criteria

### Verification Guardrails
- [ ] Submitting the host listing form successfully adds a new car to the database.
- [ ] Newly listed cars show up immediately in the `/cars` fleet catalog.
- [ ] Custom image URLs entered during listing are correctly rendered in the catalog cards.
- [ ] Unauthenticated users are redirected to login when trying to access `/list-car`.
- [ ] No regression bugs in navbar dropdown or search functionality.
- [ ] Application builds successfully via `npm run build`.
