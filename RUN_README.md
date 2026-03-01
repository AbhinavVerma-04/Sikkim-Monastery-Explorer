## How to Run the Monasteries Project Smoothly

This guide focuses only on **running** the project (backend + frontend) on your machine.

---

### 1. Prerequisites

- **Node.js** (recommended: v18+)
- **npm** (comes with Node)
- **MongoDB**:
  - A running MongoDB instance (local or cloud, e.g. MongoDB Atlas).
- (Optional but recommended) **Google Maps API key** if you want live travel‑guide data:
  - Enable **Places API** and **Distance Matrix API** in Google Cloud.

---

### 2. Environment Variables

Go to `monastries_backend` and create a file named `.env`:

```ini
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>/monasteries
JWT_SECRET=your_jwt_secret_here
PORT=4000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

- You can choose any `PORT`, for example `4000`.
- Make sure `DATABASE_URL` matches your MongoDB setup.

#### Frontend (optional)

In `monastries_frontend`, you can create a `.env` file to point to your backend:

```ini
VITE_API_URL=http://localhost:4000
```

Use the same port as `PORT` in the backend `.env`. If you don’t set this, the frontend defaults to `http://localhost:4000`.

---

### 3. Install Dependencies

#### 3.1 Backend

From the root project folder:

```bash
cd monastries_backend
npm install
```

This installs Express, Mongoose, JWT, bcrypt, axios, and other server dependencies.

#### 3.2 Frontend

In a **separate terminal**, from the root project folder:

```bash
cd monastries_frontend
npm install
```

This installs React, Vite, Tailwind CSS 4.1 (via **PostCSS** and `@tailwindcss/postcss`), and other UI packages.

---

### 4. Start the Backend Server

From `monastries_backend`:

```bash
npm run dev
```

or, if you prefer the production script:

```bash
npm start
```

If `PORT` in your `.env` is `4000`, the backend will run at:

```text
http://localhost:4000
```

**Notes:**
- The backend already has **CORS** configured to accept requests from:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://localhost:3002`
  - `http://localhost:5173` (Vite default)
- Keep this backend terminal open while you use the app.

---

### 5. (Optional) Seed Monastery Data

If your `monasteries` collection is empty, you can insert sample data.

With the server running:

1. Use a tool like Postman or cURL.
2. Send a `POST` request to:

```text
POST http://localhost:4000/monasteries/seed
```

If it succeeds, you’ll see a message about how many monasteries were created.

---

### 6. Start the Frontend (React + Vite + Tailwind 4.1)

From `monastries_frontend`:

```bash
npm run dev
```

Vite will print a URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

You should see the **“Sikkim Monastery Explorer”** landing page with:
- Monk‑robe themed gradient background.
- Search + filter panel.
- Highlight card for Rumtek Monastery.

As you build out more pages, this app will call your backend APIs (for monasteries, travel guides, bookings, contributions, etc.).

---

### 7. Keeping Things Smooth

- If you change backend environment variables, **restart** the backend server.
- If you add new frontend dependencies, run:

```bash
cd monastries_frontend
npm install <package-name>
```

- If Vite shows port conflicts, you can:
  - Stop other dev servers running on `5173`, or
  - Start Vite on another port:

    ```bash
    npm run dev -- --port 3000
    ```

    (This still works with the existing CORS configuration.)

---

### 8. Quick Checklist

1. **.env** created inside `monastries_backend` (DATABASE_URL, JWT_SECRET, PORT, GOOGLE_MAPS_API_KEY).
2. `npm install` run in **both**:
   - `monastries_backend`
   - `monastries_frontend`
3. Backend running with `npm run dev` or `npm start`.
4. Frontend running with `npm run dev`.
5. Browser open at the printed Vite URL (usually `http://localhost:5173`).

Once these are all green, your monastery exploration website should be up and running smoothly.

---

### 9. Making an admin user

The **Admin** page (route `/admin`) is only available to users with `role: 'admin'`. To make a user an admin:

1. Sign up or log in as that user once (so the user exists in MongoDB).
2. In MongoDB (Compass, shell, or Atlas UI), find the `users` collection and set the user’s `role` field to `"admin"` (default is `"user"`).
3. Log out and log in again on the website. The “Admin” link will appear in the nav, and you can open `/admin` to review and approve/reject contributions.

