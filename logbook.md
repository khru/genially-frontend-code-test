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

## 🧪 Testing Improvements

- Introduced React Testing Library coverage for `App`, focusing on user-visible behaviour of the toolbar and canvas updates.
- Reset MobX-State-Tree snapshots between tests to keep suites deterministic and isolated.
- Documented a TDD-first testing approach in `AGENTS.md` so future changes start with failing tests.

## ✅ Outcome

- The app now runs on a unified Node.js 22 baseline.
- The codebase is fully TypeScript-based with consistent editor standards and accessible documentation.
