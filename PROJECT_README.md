## Monasteries Explorer – Full Project Overview

This project is a **full‑stack web application** for exploring Buddhist monasteries in Sikkim, discovering nearby hotels and travel information, and letting users contribute new monastery data. The backend is built with **Node.js, Express, and MongoDB**, and the frontend is a **React + Vite** single‑page app styled with **Tailwind CSS 4.1** using a monk‑inspired color palette (saffron, maroon, warm ambers).

---

### 1. High‑Level Idea

- **Goal**: Make it easy for travellers and spiritual seekers to:
  - Browse curated monasteries with rich details (age, region, features, visitors, rating, coordinates, etc.).
  - Get a **travel guide** for each monastery, including nearby hotels and approximate distances.
  - Book simple visits (demo booking flow).
  - **Contribute** information about monasteries that are missing, and earn contribution points/badges.
- **Design language**:
  - Colors inspired by **monk robes and monasteries** – deep maroons, saffron/orange, and warm amber highlights.
  - Dark, calm backgrounds with soft glows to keep attention on content.
  - Rounded, “pill‑like” buttons and cards to feel welcoming and meditative.

---

### 2. Architecture

- **Backend** (`monastries_backend`)
  - Node.js + Express application.
  - MongoDB via Mongoose for persistence.
  - JWT cookie‑based authentication.
  - Modular routers for:
    - `auth` (signup, login, logout)
    - `profile` (view/edit profile)
    - `request` (connection‑style requests)
    - `user` (feeds, connections)
    - `monastery` (monastery listing, detail, stats, seed data)
    - `travelGuide` (Google Maps‑powered travel guide per monastery)
    - `booking` (simple visit booking)
    - `contribution` (community monastery submissions, moderation, leaderboard, stats)
  - CORS configured to allow the React frontend:
    - `http://localhost:3000`, `3001`, `3002`, and **`http://localhost:5173`** (Vite default).

- **Frontend** (`monastries_frontend`)
  - React 18+ with Vite and **React Router**.
  - Tailwind CSS **v4.1** via **PostCSS** (`@tailwindcss/postcss`).
  - **react-toastify** for success/error notifications across the app.
  - **Routes and pages:**
    - `/` – Home (landing, hero, featured monasteries, experience, quote, contribute CTA).
    - `/login`, `/signup` – Auth with client-side validation matching backend.
    - `/explore` – Monasteries list from API (search, region, age, sort, pagination).
    - `/monastery/:id` – Monastery detail, travel guide, and booking form.
    - `/profile` – Protected; view/edit profile; contribution points and badges.
    - `/bookings` – Protected; my bookings.
    - `/my-contributions` – Protected; list of user’s submitted contributions and status.
    - `/contribute` – Protected; submit new monastery (with validation).
    - `/leaderboard` – Top contributors and contribution stats.
    - `/admin` – Admin-only; review pending contributions (approve/reject, notes, points).
    - `*` – 404 Not Found page.
  - **Auth:** AuthContext (user, login, signup, logout, isAdmin), ProtectedRoute, AdminRoute.
  - **API:** Axios instance with `VITE_API_URL` and `withCredentials: true`; `getErrorMessage()` for toasts.

---

### 3. Backend Features (What We Already Have)

#### 3.1 Authentication (`authRouter`)

- **Signup**: `POST /signup`
  - Validates signup data.
  - Hashes password with **bcrypt**.
  - Creates user and sets **JWT** in a **httpOnly cookie**.
- **Login**: `POST /login`
  - Checks email + password via `validatePassword`.
  - Issues JWT cookie.
- **Logout**: `POST /logout`
  - Clears the `token` cookie.

#### 3.2 Profile (`profileRouter`)

- **Get profile**: `GET /profile` and `GET /profile/view`
- **Edit profile**: `PATCH /profile/edit`
  - Uses `validateEditProfileData` to avoid unsafe updates.

All profile routes are guarded by `userAuth`, which reads the JWT from cookies and attaches `req.user`.

#### 3.3 Monasteries (`monasteryRouter`)

