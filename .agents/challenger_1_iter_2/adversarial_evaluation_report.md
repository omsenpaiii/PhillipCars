# Adversarial Evaluation Report

**Date**: 2026-07-10
**Agent**: Challenger Subagent (Iteration 2)
**Project**: NovaRide Car Listing Fixes Verification

---

## Challenge Summary

**Overall risk assessment**: LOW

The server-side validation fixes in `src/app/actions/cars.ts` are robust, secure, and properly integrated. They successfully prevent the bypass of field requirements via whitespace injection or negative prices. The accompanying test suite in `src/app/actions/cars.adversarial.test.ts` thoroughly covers adversarial inputs, SQL injection attempts, and edge cases. All unit tests pass, and the application compiles cleanly.

---

## Challenges

### [Low] Challenge 1: Whitespace and Control Characters in Required Fields
- **Assumption challenged**: Simple presence check (`!name`) is sufficient.
- **Attack scenario**: A user sends whitespace or control characters (`\t`, `\n`, ` `) as a name or image URL. Without sanitization, this would bypass basic presence checks and insert a blank listing.
- **Blast radius**: Low. UI layout issues or database pollution with unrenderable/blank entries.
- **Mitigation**: The code uses `.trim()`:
  `const name = (formData.get("name") as string || "").trim();`
  `const image = (formData.get("image") as string || "").trim();`
  This correctly reduces whitespace/tab inputs to `""`, triggering the `!name` and `!image` validations which return a `success: false` response with the error message: `"Please fill in all required fields with valid values."`.

### [Low] Challenge 2: Parsing Trailing Text or Invalid Scientific Notation
- **Assumption challenged**: `parseFloat` is always safe for price fields.
- **Attack scenario**: If a user enters `150abc` or `abc`, `parseFloat` might return a partial value or `NaN`.
- **Blast radius**: Database pollution with incorrect numeric values or execution crash.
- **Mitigation**:
  - `isNaN(pricePerDay) || isNaN(rentToOwnPrice)` check prevents `NaN` values from bypassing.
  - If a user sends `-1e5` (scientific notation), `parseFloat` handles it as `-100000`, which is correctly flagged by `pricePerDay < 0` and rejected.
  - If a user sends `150abc`, `parseFloat` parses it as `150`, which is positive and passes. While it allows trailing junk, it does not crash or violate the non-negativity constraint.

### [Low] Challenge 3: SQL Injection Vulnerability
- **Assumption challenged**: Malicious strings could break the SQL parser or execute arbitrary commands.
- **Attack scenario**: Submitting a name containing SQL escape characters: `Tesla'; DROP TABLE public.cars; --`
- **Blast radius**: High if vulnerable (database drop or unauthorized queries).
- **Mitigation**: Fully mitigated by parameterized queries:
  ```typescript
  await query(
    `INSERT INTO public.cars (name, type, image, price_per_day, rent_to_own_price, doors, passengers, bags, transmission, features, host_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [name, type, image, pricePerDay, rentToOwnPrice, doors, passengers, bags, transmission, features, user.id]
  );
  ```
  The database driver handles the variables safely. Tested via `src/app/actions/cars.adversarial.test.ts` (passed).

---

## Stress Test Results

| Test Scenario | Input / Payload | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| **Whitespace-only Name** | `name: "   "` | Rejection (HTTP/Server action error) | `{ success: false, error: "Please fill in all required fields..." }` | **PASS** |
| **Negative Price per Day** | `price_per_day: "-50"` | Rejection (HTTP/Server action error) | `{ success: false, error: "Please enter non-negative rates." }` | **PASS** |
| **Negative Rent-to-Own Price**| `rent_to_own_price: "-1"` | Rejection (HTTP/Server action error) | `{ success: false, error: "Please enter non-negative rates." }` | **PASS** |
| **SQL Injection Payload** | `name: "Tesla'; DROP TABLE..."` | Database accepts literal string safely | Success response; literal string safely parameterized | **PASS** |
| **Whitespace-only Image URL** | `image: "   "` | Rejection (HTTP/Server action error) | `{ success: false, error: "Please fill in all required fields..." }` | **PASS** |
| **Extremely Long Image URL** | `image: "https://..." + "a"*10000` | Code processes safely without crash | Success response; string safely parameterized | **PASS** |

---

## Unchallenged Areas

- **Database Constraint Limits** — We did not test actual database truncation or overflow behaviors (e.g. if the database table has fixed-size varchar limits on the database server). However, from a server action validation standpoint, code execution remains robust and handled correctly by parameterized queries.
