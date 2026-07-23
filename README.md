````
# Web Development Internship Workspace

This repository holds all my completed tasks for the web development internship program. Each level is organized into dedicated directories, starting from pure CSS architecture to interactive dynamic interfaces.

## 📂 Repository Structure

```text
.
├── level-1/
│   ├── task-1-static-agency/      # Base static platform built with pure HTML & CSS
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   └── assets/
│   │       ├── css/               # Modern CSS layout engine & variables
│   │       └── images/
│   └── task-3-interactive-hub/    # Performance engine & interactive sandbox
│       ├── index.html
│       ├── about.html
│       ├── contact.html
│       └── assets/
│           ├── css/
│           ├── images/
│           └── js/                # Native ES6+ script logic (sandbox & validation)
├── .gitignore
└── README.md

````

---

## 🚀 Level 1 Overview

Level 1 focuses on building a modern agency landing platform (**SpeedCraft Labs**). The project demonstrates how far native web APIs can go without relying on third-party frameworks or heavy script libraries.

### Task 1: Modern Static Agency Website (`task-1-static-agency`)

Focuses on semantic HTML structure, responsive layouts, and modern CSS practices.

- **CSS Custom Properties**: Global design tokens (`variables.css`) manage color themes, typography scales, and structural spacing across all pages.
- **Layout Systems**: Built using a hybrid of CSS Grid and Flexbox to ensure clean alignment on desktop, tablet, and mobile viewports.
- **Semantic Structure**: Built with clear HTML tags (`main`, `section`, `article`, `header`, `footer`) for accessibility and structured page hierarchies.
- **Multi-Page Setup**: Fully styled Home, About, and Contact layouts with shared header navigation and responsive layout wrappers.

### Task 3: Interactive Engine & Performance Sandbox (`task-3-interactive-hub`)

Upgrades the base agency site into a dynamic, performance-focused experience using plain JavaScript.

- **Performance Budget Simulator**: An interactive page-weight slider (`sandBox.js`) that dynamically calculates estimated Largest Contentful Paint (LCP) and user retention metrics while streaming diagnostic updates to an interactive terminal interface.
- **Hardware-Accelerated Pointer Physics**: A custom cursor tracking system built using `requestAnimationFrame` render loops for smooth pointer movement without layout thrashing.
- **Interactive Canvas Mesh**: An animated particle network rendered dynamically on a background HTML5 `<canvas>`.
- **Intersection Observer Animations**: On-scroll reveal effects and animated metric counters triggered only when elements enter the viewport.
- **Client-Side Form Handling**: Real-time form validation (`validator.js`) and dynamic system notification toasts to handle missing fields cleanly.

---

## 🛠️ Built With

- **HTML5**: Semantic tags, accessible forms, and native markup.
- **Modern CSS3**: CSS Variables, CSS Grid, Flexbox, and `backdrop-filter` effects.
- **Vanilla JavaScript (ES6+)**: Canvas API, `requestAnimationFrame`, `IntersectionObserver`, and DOM manipulation.

---

## 💻 Local Setup & Development

To view or test the project locally, clone the repository and serve the files directly using any browser:

```bash
# Clone the repository
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

# Navigate into the project folder
cd your-repo-name

# Open Task 1 in your browser
open level-1/task-1-static-agency/index.html

# Open Task 3 in your browser
open level-1/task-3-interactive-hub/index.html

```

_Tip: You can also use VS Code's **Live Server** extension to preview pages with hot-reloading._

---

## 📌 Development Notes

- **Zero Framework Overhead**: Everything runs natively in the browser without build tools like Vite, Webpack, or npm packages.
- **Scoped Styling**: Interactive layouts are isolated using clear class namespaces (such as `.sandbox__grid`) to avoid conflicting with standard site pages.
- **Performance Focused**: All scripts are lightweight and defer non-critical calculations until triggered by user actions.

```

```
