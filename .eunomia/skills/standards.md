

# Project Standards — Frontend

## 1. Project Overview

A React-based Todo application that communicates with a backend API (`/api`). The app supports creating, reading, updating, and deleting todos, with filtering by status (all/active/completed) and a stats dashboard. It is a single-page frontend that proxies API requests to a backend server at `localhost:3000`.

## 2. Tech Stack & Versions

| Technology | Version |
|---|---|
| React | ^18.3.1 |
| React DOM | ^18.3.1 |
| TypeScript | ~5.6.2 |
| Vite | ^6.0.3 |
| Vitest | ^4.0.18 |
| Node.js | (runtime) |
| npm | (package manager) |
| ESLint | ^9.16.0 |
| @testing-library/react | ^16.3.2 |
| @testing-library/user-event | ^14.6.1 |
| @testing-library/jest-dom | ^6.9.1 |
| jsdom | ^28.1.0 |

**Module system:** ESM (`"type": "module"` in package.json)

## 3. Design Language

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Primary | `#646cff` | Buttons, active states, focus rings, accent color |
| Primary hover | `#535bf2` | Button hover, link hover (dark mode) |
| Error | `#d32f2f` | Delete buttons, error text |
| Error background | `#ffebee` / `#fff5f5` | Error state containers |
| Error border | `#ffcdd2` / `#ffcccc` | Error state borders |
| Text primary (light) | `#213547` | Body text in light mode |
| Text primary (dark) | `rgba(255, 255, 255, 0.87)` | Body text in dark mode |
| Text secondary | `#666` | Labels, secondary content |
| Text muted | `#999` | Placeholders, counter text |
| Text heading | `#333` | Headings, strong text |
| Background (dark) | `#242424` | Page background dark mode |
| Background (light) | `#ffffff` | Page background light mode |
| Surface | `white` | Card/item backgrounds |
| Surface muted | `#fafafa` / `#f9f9f9` | Loading states, counters, stats |
| Border | `#e0e0e0` | Input borders, item borders |
| Border light | `#f0f0f0` | Section dividers |

### Typography

- **Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`
- **Base font size:** `1rem` (browser default 16px)
- **Line height:** `1.5` (global), `1.2` for headings
- **Font weights:** `400` (normal), `500` (medium/labels), `600` (semibold/values/buttons), `700` (bold/h1)
- **h1:** `2.5rem` desktop → `2rem` tablet → `1.75rem` mobile → `1.5rem` small mobile

### Spacing System

Uses `rem`-based spacing. Common values:

- `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `1.75rem`, `2rem`, `2.5rem`
- Component gaps: `1.5rem` (desktop), `1.25rem` (tablet), `1rem` (mobile)
- Padding: `1rem` internal, `0.875rem` for inputs/buttons

### Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `768px` | Tablet |
| `640px` | Small tablet |
| `480px` | Mobile |
| `320px` | Small mobile (minimum supported) |

Use `max-width` media queries (mobile-first override pattern). Minimum supported width is `320px`.

### Component Patterns

- **Layout:** Max-width `600px`, centered with `margin: 0 auto`
- **Cards/Items:** `border-radius: 8px`, `border: 1px solid #e0e0e0`, white background
- **Buttons:** `border-radius: 8px`, `0.875rem 1.75rem` padding, `transition` on hover/active
- **Inputs:** `border: 2px solid #e0e0e0`, `border-radius: 8px`, focus ring with `box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1)`
- **Touch targets:** Minimum `44px` on interactive elements for mobile accessibility
- **Transitions:** `0.2s ease` for color/shadow changes, `0.1s ease` for transforms

### Color Scheme Support

The app supports both light and dark modes via `@media (prefers-color-scheme: light)`. The default (no media query) styles are for dark mode.

### Accessibility

