# Adversarial Correctness Evaluation Report

## Challenge Summary

**Overall risk assessment**: CRITICAL

While the system is robust against injection attacks (SQL injection, XSS), it has a **CRITICAL** build-blocking TypeScript compiler bug and several **MEDIUM** validation gaps in the database insertion layer that permit out-of-bounds pricing, whitespace-only names, and whitespace-only images.

---

## Challenges

### [Critical] Build Blocker: Redundant TypeScript Type Narrowing Check

- **Assumption challenged**: The implementation files compile cleanly under strict TypeScript settings.
- **Attack scenario / Failure mode**: Running `npm run build` fails because of redundant conditional checks on narrowed types in `src/app/list-car/page.tsx`.
- **Blast radius**: Prevents the application from building for production and deploying.
- **Mitigation**: Simplify the inline JSX expressions to avoid checking the mode value when it is already logically impossible for it to take that value. Specifically:
  - On line 413, since `mode !== "rto"` is already the enclosing conditional condition, change `required={step === 3 && mode !== "rto"}` to `required={step === 3}`.
  - On line 430, since `mode !== "sell"` is already the enclosing conditional condition, change `required={step === 3 && mode !== "sell"}` to `required={step === 3}`.

### [Medium] Database Validation Gap: Out-of-Bounds and Negative Pricing

- **Assumption challenged**: Listed car prices are always within the intended range ([50, 1000] for daily rate and [100, 5000] for rent-to-own).
- **Attack scenario**: A user makes a direct HTTP POST request / API invocation bypassing the client-side HTML5 input validators and submits negative or extremely low prices (e.g., `-50` daily, or `$0.01` monthly rent-to-own).
- **Blast radius**: The server action `listCarAction` inside `src/app/actions/cars.ts` accepts these values and inserts them into the `public.cars` database table, leading to database corruption, business logic bypass, and financial loss.
- **Mitigation**: Implement server-side range validation inside `listCarAction` in `src/app/actions/cars.ts`. E.g.:
  ```typescript
  if (pricePerDay !== 0 && (pricePerDay < 50 || pricePerDay > 1000)) {
    return { success: false, error: "Daily rental rate must be between $50 and $1,000." };
  }
  if (rentToOwnPrice !== 0 && (rentToOwnPrice < 100 || rentToOwnPrice > 5000)) {
    return { success: false, error: "Monthly rent-to-own rate must be between $100 and $5,000." };
  }
  ```

### [Medium] Database Validation Gap: Whitespace-Only Car Names

- **Assumption challenged**: Every listed car must have a non-empty, visible name.
- **Attack scenario**: A user inputs `"   "` (spaces) as the car name.
- **Blast radius**: The validation condition `!name` evaluates to `false` because a non-empty string is truthy in JavaScript. This bypasses the validation and inserts a car with a blank name into the database, which looks corrupt in the catalog UI.
- **Mitigation**: Trim the name before validation:
  ```typescript
  const name = (formData.get("name") as string || "").trim();
  ```

### [Medium] Database Validation Gap: Whitespace-Only Image URLs

- **Assumption challenged**: The custom image URL falls back to the template styling if empty.
- **Attack scenario**: A direct server action caller submits `image = "   "` bypassing the UI logic.
- **Blast radius**: It bypasses the `!image` validation check (since `"   "` is truthy) and gets inserted into the database literally. The UI will then try to load the whitespace string as an image src, causing broken image layout.
- **Mitigation**: Trim the image field server-side:
  ```typescript
  const image = (formData.get("image") as string || "").trim();
  ```

### [Low] Unvalidated Image Protocols

- **Assumption challenged**: Only valid image URLs are stored as the car image.
- **Attack scenario**: An attacker inputs a non-image protocol or arbitrary text (e.g. `ftp://foo.bar` or `javascript:alert(1)`) into the custom image URL field.
- **Blast radius**: Stored literally in the database. When rendered inside an `<img>` tag, modern browsers block execution of `javascript:` protocol in the `src` attribute, and React automatically escapes double quotes, preventing XSS. However, it still results in broken image links and potential tracking/SSRF.
- **Mitigation**: Validate that the custom URL starts with `http://`, `https://`, or `/`.

---

## Stress Test Results

- **Standard listing submission** → Success → Success → **PASS**
- **Whitespace-only car name submission** → Blocked with validation error → Stored in database as `"   "` → **FAIL** (Validation Gap)
- **Negative and extremely low pricing submission** → Blocked with validation error → Stored in database as `-50` and `0.01` → **FAIL** (Validation Gap)
- **SQL Injection strings in fields** → Escaped safely via parameterized query → Inserted literally and safely → **PASS**
- **Direct whitespace-only image URL submission** → Blocked or fall back to template → Stored in database as `"   "` → **FAIL** (Validation Gap)
- **Extremely long URL / field values** → Handled without server crash → Stored/inserted successfully → **PASS**

---

## Unchallenged Areas

- **Authentication session retrieval** — out of scope for this review.
