# Code Changes Log

## 1. Custom Cursor Interactions

### `src/app/custom.css`
- Removed `#magic-cursor` properties: `width: 10px !important;` and `height: 10px !important;` to allow dynamic sizing.
- Removed `!important` from `#ball` properties: `width: 8px !important;` and `height: 8px !important;`.

### `src/components/MagicCursor.tsx`
- Refactored state usage: replaced continuous React state updates on mouse moves with `useRef` coordinate variables (`mouseCoords`, `ballCoords`).
- Created a persistent `requestAnimationFrame` loop on mount to smoothly interpolate `#ball`'s position.
- Added direct ref manipulation (`cursorRef` and `ballRef`) to write inline `left` and `top` style attributes directly to the DOM elements.
- Added a `pointer: coarse` media query check to completely hide and disable the cursor on mobile/touchscreen devices.
- Initialized cursor opacity to `0` and transitioned it to `1` only after the first `mousemove` event occurs.
- Fixed selector precedence using `.closest("[data-cursor], [data-cursor-text]")` to find the nearest styling target in the DOM hierarchy.
- Wrapped all `setState` triggers inside `useEffect` in a `setTimeout` callback to resolve React 19's strict eslint rules on synchronous cascading renders.

## 2. Footer Newsletter Button Alignment

### `src/components/Footer.tsx`
- Confirmed spelling is corrected to "Subscribe to our Newsletter" (lines 87-88).

### `src/app/custom.css`
- Refactored `.footer-newsletter-form .form-group .section-icon-btn` positioning rules: replaced `right: 50px; transform: translate(48px, -50%);` with `right: 4px; top: 50%; transform: translateY(-50%);`.
- Added explicit width and height: `width: 38px; height: 38px;` to keep the button nested cleanly inside the input frame across all layouts.
- Updated `.footer-newsletter-form .section-icon-btn:hover` to also use `transform: translateY(-50%);` to prevent horizontal jumping.

## 3. Dynamic Fleet Hydration

### `src/app/cars/page.tsx`
- Added `mounted` state to track when the client hydration is complete.
- Set initial state variables `type`, `transmission`, and `maxPrice` to default fallback values (`"all"`, `"all"`, `500`) to guarantee initial server-rendered markup matches the client markup.
- Synchronized states from `searchParams` in the mount `useEffect` hook using `setTimeout` to avoid synchronous cascading renders.
- Gated the `fetchCars()` API call so it triggers only after `mounted` is `true`.
- Rendered the `CarSkeleton` loading grid if `!mounted || loading` to eliminate any visual flickering or "No Cars Found" flashes before hydration completes.
