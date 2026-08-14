````markdown
# DevVolt Client

A React frontend for DevVolt—a developer workspace built for organizing, testing, and filling dynamic AI prompt templates. Built with React 18, Vite, Tailwind CSS, and React Router v6.

---

## Features

- **Authentication & Guarded Routes**: Session persistence managed via React Context (`AuthContext`) and JSON Web Tokens. Public `/login` and `/register` views operate outside the core layout shell.
- **Dynamic Variable Interpolation**: `PromptModal` automatically detects double-curly placeholders (e.g., `{{variable_name}}`) in prompt bodies and renders live input fields to populate them in real time.
- **Prompt Management**: Searchable and categorizable prompt library view (`PromptVault`) with quick creation flows.
- **Interactive Prompt Builder**: Dedicated builder interface for creating new templates with automated placeholder parsing.
- **Profile Management**: In-app modal for updating account credentials, synced instantly across local state and storage.
- **Dark Mode & Design System**: Tailwind-based dark aesthetic with custom canvas, surface, and brand theme tokens.

Here are the refined sections updated with your exact file structure, along with the new Tech Stack & Routing Architecture section.

---

## Directory Structure

``text
src/
├── api/
│   └── axios.js             # Pre-configured Axios instance with authorization headers
├── components/
│   ├── layout/              # Structural container components
│   │   ├── AppShell.jsx     # Master wrapper layout for protected application routes
│   │   ├── Header.jsx       # Top navigation bar with search input & profile triggers
│   │   └── SideBar.jsx      # Side navigation panel and session logout controller
│   ├── modals/              # Dialog and confirmation overlays
│   │   ├── DeleteModal.jsx  # Prompt deletion confirmation modal
│   │   ├── EditPromptModal.jsx # Inline prompt template editor modal
│   │   └── ProfileModal.jsx # Account details & credential modification modal
│   ├── prompts/             # Domain-specific prompt display components
│   │   ├── PromptCard.jsx   # Grid item displaying template preview and actions
│   │   └── PromptModal.jsx  # Variable interpolation & live preview copy modal
│   └── SettingsView.jsx     # Workspace preferences and user configuration view
├── context/
│   └── AuthContext.jsx      # Global auth provider, session state, and storage sync
├── pages/
│   ├── auth/                # Standalone authentication views
│   │   ├── Login.jsx        # User login form view
│   │   └── Register.jsx     # Account registration view
│   ├── AddPrompt.jsx        # View component for constructing new prompt templates
│   ├── Dashboard.jsx        # Primary analytics dashboard and recent activity
│   ├── PromptBuilder.jsx    # Interactive workspace for drafting complex prompts
│   └── PromptVault.jsx      # Searchable directory and vault for saved prompts
├── services/                # API communication abstractions and data helper utilities
├── styles/
│   └── global.css           # Global Tailwind CSS imports and custom utility classes
├── App.jsx                  # Primary route definition table and route guard configuration
└── main.jsx                 # Application entry point with BrowserRouter & AuthProvider wrap
```
````

---

## Tech Stack & System Requirements

### Core Dependencies

| Technology           | Version | Purpose                                              |
| -------------------- | ------- | ---------------------------------------------------- |
| **React**            | `^18.x` | UI component layer and state hooks                   |
| **Vite**             | `^5.x`  | Fast development server and production bundler       |
| **React Router DOM** | `^6.x`  | Client-side declarative route mapping and protection |
| **Axios**            | `^1.x`  | HTTP client featuring request/response interceptors  |
| **Tailwind CSS**     | `^3.x`  | Utility-first styling engine with dark theme support |
| **Lucide React**     | `^0.x`  | UI icon suite                                        |
| **React Hot Toast**  | `^2.x`  | Lightweight notification banners                     |

### Environment Requirements

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **DevVolt API Server**: Local or remote backend service implementing JWT authentication endpoints (`/auth/login`, `/auth/register`, `/auth/me`)

---

## Architecture & Routing Model

```text
                      ┌─────────────────────────┐
                      │    <BrowserRouter>      │
                      └────────────┬────────────┘
                                   │
                      ┌────────────▼────────────┐
                      │     <AuthProvider>      │
                      └────────────┬────────────┘
                                   │
                      ┌────────────▼────────────┐
                      │        <App/>          │
                      └─────┬──────────────┬────┘
                            │              │
         ┌──────────────────┴─┐          ┌─┴───────────────────┐
         │ Public Routes      │          │ Protected Routes    │
         │ (/login, /register)│          │ (/* wildcard path)  │
         └────────────────────┘          └──────────┬──────────┘
                                                    │
                                         ┌──────────▼──────────┐
                                         │  <ProtectedLayout>  │
                                         └──────────┬──────────┘
                                                    │
                                         ┌──────────▼──────────┐
                                         │     <AppShell>      │
                                         │  (Header + Sidebar) │
                                         └──────────┬──────────┘
                                                    │
                                   ┌────────────────┴────────────────┐
                                   │ Nested Views                    │
                                   │ (/ , /prompts, /builder, etc.)  │
                                   └─────────────────────────────────┘

```

The application uses a strict separation between public authentication pages and guarded workspace views to prevent layout bleed and redundant render cycles.

### 1. Root Context Topology

The entire application tree is wrapped in `BrowserRouter` and `AuthProvider` inside `main.jsx`. `AuthProvider` initializes session verification on mount by reading `devvolt_token` from local storage and verifying it against the backend API endpoint (`GET /auth/me`).

### 2. Standalone vs. Protected Routing

In `App.jsx`, routes are divided into two operational scopes:

- **Public Auth Scope (`/login`, `/register`)**: Rendered directly as standalone page components. This guarantees that user authentication flows operate without rendering the surrounding `AppShell` navigation UI (Header and Sidebar).
- **Guarded App Scope (`/*`)**: Encapsulated within a custom `ProtectedLayout` route component. Unauthenticated access requests automatically redirect to `/login` with clean history replacement.

### 3. Layout Nesting & State Preservation

Authenticated requests pass through `ProtectedLayout` into `AppShell`. `AppShell` houses the global application layout (`Header` and `SideBar`) while embedding nested page components (`Dashboard`, `PromptVault`, `PromptBuilder`, `AddPrompt`, and `SettingsView`). Modals operate on top of this structure, driven by localized component state (`PromptModal`, `ProfileModal`, `EditPromptModal`, `DeleteModal`) without unmounting active view routes.

``

---

## Getting Started

### Prerequisites

* **Node.js** (v18.0.0 or higher recommended)
* **npm** or **yarn**
* Running instance of the DevVolt Backend API

### Installation

1. Clone the repository and navigate to the client directory:
```bash
cd devvolt-client

````

2. Install dependencies:

```bash
npm install

```

3. Configure environment variables:
   Copy `.env.example` to `.env` and set your backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
...rest of env.example config.
```

4. Start the development server:

```bash
npm run dev

```

5. Open your browser and go to `http://localhost:5173`.

---

## Production Build

To compile static production assets:

```bash
npm run build

```

To preview the production build locally:

```bash
npm run preview

```

---

## Key Dependencies

- **React Router DOM (`v6`)**: Client-side declarative routing and protected layout nesting.
- **Axios**: HTTP requests with request/response interceptors for token attachment.
- **Lucide React**: Clean, lightweight icon suite.
- **React Hot Toast**: Unobtrusive toast feedback for user actions.
- **Tailwind CSS**: Utility-first styling for dark mode layouts.

``
 Thank you for your visit!
Portfolio: https://eyob-dportfolio.vercel.app

---
```
