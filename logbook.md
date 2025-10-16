# 🗒️ Project Logbook

A concise record of changes made to modernize and standardize the codebase. The project started as a JavaScript React app scaffolded with Create React App on Node.js 16.

## 🔧 Environment & Standards

- Added `.nvmrc` to align the development runtime (moved baseline from Node.js 16 to **Node.js 22**).
- Added `.editorconfig` to enforce consistent editor settings across contributors.

## 📚 Documentation

- Added `AGENTS.md` to surface agent-related context and make it easy to reference within the repo.

## 🛠️ TypeScript Migration

- Migrated the React codebase from **JavaScript to TypeScript**.
- Converted source files to `.ts`/`.tsx` and introduced project-wide typing.

## 🚀 Runtime & Dependencies

- Upgraded the project to **Node.js 22**.
- Updated all dependencies to the latest compatible versions and refreshed the lockfile.
- Added Prettier, ESLint (with React/Testing Library plugins), and lint-staged to automate formatting, linting, and staged-file checks.

## 🧱 Architecture

- `src/domain` now concentrates pure concepts: factories (`BoxFactory`) and ports (`CanvasStateRepository`, `DragAdapter`) with no framework dependencies.
- `src/application` hosts use-case services (`BoxService`, `BoxSelectionService`, `BoxColorService`) that orchestrate the domain and expose operations to the UI/MST layer.
- `src/infrastructure` implements those ports via concrete adapters (`LocalStorageCanvasStateRepository`, `InteractDragAdapter`).
- `src/ui` holds React-specific wiring (for example `DragAdapterProvider`) that injects adapters into components.
- The main store (`src/stores/MainStore.ts`) hydrates state through MST actions (`hydrateBoxes`, `addBoxAtDefaultPosition`) and persists snapshots via the repository, preventing “outside action” mutations while keeping reactivity intact.
- The canvas keeps delegating interaction through callbacks (`updateBoxPosition`, `removeSelectedBoxes`), which preserves the separation between presentation and domain logic.

## 🧪 Testing Improvements

- Introduced React Testing Library coverage for `App`, focusing on user-visible behaviour of the toolbar and canvas updates.
- Reset MobX-State-Tree snapshots between tests to keep suites deterministic and isolated.
- Documented a TDD-first testing approach in `AGENTS.md` so future changes start with failing tests.
- Added unit test suites for the box factory, box service, selection service, box colour service, and service worker to lock down domain and infrastructure behaviour.
- Added drag-and-drop behavioural specs (App + BoxDraggable) using a deterministic interact.js mock to ensure boxes move without pre-selection and persist updated coordinates.
- Added infrastructure coverage for the localStorage repository (including invalid JSON handling) so noisy logs are suppressed in tests while behaviour stays verified.

## ✅ Outcome

- The app now runs on a unified Node.js 22 baseline.
- The codebase is fully TypeScript-based with consistent editor standards and accessible documentation.
