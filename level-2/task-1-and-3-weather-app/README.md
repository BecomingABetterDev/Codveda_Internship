
# Level 2 — AeroCast Weather Dashboard

This directory contains the completed Level 2 project (`task-1-and-3-weather-app`), combining both the baseline React application setup and advanced interactive weather dashboard features into a single production-ready project.

The application is built with React 18 and Vite, consuming live weather data and geocoding from Open-Meteo APIs. It features custom feature-sliced modularity, dynamic UI updates, client-side request caching, and a math-driven SVG trend graph built without external charting libraries.

---

## 📂 Project Structure

```text
level-2/task-1-and-3-weather-app/
├── public/
│   └── Layout/                # Shell layout components (Header, Footer, EmptyState)
├── src/
│   ├── features/
│   │   ├── search/            # Location search & geocoding feature module
│   │   │   ├── components/    # SearchBar & LocationDropdown with scoped CSS
│   │   │   └── hooks/         # useGeocoding hook (debounce, caching, abort control)
│   │   └── weather/           # Core forecasting & weather display module
│   │       ├── components/    # WeatherHero, HourlyCarousel, DailyForecast, MetricsColumn
│   │       └── utils/         # Temperature unit conversion helpers
│   ├── shared/                # Reusable global utilities & visual tokens
│   │   ├── components/        # Lucide icon library wrapper
│   │   ├── services/          # Open-Meteo API service & fetch timeout wrapper
│   │   └── styles/            # CSS variables, theme definitions, and global resets
│   ├── App.jsx                # Root state orchestrator & localStorage persistence
│   └── main.jsx               # React DOM render entry point
├── .eslintrc.cjs               # Code linting configurations
├── package.json               # Project dependencies and runner scripts
└── vite.config.js             # Vite development & build setup
```
````

---

## 🚀 Level 2 Project Overview

The core goal of Level 2 was building a scalable, component-driven React dashboard that handles real-world API data, manages asynchronous state cleanly, and maintains fast rendering speeds under frequent user input.

### Key Implementation Details

#### 1. Search & Geocoding (`features/search`)

- **Debounced Location Lookup**: The `useGeocoding` hook delays API calls by 400ms during active user typing to prevent unnecessary API overhead.
- **Client Cache & Cancellation**: Queries are cached using a JavaScript `Map` inside a `useRef` instance. Pending network requests are automatically cancelled via `AbortController` if the query updates before the previous request resolves.
- **Dropdown Interactivity**: Selecting a result immediately updates top-level location state and populates the weather dashboard.

#### 2. Hero Card & Smart Advisories (`WeatherHero.jsx`)

- **Real-time Overview**: Displays active conditions, location name, country code, temperature, and feels-like values.
- **Dynamic Weather Advisory**: Evaluates live UV, rain probability, and wind chill offsets to automatically display tailored advice (e.g., umbrella alerts, UV warnings, or layering recommendations).

#### 3. Custom SVG Trend Engine (`HourlyCarousel.jsx`)

- **Zero-Dependency Charting**: Instead of pulling in heavy charting libraries, 12-hour temperature and precipitation curves are drawn using native SVG paths.
- **Catmull-Rom to Bezier Mathematics**: Converts discrete hourly data points into smooth, continuous curves rendered directly within the viewport.
- **Interactive Tooltips**: Hovering or focusing on any graph point highlights exact hourly readings via floating tooltips.

#### 4. Extended Metrics & 7-Day Forecast (`MetricsColumn.jsx` & `DailyForecast.jsx`)

- **Auxiliary Metrics Grid**: Summarizes humidity, surface pressure, wind speed, precipitation probability, and UV rating into individual cards.
- **Expandable Daily Cards**: Renders high/low temperature ranges, rain volumes, and UV tags for the upcoming week. Clicking a card expands it to reveal exact sunrise and sunset times.

#### 5. State Persistence & Customization (`App.jsx`)

- **User Preferences**: Temperature units (`°C` / `°F`) and theme selections (`light` / `dark`) automatically sync to `localStorage` and persist across page reloads.
- **Default Location Memory**: Remembers the last searched city on startup and automatically queries current conditions on launch.

---

## 🛠️ Built With

- **React 18**: Component abstraction, custom hooks, `useMemo`, `useRef`, and `useEffect` state syncing.
- **Vite**: Fast development bundling and optimized production builds.
- **Open-Meteo API**: Free, keyless geocoding and forecast weather data endpoints.
- **Lucide React**: Vector icons wrapped inside a unified `Icons.jsx` shared component.
- **Scoped CSS & Custom Properties**: Scoped CSS sheets per component alongside central CSS variables (`variables.css`) for instant theme switching.

---

## 💻 Local Setup & Development

To run this project on your local machine:

```bash
# 1. Navigate to the Level 2 directory from the repo root
cd level-2/task-1-and-3-weather-app

# 2. Install project dependencies
npm install

# 3. Launch the Vite local development server
npm run dev

```

Open your browser and visit `http://localhost:5173` to test the application.

### Additional Scripts

```bash
# Preview production build locally
npm run build
npm run preview

# Run ESLint check
npm run lint

# Format code with Prettier
npm run format

```

---

## 📌 Technical Takeaways

- **Feature-Sliced Design**: Grouping components, hooks, and stylesheets by feature (search, weather, shared) keeps the project readable and easy to extend as new features are added.
- **Raw Math vs Heavy Libraries**: Using custom math functions to render SVG paths keeps bundle sizes tiny while offering complete styling control over graph animations.
- **Defensive Fetching**: All network calls pass through an 8-second timeout guard in `api.js` to handle poor network conditions gracefully without hanging the UI.

```

```
