---

````markdown
# Level 1: Static Architecture & Interactive Performance Engine

This level focuses on core web standards—building a modern digital agency platform (**SpeedCraft Labs**) using native web APIs. The goal was to build layout systems, interactive particle physics, and performance simulation tools without relying on external libraries, JavaScript frameworks, or build tools.

---

## 📂 Level 1 Directory Structure

```text
level-1/
├── task-1-static-agency/          # Pure HTML5 & CSS3 agency website
│   ├── index.html                 # Landing page & service hero
│   ├── about.html                 # Company backstory & team profiles
│   ├── contact.html               # General inquiry form interface
│   └── assets/
│       ├── css/
│       │   ├── style.css          # Core visual layout and components
│       │   └── variables.css      # Design system tokens (colors, type, spacing)
│       └── images/                # Static visual assets and icons
│
└── task-3-interactive-hub/        # Dynamic engine & client-side sandbox
    ├── index.html                 # Main landing hub with canvas background
    ├── about.html                 # Interactive agency overview
    ├── contact.html               # Form layout with client-side validation
    └── assets/
        ├── css/
        │   ├── style.css          # Extended site styles & sandbox layout
        │   └── variables.css      # Shared CSS custom properties
        ├── images/                # Visual media assets
        └── js/
            ├── sandBox.js         # Interactive performance budget engine
            └── validator.js       # Native client-side form validation logic
```

````

---

## 🛠️ Tasks Breakdown

### Task 1: Modern Static Agency Website (`task-1-static-agency`)

Focuses on semantic markup, responsive design principles, and centralized CSS architecture.

- **CSS Custom Properties**: Centralized design tokens defined in `variables.css` manage color palettes, typography scales, z-index layers, and border radii across all pages.
- **Hybrid Layout Systems**: Utilizes CSS Grid for two-dimensional page section layouts alongside Flexbox for directional navigation bars and component alignment.
- **Semantic HTML Architecture**: Built using structural tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) to maintain high accessibility and clean DOM structure.
- **Multi-Page Layout**: Scalable multi-page routing layout spanning Home, About, and Contact pages with persistent responsive header and footer controls.

---

### Task 3: Interactive Engine & Performance Sandbox (`task-3-interactive-hub`)

Extends the base platform into a dynamic browser experience powered entirely by Vanilla JavaScript (ES6+).

- **Performance Budget Simulator (`sandBox.js`)**: An interactive tool that dynamically estimates Largest Contentful Paint (LCP) timings and user retention probability based on user-adjusted page weight sliders. Diagnostic outputs stream directly into a custom DOM-rendered terminal console.
- **Hardware-Accelerated Pointer Physics**: A custom cursor-tracking dot built on `requestAnimationFrame` render loops, preventing layout thrashing and main-thread visual lag.
- **Interactive Canvas Particle Mesh**: Animated background network rendered directly on an HTML5 `<canvas>` element using distance-calculation algorithms and velocity vectors.
- **Intersection Observer Animations**: Scroll-triggered element reveals and animated numerical metric counters executed only when targeted DOM nodes enter the viewport.
- **Client-Side Validation & Feedback (`validator.js`)**: Real-time form validation inspecting input rules on the fly, emitting context-aware toast notification overlays without full-page reloads.

---

## 💻 Technical Highlights & Native Browser APIs

| Feature             | API / Technology        | Execution Strategy                                                              |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| **Design System**   | CSS Custom Properties   | Single source of truth in `variables.css` for instant runtime theme updates     |
| **Particle Mesh**   | HTML5 Canvas API        | Low-overhead dynamic rendering loop for ambient background graphics             |
| **Scroll Reveal**   | `IntersectionObserver`  | Asynchronous viewport evaluation preventing scroll-event listener overhead      |
| **Cursor Tracking** | `requestAnimationFrame` | Decoupled cursor positioning from standard mousemove throttles                  |
| **Form Handling**   | Vanilla DOM Events      | Pattern matching, immediate visual error state triggers, and custom toast stack |

---

## 🚀 Local Setup & Testing

No package installation or build steps (`npm install`, Vite, Webpack) are required.

1. **Clone the repository**:

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

```

2. **Run Task 1 (Static Agency)**:
   Open `level-1/task-1-static-agency/index.html` directly in any standard browser.
3. **Run Task 3 (Interactive Sandbox)**:
   Open `level-1/task-3-interactive-hub/index.html` directly in your browser or run via VS Code **Live Server** to preview active performance simulation tools.

---

## 📌 Development Constraints

- **Zero Third-Party Libraries**: Built without jQuery, React, Bootstrap, or utility frameworks.
- **Scoped Component Isolation**: Interactive sandbox widgets are scoped under dedicated CSS namespaces (e.g., `.sandbox__grid`) to guarantee zero style bleed into static content pages.
- **Hardware Efficiency**: Canvas frame updates and scroll-based triggers rely strictly on asynchronous web APIs to ensure smooth framerates on lower-end devices.

```

```
````
