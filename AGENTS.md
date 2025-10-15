# Repository Guidelines

## Project Structure & Module Organization
- `src/components`: Canvas UI primitives (`App`, `Box`, `Toolbar`, `BoxDraggable`) coordinating layout and interactions.
- `src/stores`: MobX-State-Tree setup (`MainStore`, `models/Box`) orchestrating the collection of boxes and shared editor state.
- `src/tests`: Jest suites (for example `App.test.js`) that mirror user flows; add new specs here.
- `src/utils`: Focused helpers such as `getRandomColor`.
- `public`: Create React App shell assets (HTML, favicons, static copies of images) served verbatim.

## Build, Test & Development Commands
```bash
nvm use          # align with v16.17.1 from .nvmrc
npm install      # install dependencies with the npm lockfile
npm start        # run the dev server on http://localhost:3000
npm test         # execute Jest + React Testing Library in watch mode
npm run build    # create an optimized bundle in build/
```
Run commands from the repository root and prefer npm to keep `package-lock.json` authoritative.

## Coding Style & Naming Conventions
- Rely on the CRA ESLint configuration (`react-app`); warnings surface during `npm start` and `npm test`.
- Use 2-space indentation, semicolons, and double quotes to stay consistent with existing files.
- Name React components with PascalCase files and exports (`BoxDraggable`), while MST models stay singular (`models/Box`).
- Keep presentation in components and move state mutations into MST actions; inject actions through props where needed.
- Group styles under meaningful class prefixes in `src/main.css`; keep inline overrides minimal.

## Testing Guidelines
- Jest and React Testing Library are pre-configured via `src/setupTests.js`; import from `@testing-library/react` by default.
- Name specs `*.test.js` and place them under `src/tests` (or co-locate near the subject file when it aids readability).
- Emphasize behaviour-driven assertions (selection highlights, counters, drag handles) and add regression coverage when store logic changes; run `npm test -- --watchAll=false` for CI parity.

## Commit & Pull Request Guidelines
- Follow the existing history pattern: lowercase Conventional-style prefixes (`feat:`, `fix:`, `chore:`) plus a concise summary.
- Keep commits scoped to one change and explain rationale when touching both store and UI layers.
- Pull requests should outline user-facing impact, list verification steps (command output, GIFs for interactions), and attach screenshots for UI tweaks.

## State Management Notes
- `MainStore` seeds the editor with an initial box via `uuid` and colour helpers; extend it with MST actions for selection, persistence, or undo/redo.
- Export additional models under `src/stores/models` and hydrate them from `MainStore` to keep `src/index.js` lean.
