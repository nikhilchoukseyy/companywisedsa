# Company-Wise DSA Prep Platform

A full-stack interview preparation platform for practicing company-wise LeetCode problems. The current app lets users browse companies, filter questions by time range and difficulty, open problems in an in-browser editor, and run code. The production direction is to add real user accounts, solved-question tracking, profile analytics, company-wise progress, and persistent preferences backed by MongoDB and cookies.

## Project Status

This project is currently in active development.

Implemented today:

- React frontend for browsing company-wise DSA questions.
- Responsive desktop and mobile UI with sidebar navigation and mobile drawer.
- Company search.
- Question search by title or topic.
- Difficulty filters for `ALL`, `EASY`, `MEDIUM`, and `HARD`.
- Time-range tabs such as `30 Days`, `3 Months`, `6 Months`, `6M+`, and `All`.
- Page-wise question navigation with `25` questions per page.
- Monaco code editor for solving questions.
- Remote code execution through the Piston API.
- Express backend scaffold.
- MongoDB user model with preferences and solved-question storage fields.
- Cookie-based auth API scaffold.
- Dashboard/progress API scaffold.
- Shared question ID generation for linking frontend CSV rows to backend progress.

Planned / partially wired:

- Login and signup UI.
- Authenticated frontend session state.
- Mark solved / unsolved buttons in the question table.
- Profile dashboard UI.
- Easy / Medium / Hard solved counts.
- Company-wise progress charts or tables.
- Persisted user preferences on reload.
- Production deployment configuration.

## Product Goal

The goal is to become a production-ready DSA preparation app where users can:

- Create an account.
- Log in securely.
- Browse company-wise LeetCode questions.
- Mark questions as solved.
- Track solved questions across reloads and devices.
- See profile-level progress.
- View solved counts by difficulty.
- View company-wise progress.
- Continue from their last selected company, file, filters, and preferred language.
- Use cookies and server-backed storage so their data does not disappear on page reload.

## Repository Structure

```text
companiesdsapyq/
  react/
    public/data/
      index.json
      <Company Name>/
        1. Thirty Days.csv
        2. Three Months.csv
        3. Six Months.csv
        4. More Than Six Months.csv
        5. All.csv
    src/
      components/
        CodeEditor.jsx
        CompanyList.jsx
        QuestionTable.jsx
      utils/
        api.js
        csvLoader.js
        preferences.js
        questionId.js
      App.jsx
      index.css
      main.jsx
    package.json
    vite.config.js

  server/
    src/
      middleware/
        auth.js
      models/
        User.js
      routes/
        authRoutes.js
        userRoutes.js
      services/
        catalogService.js
      app.js
      config.js
      db.js
      server.js
    .env.example
    package.json

  leetcode-company-wise-problems/
    Original source CSV data copy.
```

## Frontend Architecture

The frontend is a Vite + React app located in `react/`.

Main files:

- `src/App.jsx`: top-level app shell, company selection state, mobile sidebar state, question loading, and routing between the table and editor views.
- `src/components/CompanyList.jsx`: searchable company sidebar.
- `src/components/QuestionTable.jsx`: company question table, filters, time-range tabs, pagination, and solve-entry actions.
- `src/components/CodeEditor.jsx`: Monaco editor, language selector, code execution, output panel, and LeetCode link.
- `src/utils/csvLoader.js`: loads `public/data/index.json` and parses company CSV files with PapaParse.
- `src/utils/questionId.js`: creates stable question IDs from LeetCode links or titles.
- `src/utils/api.js`: frontend API client for auth, preferences, solved-state, and dashboard endpoints.
- `src/utils/preferences.js`: cookie helpers for guest/user preference persistence.
- `src/index.css`: global responsive UI system.

### Current Frontend Flow

1. App loads `public/data/index.json`.
2. Company names are shown in the sidebar.
3. User selects a company.
4. App chooses `5. All.csv` by default.
5. CSV rows are parsed into question objects.
6. User can search, filter, switch time windows, and paginate.
7. User clicks `Solve`.
8. The Monaco editor opens with starter code.
9. User can run code using the Piston execution API.

### Current Responsive Behavior

- Desktop uses a persistent company sidebar.
- Mobile uses a hamburger button and slide-out sidebar.
- Empty state has a `Start` button that opens the company menu.
- Question rows become mobile cards on smaller screens.
- Pagination replaces infinite vertical scrolling.
- Text is configured to wrap inside boundaries where possible.

## Backend Architecture

The backend is an Express + MongoDB API located in `server/`.

Main files:

- `src/server.js`: starts the API server.
- `src/app.js`: creates the Express app, configures CORS, JSON parsing, cookies, routes, and error handling.
- `src/config.js`: reads environment variables.
- `src/db.js`: connects to MongoDB through Mongoose.
- `src/models/User.js`: user schema with account details, solved question IDs, and preferences.
- `src/middleware/auth.js`: validates auth cookies and loads the current user.
- `src/routes/authRoutes.js`: register, login, logout, and current-user endpoints.
- `src/routes/userRoutes.js`: dashboard, preferences, mark solved, and unmark solved endpoints.
- `src/services/catalogService.js`: reads the CSV catalog, normalizes question IDs, calculates difficulty totals, and builds user dashboards.

### Backend Responsibilities

