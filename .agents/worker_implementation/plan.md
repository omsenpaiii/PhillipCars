# Implementation Plan — codebase improvements and bug fixes

## 1. Custom Cursor Interactions
- **File**: `src/app/custom.css`
  - Remove `!important` from width and height properties of `#ball`.
  - Remove `width` and `height` properties from `#magic-cursor`.
- **File**: `src/components/MagicCursor.tsx`
  - Initialize React state `mounted`, `disabled`, `cursorText`, `isOpaque`, `visible`.
  - On mount check if pointer is coarse (`window.matchMedia("(pointer: coarse)").matches`). If so, set `disabled` to true.
  - Implement a persistent `requestAnimationFrame` loop on mount to interpolate the cursor ball position from `mouseCoords` ref to `ballCoords` ref.
  - Write `style.left` and `style.top` inline styles directly to `#magic-cursor` and `#ball` using their respective React refs.
  - Hide cursor initially (`opacity: 0`) and toggle visibility state `visible` to `true` on the first `mousemove` event.
  - Optimize selector precedence: use `target.closest("[data-cursor], [data-cursor-text]")` to find the closest element with either attribute, ensuring nested selectors behave correctly.

## 2. Footer Newsletter Button Alignment
- **File**: `src/components/Footer.tsx`
  - Verify spelling is corrected to "Subscribe to our Newsletter" (lines 87-88).
- **File**: `src/app/custom.css`
  - Refactor `.footer-newsletter-form .form-group .section-icon-btn` styles to remove `right: 50px; transform: translate(48px, -50%);` and replace with `right: 4px; top: 50%; transform: translateY(-50%);`.
  - Resize the newsletter button to `width: 38px; height: 38px;` so it stays nested inside the input frame.
  - Ensure `:hover` styling also maintains `transform: translateY(-50%);` to prevent horizontal jumping.

## 3. Dynamic Fleet Hydration
- **File**: `src/app/cars/page.tsx`
  - Add `mounted` state (`const [mounted, setMounted] = useState(false);` set to `true` on client mount).
  - Initialize state variables (`type`, `transmission`, `maxPrice`) to default fallback values (e.g. `"all"`, `"all"`, `500`).
  - Synchronize `type` from `searchParams` in the mount effect.
  - Modify fetch `useEffect` to trigger only when `mounted` is `true`.
  - Check `!mounted || loading` before rendering fleet grid to show skeletons instead of triggering "No Cars Found" flash.

## 4. Build and Verify
- Run `npm run build` inside `/Users/omtomar/Documents/PhillipCars/novaride` and ensure successful compilation.
