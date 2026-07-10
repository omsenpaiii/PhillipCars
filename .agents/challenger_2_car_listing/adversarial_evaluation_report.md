# Adversarial Evaluation Report — Car Listing and Catalog Synchronization

## Challenge Summary

**Overall risk assessment**: HIGH (due to a critical TypeScript type error that blocks the production build, combined with multiple server-side input validation gaps)

---

## Challenges

### [Critical] TypeScript Type Narrowing Error Blocks Production Build
- **Assumption challenged**: The codebase can compile cleanly and build for production using `npm run build`.
- **Attack scenario / Failure mode**: The TypeScript strict compiler flags a type narrowing error in `src/app/list-car/page.tsx` at line 413.
- **Root cause**: 
  Line 401 is: `{mode !== "rto" && (`. 
  Within this JSX block, TypeScript narrows the type of `mode` from `"rent" | "sell" | "rto"` to `"rent" | "sell"`.
  On line 413, the code checks `required={step === 3 && mode !== "rto"}`. Since `mode` is already narrowed and cannot be `"rto"`, checking `mode !== "rto"` is redundant and flagged as a compilation error:
  `Type error: This comparison appears to be unintentional because the types '"rent" | "sell"' and '"rto"' have no overlap.`
- **Blast radius**: The Next.js production build (`npm run build`) fails completely, blocking deployments.
- **Mitigation**: Change line 413 to `required={step === 3}` since it is already guaranteed that `mode !== "rto"` by the outer logical block.

---

### [High] Server Action Input Validation Gaps
- **Assumption challenged**: User input submitted via forms is adequately validated on the backend.
- **Attack scenario / Failure mode**: A malicious user or direct API caller can bypass client-side React form restrictions (e.g. `min`, `max`, `required` inputs) and invoke `listCarAction` Server Action directly with invalid parameters.
  - **Whitespace-only Strings**: If a user submits `name: "   "` or `image: "   "`, `!name` and `!image` evaluate to `false` (since `"   "` has length 3 and is truthy). The database will store the whitespace-only values, causing blank entries in the fleets UI.
  - **Negative Values**: If a user submits a negative price (e.g., `price_per_day: -100`), the Server Action parses it via `parseFloat` which returns `-100`. It passes the `isNaN` check and is inserted into the database.
  - **Negative/Zero Specs**: If `doors`, `passengers`, or `bags` are set to negative values, they are successfully parsed and stored.
- **Blast radius**: Allows listing vehicles with negative prices, negative passengers, negative doors, or empty names, corrupting the database and catalog presentation.
- **Mitigation**: Add server-side validation in `src/app/actions/cars.ts` to trim strings before checking if they are empty, and validate that prices are positive and spec numbers are valid positive integers.

---

### [Medium] Arbitrary Custom Image URL Protocol Validation
- **Assumption challenged**: Custom image URLs provided by users are safe and represent valid image links.
- **Attack scenario / Failure mode**: The `custom_image_url` input and server-side `image` field accept any arbitrary string (e.g., `not-a-url`, `javascript:alert(1)`, or a huge base64 `data:image/png;base64,...`).
- **Blast radius**: 
  - Broken images in the catalog.
  - Potential cross-origin tracking pixels or resources loaded from unverified domains.
  - Database bloat if extremely long Base64 strings are submitted.
- **Mitigation**: Implement a server-side URL parser check in `listCarAction` to verify that the image URL has a valid protocol (`http:` or `https:`) and matches common image extensions, or conforms to a safe regex pattern.

---

### [Medium] Unit Test Coverage Gaps (Authentication & Tab Selection)
- **Assumption challenged**: The unit tests in `ListCarPage.test.tsx` and `CarsPage.test.tsx` adequately cover all client-side logic.
- **Attack scenario / Failure mode**: 
  - **Unauthenticated Redirects**: There are no tests verifying that unauthenticated users are redirected to `/auth?redirect=/list-car`. If this logic is broken, unauthenticated users could access the form.
  - **Error Alerts**: There are no tests verifying that form submission errors are properly rendered to the user as alerts.
  - **Filter Selection Changes**: `CarsPage.test.tsx` tests search form submission and input typing, but does not test whether changing type or transmission filters triggers the dynamic db fetches.
- **Blast radius**: Undetected regression bugs in routing, authentication state handling, and filter-based catalog updates.
- **Mitigation**: Write additional test blocks in `ListCarPage.test.tsx` to mock `getCurrentUserAction` returning `null` and assert redirection, and mock a failed `listCarAction` to assert error rendering. Add tests in `CarsPage.test.tsx` to assert fetch trigger on filter select changes.

---

## Stress Test Results

| Scenario / Input | Expected Behavior | Actual Behavior | Pass/Fail |
|---|---|---|---|
| Whitespace name (`"   "`) | Server rejects submission | Server accepts and inserts `"   "` | **FAIL** (Input validation) |
| Negative daily rate (`-250`) | Server rejects submission | Server accepts and inserts `-250` | **FAIL** (Input validation) |
| Strict TypeScript compilation | Build compiles successfully | Type error in `page.tsx:413` | **FAIL** (Compile error) |
| Running `vitest` tests | All tests pass | 15 tests passed | **PASS** |

---

## Unchallenged Areas

- **Database performance / connection limits**: Not stress-tested under load, though we noted production pool limit is configured to `max: 2`.
- **Database constraints / schema definitions**: We inferred column types from JavaScript parsers but did not directly verify DB-level check constraints.
