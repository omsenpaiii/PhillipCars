# Changes Document - Custom Image URL Support

## Overview
Modified the car listing form in `src/app/list-car/page.tsx` to support providing a custom image URL. If provided, this URL overrides the template image choice. Added a robust suite of unit tests verifying this new behavior.

## Files Modified / Added

### 1. `src/app/list-car/page.tsx`
- **Step 2 (Select Car Template Styling)**:
  - Added a new form group containing a text input field for a custom image URL.
  - Label: `'Or Provide a Custom Image URL'`
  - Placeholder: `'https://example.com/your-car.jpg'`
  - Helper text: `'If provided, this URL will override the selected template.'`
- **handleSubmit Method**:
  - Extracted the value of the custom image URL input.
  - Trimmed any whitespace from the custom image URL.
  - If a non-empty value is provided, appended it to `formData` under the key `"image"`, overriding the selected template image.
  - Otherwise, appended the selected template image to `formData` under the key `"image"`.

### 2. `src/app/list-car/ListCarPage.test.tsx` (New File)
- Added unit tests covering:
  - Rendering of Step 2 with the custom image input and helper text.
  - Form submission using the selected template if the custom image URL is empty/unset.
  - Form submission overriding the template with the trimmed custom image URL when provided.

## Verification
- **Build Status**: Production build (`npm run build`) completed successfully.
- **Unit Tests**: All unit tests (`npx vitest run`) passed successfully, including the 3 new tests.
  - Total test files passed: 3 (MagicCursor, CarsPage, ListCarPage)
  - Total tests passed: 15