- Use `aria-label` on all interactive elements where the visible text is insufficient
- Use ARIA roles (`role="tab"`, `role="tablist"`) for custom widget patterns
- Use `aria-selected` for tab-like components
- Provide `:focus` and `:focus-visible` styles on all interactive elements

## 4. Code Conventions

### File Naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase `.tsx` | `TodoItem.tsx` |
| Component CSS | PascalCase `.css` (matches component) | `TodoItem.css` |
| API modules | camelCase `.ts` | `todos.ts` |
| Test files | `{name}.test.tsx` or `{name}.test.ts` | `TodoItem.test.tsx` |
| Config files | camelCase or dotfile | `vite.config.ts`, `eslint.config.js` |
| Type declaration files | kebab-case `.d.ts` | `vite-env.d.ts` |

### Component Conventions

- Use **function declarations** (not arrow functions) for React components:
  ```tsx
  function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    // ...
  }
  export default TodoItem;
  ```
- Use **default exports** for components
- Define component props as an `interface` named `{ComponentName}Props` directly above or in the same file
- Export types/interfaces that are consumed across modules using named exports

### Variable & Function Naming

- **Variables/functions:** camelCase (`refreshKey`, `handleSubmit`, `loadTodos`)
- **Types/Interfaces:** PascalCase (`Todo`, `FilterType`, `AddTodoProps`)
- **CSS classes:** kebab-case (`todo-item`, `add-todo-button`, `stats-bar-content`)
- **Constants:** camelCase for module-level (`API_BASE_URL` is the one exception — use UPPER_SNAKE_CASE only for true environment-derived constants)
- **Event handlers:** `handle{Action}` pattern (`handleSubmit`, `handleToggle`, `handleDelete`, `handleTabClick`)
- **Callback props:** `on{Action}` pattern (`onAdd`, `onToggle`, `onDelete`, `onFilterChange`, `onTodosChange`)

### File & Folder Structure

```
src/
├── api/                    # API client modules
│   ├── __tests__/          # API tests
│   │   └── todos.test.ts
│   └── todos.ts
├── components/             # React components (flat, no nesting)
│   ├── __tests__/          # Component tests
│   │   ├── AddTodo.test.tsx
│   │   ├── FilterTabs.test.tsx
│   │   ├── ItemCounter.test.tsx
│   │   ├── StatsBar.test.tsx
│   │   ├── TodoItem.test.tsx
│   │   └── TodoList.test.tsx
│   ├── AddTodo.tsx
│   ├── AddTodo.css
│   ├── FilterTabs.tsx
│   ├── FilterTabs.css
│   ├── ItemCounter.tsx
│   ├── ItemCounter.css
│   ├── StatsBar.tsx
│   ├── StatsBar.css
│   ├── TodoItem.tsx
│   ├── TodoItem.css
│   ├── TodoList.tsx
│   └── TodoList.css
├── App.tsx                 # Root component
├── App.css                 # Root component styles
├── index.css               # Global/reset styles
├── main.tsx                # Entry point
├── test-setup.ts           # Test configuration
└── vite-env.d.ts           # Vite type declarations
```

- Tests live in a `__tests__/` directory co-located with the module they test
- Each component has a co-located `.css` file with the same name
- Components are flat inside `components/` — do not nest component directories

### Import Ordering

Follow this order (observed pattern):

1. React imports (`react`, `react-dom`)
2. Third-party library imports
3. Local API/utility modules (`../api/todos`)
4. Local components (`./TodoItem`)
5. CSS imports (`./TodoList.css`)

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Todo, fetchTodos, updateTodo, deleteTodo } from '../api/todos';
import TodoItem from './TodoItem';
import './TodoList.css';
```

### Comment Style

- **CSS files:** Include a Visual Testing Checklist comment block at the top of each CSS file:
  ```css
  /*
   * Visual Testing Checklist:
   * - [ ] Description of visual behavior to verify
   */
  ```
- **API modules:** Use JSDoc comments (`/** */`) for exported functions and classes
- **Inline comments:** Use `//` sparingly for non-obvious logic