- **List monasteries**: `GET /monasteries`
  - Filters:
    - `region` (`East Sikkim`, `West Sikkim`, etc., or `all`).
    - `age` (`< 200 years`, `200-300 years`, `> 300 years`).
    - Free‑text search via MongoDB `$text`.
  - Sorting: by `name`, `age`, `rating`, or `visitors`.
  - Pagination: `page`, `limit` with a safety cap.
- **Get one monastery**: `GET /monasteries/:id`
- **Stats**: `GET /monasteries/stats/summary`
  - Total monasteries, ancient count, average rating, number of distinct regions.
- **Seed sample data**: `POST /monasteries/seed`
  - Populates the database with curated Sikkim monasteries, including coordinates, features, ratings, and more.

#### 3.4 Travel Guide (`travelGuideRouter`)

- **Full travel guide**: `GET /monasteries/:id/travel-guide`
  - Uses **Google Maps APIs** (Places + Distance Matrix) to:
    - Find nearby hotels within ~10km.
    - Calculate distances and approximate travel durations.
    - Pick a “best” recommended hotel based on rating, distance, and review count.
  - Stores results in a `TravelGuide` collection with:
    - Cached data
    - Last updated time
    - Cache expiry (7 days)
    - API call count
- **Hotel search by coordinates**: `GET /travel-guides/hotels/search`
- **Admin‑style cache clear**: `DELETE /travel-guides/cache/clear`

#### 3.5 Booking (`bookingRouter`)

- **Create booking**: `POST /booking/create` (auth required)
  - Takes `monasteryId`, `monasteryName`, `visitDate`, `numberOfPeople`, optional `contactNumber`.
  - Returns a **booking object** (in‑memory for now) with `bookingId`, user details, and status.
- **My bookings**: `GET /bookings/my` (auth required)
  - Currently returns an empty list placeholder.

#### 3.6 Contributions (`contributionRouter`)

- **Submit monastery**: `POST /contributions/submit` (auth)
  - Validates key fields and coordinates.
  - Prevents duplicates against existing monasteries and existing contributions.
  - Saves a `Contribution` with `pending` status and increments `contributionsCount` on the user.
- **My contributions**: `GET /contributions/my` (auth)
  - Returns user contributions plus statistics (total, pending, approved, rejected, total points).
- **Admin views**:
  - `GET /contributions/pending` – paginated pending contributions.
  - `GET /contributions/all` – paginated + filtered by status, plus global stats.
- **Review contribution**: `POST /contributions/:id/review` (admin)
  - `action = approve/reject`.
  - On approve:
    - Creates a new `Monastery` document from the contribution.
    - Awards contribution points to the contributor.
    - Updates badges (`Explorer`, `Pathfinder`, `Guardian`) based on point thresholds.
  - On reject:
    - Marks contribution with reason.
- **Leaderboard & stats**:
  - `GET /contributions/leaderboard` – top contributors sorted by points.
  - `GET /contributions/stats` – overall contribution numbers and points.

#### 3.7 Connections, Requests, and User Feed

The project reuses “DevTinder” style logic:

- Connection requests (`requestRouter`):
  - `POST /request/send/:status/:toUserId` – send `interested` or `ignored`.
  - `POST /request/review/:status/:requestId` – `accepted` or `rejected`.
  - Extra helper route: `/sikkim-travel-guide` (Wiki + Google APIs) to fetch monasteries and hotels.
- User feed & connections (`userRouter`):
  - `GET /user/requests/received`
  - `GET /user/connections`
  - `GET /user/feed?page=&limit=` – excludes:
    - Logged in user.
    - Users already connected, ignored, or with pending requests.

---

### 4. Frontend Design & Implementation (Tailwind 4.1 + React)

#### 4.1 Tailwind 4.1 Integration (PostCSS)

- Installed:
  - `tailwindcss@^4.1`
  - `@tailwindcss/postcss` (Tailwind as a PostCSS plugin)
  - `postcss`
- `postcss.config.mjs`:
  - Uses: `"@tailwindcss/postcss": {}`
- `src/index.css`:
  - Single import: `@import "tailwindcss";`
- `main.jsx`:
  - Imports `index.css` as the global Tailwind entrypoint.

This follows the **Tailwind v4 PostCSS installation** from the official docs, so no Vite plugin or `tailwind.config.js` is required.

