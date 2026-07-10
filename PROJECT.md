# Project: PhillipCars Car Listing and Selling Features

## Architecture
- **Host Portal (`/list-car`)**: Form-based wizard interface where users input vehicle parameters and choose templates. Checks session on client and server side.
- **Server Action (`listCarAction`)**: Handles the insert statement to input vehicles into `public.cars` database table.
- **Fleet Catalog (`/cars`)**: Fetches available vehicles using server action `getCarsAction()` and filters them on the client side. Includes real-time rendering of catalog cards.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Custom Image Input | Add custom image URL text input to `/list-car/page.tsx` wizard step 2, overriding selected template styling if provided. | None | DONE |
| 2 | Listing Submission Integration | Verify and test database insertion of custom image, rates, and host references via `/list-car`. Ensure auth check works end-to-end. | M1 | DONE |
| 3 | Dynamic Synchronization | Verify new listing display on `/cars` catalog, ensuring no regression in filter, search, and cursor functionalities. Run full test suite. | M2 | DONE |

## Interface Contracts
### `listCarAction(formData: FormData)`
- Input: `FormData` with fields: `name`, `type`, `image` (custom URL or selected template), `price_per_day`, `rent_to_own_price`, `doors`, `passengers`, `bags`, `transmission`, `features`.
- Output: `{ success: true }` or `{ success: false, error: string }`.

## Code Layout
- `src/app/list-car/page.tsx`: Step wizard UI component for listing vehicles.
- `src/app/actions/cars.ts`: Server action for creating and fetching vehicle database records.
- `src/app/cars/page.tsx`: Fleet list component.
- `src/components/FleetCard.tsx`: Display card for a single vehicle.
