# Adversarial Evaluation Report

## Challenge Summary

**Overall risk assessment**: LOW

The validations implemented in `src/app/actions/cars.ts` correctly reject whitespace-only names and negative prices on the server side. The test suite contains robust unit and adversarial tests that run successfully, and the production build compiles cleanly.

---

## Challenges

### [Low] Challenge 1: Lack of Range Bounds for Integer Fields (doors, passengers, bags)
- **Assumption challenged**: The server action assumes integer inputs like `doors`, `passengers`, and `bags` are automatically valid or fall back to default values.
- **Attack scenario**: A user sends negative integers (e.g., `-3` doors, `-5` passengers) via API manipulation or raw form submission.
- **Blast radius**: The negative values bypass the falsy fallback (e.g. `parseInt("-3") || 4` yields `-3`) and are stored in the PostgreSQL database directly, corrupting data integrity.
- **Mitigation**: Add range checks in the server action validation (e.g., `if (doors < 0 || passengers < 0 || bags < 0) { return { success: false, error: "Invalid vehicle capacity or structure." }; }`).

### [Low] Challenge 2: Missing Protocol Validation for Custom Image URL
- **Assumption challenged**: The custom image URL input is assumed to be a valid image path or web URL, and is only validated for presence (`!image`).
- **Attack scenario**: An attacker provides a `javascript:...` URL or raw script data, which could lead to stored Cross-Site Scripting (XSS) if the client renders the image URL in an unsafe way (e.g., using `<a>` tags with `href={car.image}` without sanitization, though typically `<img src={car.image}>` restricts scripting).
- **Blast radius**: Potential storage of unsafe URL schemes.
- **Mitigation**: Restrict the image URL using regex to enforce relative paths starting with `/` or HTTP/HTTPS protocols starting with `http://` or `https://`.

---

## Stress Test Results

- **Whitespace-only Name** → Rejected with error `"Please fill in all required fields with valid values."` → Actual: Rejected with expected error → **PASS**
- **Negative Price Rate** → Rejected with error `"Please enter non-negative rates."` → Actual: Rejected with expected error → **PASS**
- **SQL Injection Payload** → Sanitized safely via parameterized query → Actual: SQL parameterization prevents injection → **PASS**
- **Whitespace-only Image URL** → Trimmed and rejected as empty → Actual: Rejected with expected error → **PASS**
- **Extremely Long Image URL** → Handled safely by Next.js & TypeScript code (allowed database/driver to handle constraints) → Actual: Action succeeds without crashing → **PASS**

---

## Unchallenged Areas

- **User Authentication Session Spoofing** — Out of scope. We verified that `listCarAction` retrieves the user context via a server-side session lookup (`getSessionUser()`), which correctly prevents clients from spoofing their host identity.
