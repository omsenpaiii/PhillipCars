# Changes

## 1. Type Narrowing Issues Fixed
- **File**: `src/app/list-car/page.tsx`
- **Line 413**: Changed `required={step === 3 && mode !== "rto"}` to `required={step === 3}`.
- **Line 430**: Changed `required={step === 3 && mode !== "sell"}` to `required={step === 3}`.
- **Why**: Under strict compiler type narrowing, conditional required properties depending on the union state of `mode` and `step` trigger type narrowing mismatches. Checking `step === 3` satisfies the TypeScript compiler while keeping step-based requiredness correct.

## 2. Server-side Validation Added
- **File**: `src/app/actions/cars.ts` (in `listCarAction`)
- **Name Trim**: Trimmed the parsed `name` and checked if empty. If so, returned `{ success: false, error: "Please fill in all required fields with valid values." }`.
- **Image Trim**: Trimmed the parsed `image` and checked if empty. If so, returned `{ success: false, error: "Please fill in all required fields with valid values." }`.
- **Rates Non-negativity**: Added validation to verify `pricePerDay >= 0` and `rentToOwnPrice >= 0`. If not, returned `{ success: false, error: "Please enter non-negative rates." }`.

## 3. Test Updates and Verifications
- **File**: `src/app/actions/cars.adversarial.test.ts`
- **Updates**: Updated the old adversarial tests that previously expected whitespace-only names, negative prices, and whitespace-only image URLs to bypass validation and succeed. These test cases now expect proper validation failure responses (`success: false` with corresponding error messages) and that `query` is not called.
- **Results**: Executed `npx vitest run`. All 21 tests (across 4 test files) passed successfully.

## 4. Production Build Verification
- **Command**: `npm run build`
- **Result**: Production Next.js build completed successfully (including TypeScript/lint checks) without any errors.
