# Codebase Analysis — Car Listing & Selling Features

This analysis covers the current codebase structure, authentication mechanics, database configuration, vehicle assets, and verification procedures for the car listing and selling features of the **NovaRide** application.

---

## 1. Fleet Catalog (`/cars`) Route
- **File Location**: `src/app/cars/page.tsx`
- **Fetching Flow**: 
  - The page is a Client Component (`"use" client`) that wraps its rendering logic under a `<Suspense>` boundary using the `CarsContent` component.
  - On mount, `CarsContent` sets up a `useEffect` that calls the asynchronous method `fetchCars()`.
  - `fetchCars()` executes the Server Action `getCarsAction(filters)` defined in `src/app/actions/cars.ts`.
  - The filter arguments pass search query `searchQuery` (name/model), class category `type`, gearbox configuration `transmission`, and a dynamic price boundary `maxPrice` (daily rate).
- **Backend Query**:
  - `getCarsAction` issues a raw PostgreSQL query:
    ```sql
    SELECT * FROM public.cars WHERE status = 'available' ORDER BY price_per_day ASC
    ```
  - The fetched database records are merged with hardcoded seed data using `mergeFleetCars(dbCars)` defined in `src/lib/fleet-data.ts`. This ensures default seed vehicles are always visible even if the database is empty.
  - The merged collection is then filtered and sorted using `filterFleetCars(cars, filters)` before being returned to the UI.
- **Rendering Flow**:
  - Cars are displayed in a responsive grid using the `<FleetCard>` component (`src/components/FleetCard.tsx`) with the property `showRentToOwn={true}` enabled.
  - A shimmer placeholder (`CarSkeleton`) is displayed during loading states.

---

## 2. Car Listing Portal (`/list-car`) Route
- **File Location**: `src/app/list-car/page.tsx`
- **Status**: Fully implemented and functional multi-step form portal.
- **Form Wizard Steps**:
  1. **Basic Info**: Captures the vehicle name/model text (`name`) and class category drop-down selector (`type`: luxury, sport, sedan, convertible).
  2. **Styling Selection**: Presents a visual selection of 4 template image options (BMW, Audi, Ferrari, Toyota).
  3. **Pricing, Specs & Features**: Collects numeric daily rental price (`price_per_day`), monthly Rent-to-Own lease rate (`rent_to_own_price`), dropdown specifications (`transmission`, `doors`, `passengers`, `bags`), and boolean checkbox amenities (GPS, Bluetooth, Sports Mode, etc.).
- **Authentication Check**:
  - Client-side auth check occurs in a `useEffect` calling `getCurrentUserAction()`.
  - If no session exists, the router immediately redirects the user to `/auth?redirect=/list-car`.
- **Submission Flow**:
  - Form submission parses fields into a `FormData` payload and appends selected template and features array as a comma-separated string.
  - Executes the Server Action `listCarAction(formData)` from `src/app/actions/cars.ts`.
  - `listCarAction` checks user session credentials, verifies non-empty arguments, and executes:
    ```sql
    INSERT INTO public.cars (name, type, image, price_per_day, rent_to_own_price, doors, passengers, bags, transmission, features, host_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ```
  - The `host_id` is automatically set to the active user's ID (`user.id`).
  - Upon success, the page redirects the user to the fleets catalog at `/cars`.

---

## 3. User Authentication & Route Guard Setup
- **Implementation Location**: Core auth utilities are in `src/lib/auth.ts`, with server-exposed wrapper actions in `src/app/actions/auth.ts`.
- **Session Mechanism**:
  - Standard JSON Web Token (JWT) implementation using Node's native `crypto` module (HMAC SHA256 signing using `JWT_SECRET`).
  - Sessions are preserved in a browser cookie named `phillipcars_session` configured with parameters: `httpOnly: true`, `secure: production`, `sameSite: "lax"`, and an expiry of 7 days.
  - User records are stored in a `public.profiles` database table. Passwords are encrypted using a standard PBKDF2 hash system (`hashPassword` / `verifyPassword`).
- **Route Guards**:
  - **No Next.js Middleware**: No root-level `middleware.ts` is defined.
  - **Client-Side Page Protection**: Handled inside `useEffect` by calling `getCurrentUserAction()` and redirecting if the user is unauthenticated (e.g. `/list-car`).
  - **Server Component Level Protection**: For pages like `/cars/[id]` and `/dashboard`, server components execute `getCurrentUserAction()` or `getSessionUser()` to resolve state before rendering client-side wrappers.
  - **Server Action Level Protection**: Writing endpoints (e.g. `listCarAction`, `createBookingAction`) explicitly invoke `getSessionUser()` to enforce credentials on the server side:
    ```typescript
    const user = await getSessionUser();
    if (!user) return { success: false, error: "You must be logged in..." };
    ```