## 5. Architecture Patterns

### Component Architecture

- **Stateful container components** (`App`, `TodoList`, `StatsBar`) manage data fetching and state
- **Presentational components** (`TodoItem`, `ItemCounter`) receive data via props and render UI
- **No external state management library** — uses React `useState` and `useCallback` for local state
- State is lifted to the nearest common ancestor; `App` holds top-level state (`todos`, `currentFilter`, `refreshKey`)

### Data Flow

- `App` owns `refreshKey` (a counter) that triggers re-fetches in child components
- When a mutation occurs (add/update/delete), the parent is notified via callback props, which increments `refreshKey`
- `onTodosChange` callback propagates the current todos list up from `TodoList` to `App` for derived state (e.g., `activeCount`)

### API Communication

- All API calls are centralized in `src/api/todos.ts`
- Use the native `fetch` API — no Axios or other HTTP libraries
- API base URL is configured via `import.meta.env.VITE_API_BASE_URL` with fallback to `'/api'`
- All API functions are `async` and return typed promises
- Use a shared `handleResponse<T>()` helper for response parsing and error handling
- API functions construct URLs using `new URL()` with `window.location.origin`

### Custom Error Handling

- `ApiError` class extends `Error` with a `status` field for HTTP status codes
- Components catch errors and display user-friendly messages
- Error state is managed with `useState<string | null>(null)` pattern
- Error messages are extracted with: `err instanceof Error ? err.message : 'Fallback message'`

### URL/Routing

- No client-side router library is used
- Filter state is synced to URL query parameters (`?status=active|completed`) via `window.history.pushState`
- URL params are read on mount with `new URLSearchParams(window.location.search)`

### Styling

- **Plain CSS files** — one per component, imported directly in the component file
- No CSS Modules, no CSS-in-JS, no Tailwind
- Global styles in `src/index.css` (resets, base typography, color scheme)
- App-level layout in `src/App.css`
- BEM-like flat class naming: `.component-name`, `.component-name-element` (e.g., `.todo-item`, `.todo-delete-button`)

## 6. Testing Conventions

### Framework & Setup

- **Test runner:** Vitest with `jsdom` environment
- **Testing library:** `@testing-library/react` + `@testing-library/user-event`
- **Assertions:** Vitest `expect` + `@testing-library/jest-dom` matchers
- **Setup file:** `src/test-setup.ts` imports `@testing-library/jest-dom`
- **Globals:** `true` in vitest config (no need to import `describe`, `it`, `expect` — but the codebase **does** explicitly import them; see Inconsistencies)

### Test File Placement

- Tests live in `__tests__/` directories adjacent to the source:
  - `src/components/__tests__/AddTodo.test.tsx`
  - `src/api/__tests__/todos.test.ts`
- Test filename: `{SourceFileName}.test.{ts,tsx}`

### Test Structure

- Use `describe` blocks named after the component/module
- Use nested `describe` blocks for logical groupings (e.g., `'Rendering'`, `'Active Tab Highlighting'`)
- Each `it` block tests a single behavior with a descriptive name
- Use `beforeEach` for mock clearing: `vi.clearAllMocks()`
- Use `afterEach` for cleanup when mocking globals (e.g., `window.location`)

### Mocking Patterns

- Mock entire modules with `vi.mock()` at the top of test files:
  ```tsx
  vi.mock('../../api/todos', () => ({
    fetchTodos: vi.fn(),
    createTodo: vi.fn(),
  }));
  ```
- Access mocked functions with `vi.mocked()`:
  ```tsx
  const mockFetchTodos = vi.mocked(todosApi.fetchTodos);
  ```
- Mock `fetch` globally for API tests: `global.fetch = vi.fn()`
- Mock `window.location` and `window.history.pushState` when testing URL-dependent behavior

### What to Test

