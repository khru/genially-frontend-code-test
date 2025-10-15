# Repository Guidelines

## Project Structure & Module Organization

- `src/components`: Canvas UI primitives (`App`, `Box`, `Toolbar`, `BoxDraggable`) coordinating layout and interactions.
- `src/stores`: MobX-State-Tree setup (`MainStore`, `models/Box`) orchestrating the collection of boxes and shared editor state.
- `src/tests`: Jest suites (for example `App.test.js`) that mirror user flows; add new specs here.
- `src/utils`: Focused helpers such as `getRandomColor`.
- `public`: Create React App shell assets (HTML, favicons, static copies of images) served verbatim.

## Build, Test & Development Commands

```bash
nvm use            # picks the Node 22 LTS declared in .nvmrc
yarn install       # install dependencies using the yarn.lock constraints
yarn start         # run the dev server on http://localhost:3000 (prompts for alternatives if busy)
yarn test          # execute Jest + React Testing Library in watch mode
yarn build         # create an optimized bundle in build/
yarn typecheck     # run the TypeScript compiler in noEmit mode
```

Run all commands from the repository root and keep `yarn.lock` as the single source of dependency truth. Avoid `npm` to prevent mixed lockfiles.

## Coding Style & Naming Conventions

- Rely on the CRA ESLint configuration (`react-app`); warnings surface during `yarn start` and `yarn test`.
- Use 2-space indentation, semicolons, and double quotes to stay consistent with existing files.
- Name React components with PascalCase files and exports (`BoxDraggable`), while MST models stay singular (`models/Box`).
- Keep presentation in components and move state mutations into MST actions; inject actions through props where needed.
- Group styles under meaningful class prefixes in `src/main.css`; keep inline overrides minimal.
- `.editorconfig` enforces these formatting rules automatically—ensure your editor honors it.

## Testing Guidelines

- Jest and React Testing Library are pre-configured via `src/setupTests.ts`; import from `@testing-library/react` by default.
- Name specs `*.test.tsx` (or `*.test.ts` for utilities) and place them under `src/tests` (or co-locate near the subject file when it aids readability).
- Emphasize behaviour-driven assertions (selection highlights, counters, drag handles) and add regression coverage when store logic changes; run `yarn test --watchAll=false` (or `yarn test:ci`) for CI parity.
- Never rely on `--runInBand`; tests must pass under Jest's normal parallel execution so suites remain isolated.
- Follow React Testing Library philosophy: prefer user-facing queries (role, label, text), avoid implementation details, and keep each test focused on a single behavioural assertion.
- Keep tests single-purpose whenever possible—prefer one key expectation per test so failures point to a single root cause.
- Structure test names and bodies using a `Given / When / Then` mindset, e.g. `should render add box control when the app mounts then the button is visible`, and mirror that flow with inline comments.
- Apply a strict red → green → refactor loop:
  - New features: write a failing test that captures the desired behaviour, implement the smallest change to pass it, then iterate.
  - Bug fixes: reproduce the defect with a failing test before touching production code, then make it pass.
  - Legacy code changes: add coverage describing current expectations before refactoring the implementation.
- Keep tests deterministic—no randomness, network calls, or unnecessary mocks; stub only what is essential and assert outcomes, not internal function calls, unless behaviour depends on them.

## Commit & Pull Request Guidelines

- Follow the existing history pattern: lowercase Conventional-style prefixes (`feat:`, `fix:`, `chore:`) plus a concise summary.
- Keep commits scoped to one change and explain rationale when touching both store and UI layers.
- Pull requests should outline user-facing impact, list verification steps (command output, GIFs for interactions), and attach screenshots for UI tweaks.

## State Management Notes

- `MainStore` seeds the editor with an initial box via `uuid` and colour helpers; extend it with MST actions for selection, persistence, or undo/redo.
- Export additional models under `src/stores/models` and hydrate them from `MainStore` to keep `src/index.js` lean.

## Definition of Done

- Do not mark work complete until `yarn typecheck`, `yarn lint`, `yarn test --watchAll=false`, and `yarn format --check .` finish with no errors or warnings.
- Run `yarn lint:staged` (or ensure an equivalent pre-commit hook) before submitting changes so staged files comply with formatting and lint rules.

## Documentation & Knowledge Sharing

- Update `README.md` whenever behaviour changes or new setup steps matter to users or reviewers; keep additions concise and empathetic.
- Keep `AGENTS.md` current—if your workflow evolves (new scripts, linters, deployment steps), amend this guide as part of the change.

## Architecture & Design Principles

- **Ports & Adapters (Hexagonal)**: treat React components as adapters. They consume inputs (DTOs/view models) and emit events, while domain logic sits behind ports (stores/services/hooks) that hide implementation details.
- **Clean Architecture**: keep domain rules independent of frameworks. Flow of dependencies always points from UI → application services → domain models → infrastructure.
- **Dependency Inversion / IoC**: inject domain capabilities through props, context providers, or custom hooks rather than importing implementations. Accept interfaces (ports) and wire concrete adapters at the edge.
- **Separation of Concerns**: presentation components render data; business logic lives in stores/services. Use mapper functions or DTOs to translate between the two so the UI remains domain-agnostic.
- **Business vs Representation**: components should never manipulate MST models or repositories directly; they should receive immutable data structures and callbacks that operate on domain services.
- **Refactoring mindset**: refactor opportunistically—whenever tests are green and the design can improve, restructure without altering behaviour. Prioritise clarity, intent-revealing names, and small, composable functions.
- **Readable code first**: choose descriptive identifiers, keep modules short, and ensure each unit honours single responsibility / separation of concerns.