---

## 4. Database Setup & Vehicle Schema
- **Configuration**: PostgreSQL database instance hosted on Supabase (`db.hinfrxdndcxolprdywxc.supabase.co`).
- **Connection Engine**: Managed in `src/lib/db.ts` utilizing the `pg` (node-postgres) connection pool. Uses environment variable `DATABASE_URL` stored in `.env.local`.
- **Database Tables & Schemas**:
  1. **`public.profiles`** (User accounts)
     - `id` (UUID / Text, Primary Key)
     - `email` (Text, Unique, Not Null)
     - `full_name` (Text, Nullable)
     - `phone` (Text, Nullable)
     - `password_hash` (Text, Not Null)
     - `created_at` (Timestamp with timezone)
  2. **`public.cars`** (Vehicle listings)
     - `id` (UUID / Text, Primary Key)
     - `name` (Text, Not Null)
     - `type` (Text, Not Null)
     - `image` (Text, Not Null)
     - `price_per_day` (Numeric/Decimal/Text, Not Null)
     - `rent_to_own_price` (Numeric/Decimal/Text, Not Null)
     - `doors` (Integer, Not Null)
     - `passengers` (Integer, Not Null)
     - `bags` (Integer, Not Null)
     - `transmission` (Text, Not Null)
     - `features` (Text[] or JSON array, Nullable)
     - `host_id` (UUID / Text referencing `profiles.id`, Nullable)
     - `status` (Text, default `'available'`)
     - `created_at` (Timestamp with timezone)
  3. **`public.bookings`** (Reservations)
     - `id` (UUID / Text, Primary Key)
     - `user_id` (UUID / Text referencing `profiles.id`, Not Null)
     - `car_id` (UUID / Text referencing `cars.id`, Not Null)
     - `pickup_location` (Text, Not Null)
     - `pickup_date` (Timestamp with timezone, Not Null)
     - `return_location` (Text, Not Null)
     - `return_date` (Timestamp with timezone, Not Null)
     - `type` (Text: `'rent'` or `'rent_to_own'`, Not Null)
     - `status` (Text: `'confirmed'`, `'cancelled'`)
     - `total_price` (Numeric/Decimal/Text, Not Null)
     - `created_at` (Timestamp with timezone)

---

## 5. Vehicle Styling Templates & Image Assets
- **Asset Storage Location**: All visual files are located inside `/public/images/`.
- **Seed Vehicles (referenced in `src/lib/fleet-data.ts`)**:
  - `Toyota Yaris 2017`: `/images/perfect-fleet-img-4.png`
  - `Mercedes E-Class 2020`: `/images/luxury-collection-img-3.jpg`
  - `BMW M2 2017`: `/images/perfect-fleet-img-1.png`
  - `BMW Z4 Roadster 2021`: `/images/luxury-collection-img-2.jpg`
  - `Audi RS7 2016`: `/images/perfect-fleet-img-2.png`
  - `Porsche 911 Carrera`: `/images/luxury-collection-img-1.jpg`
  - `Ferrari F12 2022`: `/images/perfect-fleet-img-3.png`
- **Form Selectable Templates (`CAR_TEMPLATES` in `src/app/list-car/page.tsx`)**:
  - **BMW M2 Template**: `/images/perfect-fleet-img-1.png`
  - **Audi RS7 Template**: `/images/perfect-fleet-img-2.png`
  - **Ferrari F12 Template**: `/images/perfect-fleet-img-3.png`
  - **Toyota Yaris Template**: `/images/perfect-fleet-img-4.png`

---

## 6. Build and Test Scripts
- **Build Command**: Declared in `package.json` as `"build": "next build"`. Run locally via:
  ```zsh
  npm run build
  ```
  *Verification*: Next.js build compilation executes and succeeds under 10 seconds. All static and server-rendered routes optimize without compile warnings.
- **Test Setup**: No script defined under `"scripts"` in `package.json`. However, `vitest` is a development dependency and `vitest.config.ts` is configured with a `jsdom` testing environment.
- **Running Tests**: Run via command-line interface:
  ```zsh
  npx vitest run
  ```
  *Verification*: Unit tests exist for components and pages (e.g. `CarsPage.test.tsx` and `MagicCursor.test.tsx`). Running the test command succeeds with all 12 tests passing.