- Component rendering (correct elements present)
- User interactions (clicks, typing, form submission)
- Loading, error, and empty states
- Accessibility attributes (`aria-label`, `aria-selected`, roles)
- CSS class application based on state
- API call arguments and responses
- Edge cases (empty input, whitespace, large numbers)

### User Interaction

Prefer `@testing-library/user-event` over `fireEvent` for realistic user interactions:
```tsx
const user = userEvent.setup();
await user.type(input, 'New todo item');
await user.click(button);
```

## 7. Known Inconsistencies & Resolutions

### 1. Vitest globals vs explicit imports

**Issue:** `vitest.config.ts` sets `globals: true`, meaning `describe`, `it`, `expect`, `vi`, etc. are available globally. However, all test files explicitly import them:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

**Resolution:** **Keep the explicit imports.** They provide better IDE support, make dependencies clear, and are safer. The `globals: true` config can remain for compatibility but should not be relied upon.

### 2. h1 style conflict between `index.css` and `App.css`

**Issue:** `index.css` sets `h1 { font-size: 3.2em; line-height: 1.1; }` while `App.css` sets `h1 { font-size: 2.5rem; font-weight: 700; color: #333; line-height: 1.2; }`. Both are loaded and the `App.css` version wins due to source order.

**Resolution:** **`App.css` values are canonical.** Remove or scope the `h1` styles in `index.css` to avoid confusion. Global styles (`index.css`) should only contain resets and base element defaults, not specific element sizing that conflicts with app-level styles.

### 3. Font stack duplication

**Issue:** The system font stack is repeated in `index.css` (`:root`), `App.css` (`#root`), and multiple component CSS files (`.add-todo-input`, `.add-todo-button`, `.filter-tab`, `.item-counter`).

**Resolution:** **Declare the font stack once** on `:root` or `body` in `index.css` and use `font-family: inherit` in components. Do not re-declare the full stack in component CSS files.

### 4. Inconsistent semicolons in TypeScript

**Issue:** Most files omit trailing semicolons in statements (e.g., `App.tsx`), while API modules and test files consistently use semicolons.

**Resolution:** **Use semicolons.** The majority of the codebase (API, tests, components) uses them. Files like `App.tsx` that omit them are the minority. Add a linting rule to enforce this.

## 8. Anti-Patterns (Do NOT do these)

### ❌ Do not use `refreshKey` counter pattern for data synchronization
The current pattern of incrementing a counter to trigger child re-fetches is fragile. It causes full re-fetches rather than optimistic updates. It exists in the codebase but new features should prefer returning updated data from mutations and updating state directly, as `TodoList.handleToggle` and `handleDelete` already do. Do not extend this pattern to new components.

### ❌ Do not manipulate `window.location` directly for routing
The codebase uses `window.history.pushState` and reads `window.location.search` manually. This works for the current simple case but should not be extended. If routing needs grow, adopt a proper router library (e.g., React Router). Do not add more `pushState` calls.

### ❌ Do not duplicate filter/URL-sync logic across components
Both `App.tsx` and `FilterTabs.tsx` read `window.location.search` on mount to determine the filter. This logic should exist in one place only. The canonical location is the component that owns the state (`App`).

### ❌ Do not use `delete (window as unknown as Record<string, unknown>).location` outside tests
This pattern appears in tests for mocking purposes. Never use this type-casting escape hatch in production code.

### ❌ Do not add CSS-in-JS, CSS Modules, or utility-class frameworks
The project uses plain CSS with co-located files. Maintain this approach for consistency.

### ❌ Do not use `any` type
The codebase avoids `any` throughout. Use proper TypeScript types, `unknown` with type guards, or generic type parameters.

### ❌ Do not use class components
All components are functional. Do not introduce React class components.

### ❌ Do not store derived state
`activeCount` in `App.tsx` is correctly computed inline from `todos` state. Do not create separate state variables for values that can be derived from existing state.