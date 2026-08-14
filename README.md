---

````markdown
# Web Engineering Internship Workspace

A production-focused monorepo documenting progression across web development architecture—from native browser APIs and zero-dependency performance engines to component-driven React dashboards and full-stack application systems.

---

## 📂 Repository Architecture

```text
.
├── level-1/                            # Level 1: Native Web Standards & Performance
│   ├── task-1-static-agency/           # Semantic HTML5 & CSS variable agency platform
│   └── task-3-interactive-hub/         # Vanilla JS performance budget engine & canvas physics
│
├── level-2/                            # Level 2: Component Architecture & Live Data
│   └── task-1-and-3-weather-app/       # AeroCast: React 18 weather dashboard & custom SVG charting
│
├── level-3/                            # Level 3: Full-Stack Platform Engineering
│   └── task-1-and-2-fullstack-app/     # DevVolt: Full-stack prompt engineering workspace
│       ├── client/                     # React 18 frontend with Tailwind CSS & React Router v6
│       └── server/                     # Node.js/Express REST API with JWT auth & MongoDB Atlas
│
└── README.md                           # Master workspace documentation
```

````

---

## 🛠️ Level Breakdown & Engineering Roadmap

### [Level 1: Native Web Standards & Interactive Engines](https://www.google.com/search?q=./level-1)

Focuses on building high-performance interfaces using pure web APIs, zero build tools, and no external third-party dependencies.

- **Task 1 (Static Agency Platform)**: Multi-page agency site (**SpeedCraft Labs**) utilizing semantic HTML5 tags, hybrid CSS Grid/Flexbox layouts, and global design tokens managed in `variables.css`.
- **Task 3 (Interactive Engine & Sandbox)**: Features a real-time Performance Budget Simulator calculating estimated LCP timings and streaming diagnostic logs to a custom DOM console, hardware-accelerated pointer physics via `requestAnimationFrame`, an HTML5 particle canvas mesh, and `IntersectionObserver` scroll animations.

---

### [Level 2: AeroCast Weather Dashboard](https://www.google.com/search?q=./level-2/task-1-and-3-weather-app)

Focuses on modern frontend engineering with React 18, Vite, and live asynchronous data streams.

- **Feature-Sliced Architecture**: Codebase isolated by domain (`features/search`, `features/weather`, `shared`) to optimize code maintainability and long-term scaling.
- **Debounced Geocoding & Request Guarding**: Custom `useGeocoding` hook implementing a 400ms search debounce, `Map`-backed query caching, and `AbortController` cancellation for rapid user inputs.
- **Zero-Dependency SVG Graph Engine**: Custom Catmull-Rom spline algorithms mapping discrete hourly temperature/precipitation API data directly into smooth SVG paths without external charting libraries.
- **Persistence & Context**: Local storage synchronization for temperature scale preferences (`°C` / `°F`) and city defaults.

---

### [Level 3: DevVolt Full-Stack Workspace](https://www.google.com/search?q=./level-3/task-1-and-2-fullstack-app)

Focuses on end-to-end full-stack software development, RESTful API design, authentication state management, and user data persistence.

- **Client Architecture (`/client`)**: React 18 single-page application built with Vite and Tailwind CSS. Implements guarded routing (`React Router v6`), centralized auth context (`AuthContext`), and custom UI modals (`PromptModal`) that parse dynamic token placeholders (`{{variable_name}}`) into real-time input fields.
- **Server Architecture (`/server`)**: Modular Node.js & Express REST API using MongoDB Atlas (via Mongoose). Integrates bcrypt password hashing, stateless JWT authentication, centralized middleware error handling, and robust CORS/environment security.

---

## ⚡ Technical Matrix

| Level       | Scope              | Core Technologies                             | Key Architecture Concepts                                                          |
| ----------- | ------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Level 1** | Native Frontend    | HTML5, Modern CSS3, Vanilla JS (ES6+)         | CSS Custom Properties, Canvas API, `requestAnimationFrame`, `IntersectionObserver` |
| **Level 2** | React Architecture | React 18, Vite, Scoped CSS, Open-Meteo API    | Feature-Sliced design, debounced API caching, Catmull-Rom SVG path mathematics     |
| **Level 3** | Full-Stack System  | React 18, Node.js, Express, MongoDB, Tailwind | JWT session handling, protected layout guards, dynamic token parsing               |

---

## 💻 Local Setup & Development

Refer to the individual `README.md` files in each directory for granular execution instructions.

### Quick Start Shortcuts

1. **Level 1 (Static Engine)**:

```bash
# Open directly in browser without installation
open level-1/task-3-interactive-hub/index.html

```

2. **Level 2 (AeroCast Dashboard)**:

```bash
cd level-2/task-1-and-3-weather-app
npm install
npm run dev

```

3. **Level 3 (DevVolt Full-Stack)**:

```bash
# Terminal 1: Start Backend API
cd level-3/task-1-and-2-fullstack-app/server
npm install
npm run dev

# Terminal 2: Start Frontend Client
cd level-3/task-1-and-2-fullstack-app/client
npm install
npm run dev

```

---

## 📌 Engineering Principles

- **Native Standards First**: Maximum performance is achieved by mastering low-level browser APIs before introducing frameworks.
- **Zero unnecessary bloat**: Heavy third-party packages are avoided whenever native mathematics, standard web APIs, or simple custom utilities can achieve the same result cleanly.
- **Scalable Directory Hygiene**: Strict isolation of global styling, feature modules, and client-server boundaries across all project directories.

```

```
````