#### 4.2 Monk‑Inspired UI on the Landing Page

The current `App.jsx` is a **single‑page landing experience** that can later be refactored into routes and container components:

- **Layout**
  - Full height gradient background from deep brown/black to maroon and rich rust.
  - Content centered in a `max-w-6xl` container with generous padding.
  - Top navigation with:
    - Logo using a circular gradient badge and a small `ॐ` mark.
    - Brand name: “Sikkim Monastery Explorer”.
    - Links for sections like Explore, Travel Guide, Contribute.

- **Hero**
  - Main heading: “Find your next monastery to disconnect & reflect.”
  - Supporting text explaining the value of the platform.
  - A filter/search surface (currently UI‑only, easy to wire later) with:
    - Search by monastery name.
    - Filter by region.
    - Filter by age.
  - Monk‑robe colors used in gradients and borders:
    - Backgrounds: deep maroons (`#1b1010`, `#2b1814`).
    - Highlights: saffron/orange (`#f97316`, `#facc15`).
    - Accent: dark red (`#b91c1c`).

- **Feature Cards**
  - Small cards showing:
    - Curated list.
    - Travel guide.
    - Community contributions.
  - Each card uses soft rounded corners and subtle borders to keep the UI calm.

- **Right‑Side Highlight Card**
  - Simulated “featured monastery” card for Rumtek Monastery (dummy data for now).
  - Includes:
    - Rich gradient image placeholder.
    - Basic stats: region, established year, rating.
    - Tags like “Tibetan Buddhism”, “Meditation”, “Scenic views”.
    - Primary button: “Plan a calm visit”.
    - Secondary button: “View complete travel guide”.

- **Footer**
  - Mentions the tech stack: Tailwind 4.1 + React.
  - Short sentence describing the palette inspiration.

This UI is intentionally **clean, focused, and ready for data wiring**:
you can later hook the search form to `GET /monasteries`, the highlight card to an API response, and the travel guide button to `GET /monasteries/:id/travel-guide`.

---

### 5. How We “Made It” – Step‑By‑Step Summary

1. **Backend setup**
   - Initialized Node/Express project.
   - Added MongoDB connection and models (User, Monastery, TravelGuide, Contribution, ConnectionRequest, etc.).
   - Implemented authentication middleware using JWT cookies.
   - Created modular routers for each domain: auth, profile, monasteries, travel guides, bookings, contributions, connections, and feeds.
   - Integrated external APIs (Wikipedia, Google Maps/Places/Distance Matrix) to enrich monastery and travel data.
   - Added seed data and stats endpoints.

2. **Frontend setup**
   - Created Vite React app `monastries_frontend`.
   - Installed `tailwindcss`, `@tailwindcss/postcss`, and `postcss`; added `postcss.config.mjs` and `@import "tailwindcss";` in `index.css`.
   - Added React Router, react-toastify, axios, and Lucide icons.

3. **Design system**
   - Picked a **monk robe** palette:
     - Deep brown/black backgrounds for focus and calm.
     - Maroons for structure (cards, borders, surfaces).
     - Saffron/amber gradients for primary actions and highlights.
   - Kept typography simple, with a bias toward clarity and readability.
   - Used Tailwind utility classes for spacing, color, rounding, and shadows.

4. **Initial UI implementation**
   - Replaced the default Vite counter UI with:
     - A branded navigation bar.
     - Hero section with descriptive copy.
     - Search/filter panel ready to connect to the backend.
     - Feature summary cards.
     - Highlight card with two clear CTAs.

5. **CORS & Backend Integration**
   - Updated backend CORS configuration to accept the Vite dev origin at `http://localhost:5173`.
   - Prepared the frontend layout to call backend routes using `axios` and `withCredentials` when you wire in authentication and data.

---

### 6. Possible Future Enhancements

- Persist bookings in the database (currently booking create returns in-memory data; `GET /bookings/my` returns an empty list).
- Connect the home-page hero search/filters directly to `/explore` with query params.
- Light/dark toggle that slightly adjusts monk palette tones.
- Password reset / forgot-password flow.

This file is meant to explain **what the project is and how we built it**, at a high level. For practical, copy‑paste‑ready run instructions, see `RUN_README.md`.