- Own user accounts.
- Hash passwords with `bcryptjs`.
- Store auth sessions in HTTP-only cookies using JWT.
- Store user preferences in MongoDB.
- Store solved question IDs in MongoDB.
- Compute dashboard stats from the CSV question catalog.
- Return company-wise progress.
- Return solved question lists.
- Keep progress consistent across reloads and devices.

## Data Model

### User

Stored in MongoDB through Mongoose.

```js
{
  name: String,
  email: String,
  passwordHash: String,
  solvedQuestionIds: [String],
  preferences: {
    lastCompany: String,
    lastFile: String,
    difficultyFilter: String,
    pageSize: Number,
    preferredLanguage: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Question Catalog

Questions are currently sourced from CSV files under `react/public/data`.

Each CSV row includes:

```text
Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
```

The app generates a stable `questionId` from the LeetCode URL slug. For example:

```text
https://leetcode.com/problems/two-sum -> two-sum
```

This lets the backend store solved status once per unique problem, even if the same question appears under multiple companies.

## Planned Production Features

### Account System

- Signup with name, email, and password.
- Login with email and password.
- Logout.
- Persistent session through HTTP-only cookies.
- Current-user endpoint for reload recovery.
- Protected routes for profile and progress.

### Solved Question Tracking

- Mark a question as solved.
- Unmark a question.
- Show solved state in question table.
- Sync solved state to MongoDB.
- Keep solved data after reload.
- Share solved state across companies when the same LeetCode problem appears in multiple lists.

### Profile and Analytics

- Total unique solved questions.
- Total available unique questions.
- Easy solved / total.
- Medium solved / total.
- Hard solved / total.
- Company-wise solved count.
- Company-wise completion percentage.
- Solved question list.
- Recent activity, later if timestamps are added per solved event.

### Preferences

Preferences should be stored in MongoDB for logged-in users and cookies for guest fallback.

Target preferences:

- Last selected company.
- Last selected time range.
- Last selected difficulty filter.
- Preferred page size.
- Preferred editor language.

## API Design

Base URL in local development:

```text
http://localhost:4000/api
```

### Health

```http
GET /api/health
```

Returns:

```json
{ "ok": true }
```

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### User

```http
GET /api/users/me/dashboard
PATCH /api/users/me/preferences
PUT /api/users/me/solved/:questionId
DELETE /api/users/me/solved/:questionId
```

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS base setup
- Plain CSS for custom responsive UI
- Monaco Editor through `@monaco-editor/react`
- PapaParse for CSV loading
- Piston API for code execution

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- dotenv
- csv-parse
- nodemon for development

### Data

- Company-wise CSV files.
- `index.json` company manifest.
- MongoDB for users, preferences, and solved progress.

## Local Development Setup

### Prerequisites

- Node.js 18 or newer.
- npm.
- MongoDB running locally or a MongoDB Atlas connection string.

### Frontend

```bash
cd react
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, create `.env` from the example with:

```powershell
Copy-Item .env.example .env
```

Then edit:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/companiesdsa
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Default backend URL:

```text
http://localhost:4000
```

### Frontend API Environment

Create `react/.env` if the API URL changes:

```env
VITE_API_URL=http://localhost:4000/api
```

## Build Commands

Frontend production build:

```bash
cd react
npm run build
```

Backend production start:

```bash
cd server
npm start
```

## Deployment Notes

For production, the app should be deployed with:

- Frontend hosted on Vercel, Netlify, or a static hosting provider.
- Backend hosted on Render, Railway, Fly.io, AWS, or another Node-capable platform.
- MongoDB Atlas for managed MongoDB.
- `JWT_SECRET` set to a long random secret.
- `CLIENT_ORIGIN` set to the deployed frontend origin.
- Secure cookies enabled through `NODE_ENV=production`.
- HTTPS enabled on both frontend and backend.

## Security Notes

Current backend security direction:

- Passwords are hashed with bcrypt.
- JWT is stored in an HTTP-only cookie.
- Cookie uses `secure: true` in production.
- CORS is limited through `CLIENT_ORIGIN`.

Recommended before production:

- Add request validation with a library such as Zod or Joi.
- Add rate limiting for auth endpoints.
- Add stronger error handling and logging.
- Add password reset flow.
- Add email verification if public signup is enabled.
- Add CSRF protection if expanding cookie-auth write APIs.
- Add audit fields for solved question history.

## Known Gaps

- Frontend auth UI is not fully connected yet.
- Solved buttons are not yet visible in the question table.
- Profile/dashboard UI is not yet built.
- Backend package metadata may need a dependency audit before production.
- No automated tests are currently present.
- The CSV catalog is file-based; future work could move normalized questions into MongoDB.

## Suggested Next Steps

1. Finish frontend auth state and auth modal/pages.
2. Add mark solved / unsolved UI to `QuestionTable`.
3. Load solved state from `/api/auth/me` on app start.
4. Persist user preferences on company, file, filter, page size, and language changes.
5. Build profile dashboard with totals and company-wise progress.
6. Add validation and rate limiting to the backend.
7. Add tests for auth, progress calculation, and question ID normalization.
8. Prepare deployment environment variables and hosting setup.

## Project Summary

Company-Wise DSA Prep Platform is evolving from a static CSV-powered React practice tool into a production-ready full-stack interview preparation product. The frontend already supports company browsing, filtering, pagination, responsive UI, and code execution. The backend foundation introduces MongoDB users, cookie-based authentication, solved-question persistence, and progress analytics. Once the remaining frontend wiring is complete, users will be able to create accounts, keep their progress permanently, and track preparation across companies and difficulty levels.
