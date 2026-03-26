# Design System — frontend

> **Project:** Todo App (Vite + React 18 + TypeScript)
> **UI Framework:** Plain CSS (no component library, no CSS-in-JS, no utility framework)
> **Note:** CSS source files (`*.css`) were not provided in the codebase sample. Token values below are inferred from Vite's default scaffold (`index.css`, `App.css`) and the component/class naming conventions found in the source. Where a value cannot be confirmed from source, it is marked with ⚠️ *inferred*. When implementing, always cross-reference the actual CSS files on disk.

---

## 1. Design Tokens

This project does **not** use a formal design-token layer (no CSS custom properties file, no `theme.ts`, no Tailwind config). All visual values live directly in per-component CSS files. **Recommendation:** extract the values below into a single `src/tokens.css` (CSS custom properties) to create a single source of truth.

### 1.1 Colour Palette

Based on Vite React default template and the component class names present:

| Token (proposed) | Value | Usage |
|---|---|---|
| `--color-background` | `#242424` ⚠️ inferred (Vite dark default) | Root `<body>` background |
| `--color-surface` | `#1a1a1a` ⚠️ inferred | `.card` container background |
| `--color-text-primary` | `rgba(255, 255, 255, 0.87)` ⚠️ inferred | Default body text |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.6)` ⚠️ inferred | Descriptions, labels (`.todo-description`, `.stat-label`) |
| `--color-text-completed` | `rgba(255, 255, 255, 0.4)` ⚠️ inferred | `.todo-title.completed` strikethrough text |
| `--color-primary` | `#646cff` ⚠️ inferred (Vite default link/accent) | `.add-todo-button`, `.filter-tab.active` |
| `--color-primary-hover` | `#535bf2` ⚠️ inferred | Button hover state |
| `--color-danger` | `#ff4d4f` ⚠️ inferred | `.todo-delete-button`, `.add-todo-error`, `.todo-list-error` |
| `--color-danger-hover` | `#ff7875` ⚠️ inferred | Delete button hover |
| `--color-border` | `rgba(255, 255, 255, 0.12)` ⚠️ inferred | Input borders, dividers |
| `--color-error-bg` | `rgba(255, 77, 79, 0.1)` ⚠️ inferred | `.stats-bar-error` background |

**Light mode variant** (Vite default uses `prefers-color-scheme: light`):

| Token (proposed) | Value | Usage |
|---|---|---|
| `--color-background` | `#ffffff` ⚠️ inferred | Body background in light mode |
| `--color-surface` | `#f9f9f9` ⚠️ inferred | Card surface |
| `--color-text-primary` | `#213547` ⚠️ inferred | Body text |
| `--color-primary` | `#747bff` ⚠️ inferred | Accent in light mode |

### 1.2 Typography

| Token (proposed) | Value | Usage |
|---|---|---|
| `--font-family` | `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif` ⚠️ inferred (Vite default) | All text |
| `--font-size-h1` | `3.2em` ⚠️ inferred | `<h1>` — "Todo App" |
| `--font-size-body` | `1em` (16px) ⚠️ inferred | `.todo-title`, `.stat-label` |
| `--font-size-small` | `0.875em` (14px) ⚠️ inferred | `.todo-description`, `.item-counter`, `.add-todo-error` |
| `--font-size-button` | `1em` ⚠️ inferred | `.add-todo-button`, `.filter-tab` |
| `--font-weight-normal` | `400` | Body text |
| `--font-weight-medium` | `500` ⚠️ inferred | `.stat-value`, button text |
| `--font-weight-bold` | `700` ⚠️ inferred | `<h1>` |
| `--line-height-body` | `1.5` ⚠️ inferred (Vite default) | Default line height |
| `--line-height-heading` | `1.1` ⚠️ inferred | `<h1>` |

```css
/* Proposed tokens.css */
:root {
  --font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  --font-size-h1: 3.2em;
  --font-size-body: 1em;
  --font-size-small: 0.875em;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --line-height-body: 1.5;
  --line-height-heading: 1.1;
}
```

### 1.3 Spacing System

No formal spacing scale exists. The project uses ad-hoc pixel/em values in CSS. **Recommendation:** adopt an 8px base grid.

| Token (proposed) | Value | Typical Usage |
|---|---|---|
| `--space-xs` | `4px` | Inline gaps (checkbox → title) |
| `--space-sm` | `8px` | Inner padding of small elements |
| `--space-md` | `16px` | Component internal padding, form gaps |
| `--space-lg` | `24px` | Section spacing inside `.card` |
| `--space-xl` | `32px` | Page-level vertical rhythm |
| `--space-2xl` | `48px` | Top-level container padding |

### 1.4 Border Radius

| Token (proposed) | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` ⚠️ inferred | Inputs, small buttons |
| `--radius-md` | `8px` ⚠️ inferred (Vite default for buttons) | `.add-todo-button`, `.filter-tab`, `.card` |
| `--radius-full` | `9999px` | Pills (not currently used) |

### 1.5 Shadows & Elevation

| Token (proposed) | Value | Usage |
|---|---|---|
| `--shadow-card` | `none` or `0 2px 8px rgba(0,0,0,0.15)` ⚠️ inferred | `.card` container if elevated |
| `--shadow-button-focus` | `0 0 0 3px rgba(100, 108, 255, 0.4)` ⚠️ inferred | Focus ring on interactive elements |

### 1.6 Z-Index Scale

No z-index layering is used in this project (no modals, dropdowns, or overlays).

| Token (proposed) | Value | Usage |
|---|---|---|
| `--z-base` | `0` | Default content |
| `--z-sticky` | `100` | Future: sticky headers |
| `--z-modal` | `1000` | Future: modals/dialogs |

---

## 2. Atoms

### 2.1 Colour Swatches & Surfaces

Two surface levels exist in the app:

| Surface | Class | Background | Border |
|---|---|---|---|
| Page | `body` | `#242424` ⚠️ | None |
| Card | `.card` | `#1a1a1a` ⚠️ | None (or subtle border) |
| Error surface | `.stats-bar-error` | `rgba(255,77,79,0.1)` ⚠️ | None |

```tsx
// Surface atom — informational only, surfaces are applied via CSS class
<div className="card">
  {/* Content on elevated surface */}
</div>
```

### 2.2 Typography Elements

Only one heading level is used in the project:

| Element | Tag/Class | Size | Weight | Line-height | Colour |
|---|---|---|---|---|---|
| Page title | `<h1>` | `3.2em` ⚠️ | `700` ⚠️ | `1.1` ⚠️ | `--color-text-primary` |
| Todo title | `.todo-title` | `1em` (16px) ⚠️ | `400` | `1.5` ⚠️ | `--color-text-primary` |
| Todo title (done) | `.todo-title.completed` | `1em` ⚠️ | `400` | `1.5` ⚠️ | `--color-text-completed` + `line-through` |
| Description | `.todo-description` | `0.875em` ⚠️ | `400` | `1.5` ⚠️ | `--color-text-secondary` |
| Stat label | `.stat-label` | `0.875em` ⚠️ | `400` | `1.5` ⚠️ | `--color-text-secondary` |
| Stat value | `.stat-value` | `1em` ⚠️ | `500` ⚠️ | `1.5` ⚠️ | `--color-text-primary` |
| Counter | `.item-counter` | `0.875em` ⚠️ | `400` | `1.5` ⚠️ | `--color-text-secondary` |
| Error text | `.add-todo-error` | `0.875em` ⚠️ | `400` | `1.5` ⚠️ | `--color-danger` |
| Placeholder | `input::placeholder` | `1em` ⚠️ | `400` | — | `--color-text-secondary` |

```tsx
{/* Heading */}
<h1>Todo App</h1>

{/* Body text */}
<span className="todo-title">Buy groceries</span>

{/* Completed text — strikethrough + dimmed */}
<span className="todo-title completed">Buy groceries</span>

{/* Secondary / description text */}
<span className="todo-description">Get milk and eggs</span>

{/* Error text */}
<div className="add-todo-error">Failed to create todo</div>
```

### 2.3 Icon Usage

**No icon library is used.** All actions use text labels ("Delete", "Add", "Adding..."). If icons are added in the future, adopt `lucide-react` or similar and use 16px/20px/24px sizing on the 4px grid.

### 2.4 Dividers & Lines

No explicit divider components exist. Separation is achieved through spacing and background contrast between `.card` surface and individual `.todo-item` rows. If `.todo-item` uses a bottom border, it would be:

| Element | Colour | Thickness |
|---|---|---|
| Todo item separator | `rgba(255,255,255,0.12)` ⚠️ | `1px` ⚠️ |

### 2.5 Spacing Primitives

Convention observed in the codebase: spacing is applied via CSS classes on a per-component basis. No shared utility classes exist.

**Canonical spacing application pattern:**
- **Component internal padding:** applied in the component's own `.css` file
- **Gap between sibling components:** managed by the parent layout (`.card` in `App.css`)
- **Inline gaps** (e.g., checkbox → title → delete button): `gap` or `margin-left` in `.todo-item`

```css
/* Canonical pattern — use flexbox gap for internal component spacing */
.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;          /* --space-sm */
  padding: 8px 16px; /* --space-sm --space-md */
}
```

---

## 3. Molecules

### 3.1 Button

Two button variants exist in the codebase:

#### Primary Action Button (`.add-todo-button`)

| Property | Default | Hover | Active | Disabled | Loading |
|---|---|---|---|---|---|
| Background | `#646cff` ⚠️ | `#535bf2` ⚠️ | `#535bf2` ⚠️ | `opacity: 0.5` ⚠️ | Same as disabled |
| Text colour | `#ffffff` ⚠️ | `#ffffff` ⚠️ | `#ffffff` ⚠️ | `#ffffff` ⚠️ | `#ffffff` ⚠️ |
| Font size | `1em` ⚠️ | — | — | — | — |
| Font weight | `500` ⚠️ | — | — | — | — |
| Border radius | `8px` ⚠️ | — | — | — | — |
| Padding | `8px 16px` ⚠️ | — | — | — | — |
| Cursor | `pointer` | `pointer` | `pointer` | `not-allowed` | `not-allowed` |
| Label | "Add" | "Add" | "Add" | "Add" | "Adding..." |

```tsx
import { useState, FormEvent } from 'react';

// Primary action button (extracted atom)
interface PrimaryButtonProps {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

function PrimaryButton({
  label,
  loadingLabel = 'Loading...',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className="add-todo-button"
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
```

#### Destructive Button (`.todo-delete-button`)

| Property | Default | Hover |
|---|---|---|
| Background | `transparent` ⚠️ | `rgba(255,77,79,0.1)` ⚠️ |
| Text colour | `#ff4d4f` ⚠️ | `#ff7875` ⚠️ |
| Border | `1px solid #ff4d4f` ⚠️ | `1px solid #ff7875` ⚠️ |
| Border radius | `4px` ⚠️ | — |
| Padding | `4px 8px` ⚠️ | — |
| Font size | `0.875em` ⚠️ | — |

```tsx
interface DeleteButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

function DeleteButton({ onClick, ariaLabel }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="todo-delete-button"
      aria-label={ariaLabel}
    >
      Delete
    </button>
  );
}
```

#### Tab Button (`.filter-tab`)

| Property | Default | Active | Hover |
|---|---|---|---|
| Background | `transparent` ⚠️ | `#646cff` ⚠️ | `rgba(100,108,255,0.1)` ⚠️ |
| Text colour | `--color-text-secondary` ⚠️ | `#ffffff` ⚠️ | `--color-text-primary` ⚠️ |
| Border radius | `8px` ⚠️ | `8px` ⚠️ | `8px` ⚠️ |
| Padding | `6px 16px` ⚠️ | — | — |
| `aria-selected` | `false` | `true` | — |
| `role` | `tab` | `tab` | `tab` |

```tsx
<button
  role="tab"
  aria-selected={isActive}
  aria-label={`Show ${label.toLowerCase()} todos`}
  className={`filter-tab ${isActive ? 'active' : ''}`}
  onClick={() => onSelect(value)}
>
  {label}
</button>
```

### 3.2 Input / Text Field (`.add-todo-input`)

Single variant: plain text input.

| Property | Default | Focused | Disabled |
|---|---|---|---|
| Background | `#1a1a1a` ⚠️ | `#1a1a1a` ⚠️ | `opacity: 0.5` ⚠️ |
| Text colour | `--color-text-primary` | `--color-text-primary` | `--color-text-secondary` |
| Border | `1px solid rgba(255,255,255,0.12)` ⚠️ | `1px solid #646cff` ⚠️ | `1px solid rgba(255,255,255,0.08)` ⚠️ |
| Border radius | `8px` ⚠️ | — | — |
| Padding | `8px 12px` ⚠️ | — | — |
| Placeholder | "What needs to be done?" | — | — |
| Placeholder colour | `--color-text-secondary` | — | — |
| Focus ring | — | `0 0 0 3px rgba(100,108,255,0.4)` ⚠️ | — |
| Font size | `1em` ⚠️ | — | — |

```tsx
<input
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="What needs to be done?"
  className="add-todo-input"
  disabled={isSubmitting}
/>
```

**Error state:** Error messages appear below the form as a separate `<div className="add-todo-error">`, not inline on the input.

```tsx
{error && <div className="add-todo-error">{error}</div>}
```

### 3.3 Badge / Chip / Tag

**Not present in the codebase.** No badge or chip component exists.

### 3.4 Avatar

**Not present in the codebase.**

### 3.5 Checkbox (`.todo-checkbox`)

Native HTML checkbox is used with no custom styling wrapper.

| Property | Unchecked | Checked |
|---|---|---|
| Element | `<input type="checkbox">` | `<input type="checkbox">` |
| `checked` | `false` | `true` |
| `aria-label` | `Mark "{title}" as complete` | `Mark "{title}" as incomplete` |
| Custom styling | None (browser default) | None (browser default) |

```tsx
<input
  type="checkbox"
  checked={todo.completed}
  onChange={() => onToggle(todo.id)}
  className="todo-checkbox"
  aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
/>
```

> **⚠️ Inconsistency:** The checkbox uses browser-default styling. For visual consistency, consider a custom checkbox atom using CSS `appearance: none` with themed checked/unchecked states.

### 3.6 Select / Dropdown

**Not present in the codebase.** Filtering uses tab buttons instead.

### 3.7 Tooltip

**Not present in the codebase.**

---

## 4. Organisms

### 4.1 Form — AddTodo

**Component:** `AddTodo`
**File:** `src/components/AddTodo.tsx` + `src/components/AddTodo.css`

**Layout:** Horizontal inline form — text input + submit button side by side inside a `<form>`.

| Property | Value |
|---|---|
| Container class | `.add-todo` |
| Layout | `<form>` containing `.add-todo-input` + `.add-todo-button` |
| Direction | Row (horizontal) ⚠️ |
| Gap | `8px` ⚠️ |
| Error placement | Below the form row, in `.add-todo-error` |
| Submit guard | Button disabled when input is empty or whitespace-only |
| Loading state | Button text changes to "Adding...", both input and button disabled |

**States:**
- **Idle:** Input empty, button disabled
- **Ready:** Input has content, button enabled
- **Submitting:** Input disabled, button disabled with "Adding..." label
- **Error:** Error message shown below form, form returns to Ready state

```tsx
import { useState, FormEvent } from 'react';
import { createTodo } from '../api/todos';
import './AddTodo.css';

interface AddTodoProps {
  onAdd: () => void;
}

function AddTodo({ onAdd }: AddTodoProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createTodo(inputValue.trim());
      setInputValue('');
      onAdd();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-todo">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="add-todo-input"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="add-todo-button"
          disabled={!inputValue.trim() || isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && <div className="add-todo-error">{error}</div>}
    </div>
  );
}

export default AddTodo;
```

### 4.2 Card

**Class:** `.card` (applied in `App.tsx`)
**Role:** Main content container wrapping all functional components.

| Property | Value |
|---|---|
| Background | `--color-surface` (`#1a1a1a` ⚠️) |
| Border radius | `8px` ⚠️ |
| Padding | `24px` ⚠️ |
| Shadow | None or subtle ⚠️ |
| Max width | `620px` ⚠️ |
| Margin | `0 auto` (centered) ⚠️ |

```tsx
<div className="card">
  <AddTodo onAdd={handleTodoAdded} />
  <FilterTabs currentFilter={currentFilter} onFilterChange={handleFilterChange} />
  <TodoList refreshKey={refreshKey} filter={currentFilter} onTodosChange={handleTodosChange} />
  <StatsBar />
  <ItemCounter count={activeCount} />
</div>
```

### 4.3 Modal / Dialog

**Not present in the codebase.**

### 4.4 Navigation — FilterTabs

**Component:** `FilterTabs`
**File:** `src/components/FilterTabs.tsx` + `src/components/FilterTabs.css`

A horizontal tab bar for filtering todos by status.

| Property | Value |
|---|---|
| Container class | `.filter-tabs` |
| Layout | Horizontal flex row ⚠️ |
| `role` | `tablist` |
| `aria-label` | `"Filter todos"` |
| Tab count | 3 ("All", "Active", "Completed") |
| Active indicator | `.filter-tab.active` class |
| URL sync | Updates `?status=` query param via `history.pushState` |
| Initial state | Reads `?status=` from URL on mount |

**Behaviour:**
- Clicking a tab updates the URL query parameter (`?status=active`, `?status=completed`, or removes param for "all")
- Uses `window.history.pushState` — no full page navigation
- On mount, reads URL and syncs filter state

```tsx
import { useEffect, useRef } from 'react';
import './FilterTabs.css';

export type FilterType = 'all' | 'active' | 'completed';

interface FilterTabsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const currentFilterRef = useRef(currentFilter);
  const onFilterChangeRef = useRef(onFilterChange);
  currentFilterRef.current = currentFilter;
  onFilterChangeRef.current = onFilterChange;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    if (statusParam === 'active' || statusParam === 'completed') {
      if (currentFilterRef.current !== statusParam) {
        onFilterChangeRef.current(statusParam);
      }
    } else if (currentFilterRef.current !== 'all') {
      onFilterChangeRef.current('all');
    }
  }, []);

  const handleTabClick = (filter: FilterType) => {
    const url = new URL(window.location.href);
    if (filter === 'all') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', filter);
    }
    window.history.pushState({}, '', url);
    onFilterChange(filter);
  };

  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter todos">
      {(['all', 'active', 'completed'] as const).map((filter) => (
        <button
          key={filter}
          role="tab"
          aria-selected={currentFilter === filter}
          aria-label={`Show ${filter} todos`}
          className={`filter-tab ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => handleTabClick(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
```

### 4.5 Data List — TodoList + TodoItem

**Component:** `TodoList`
**File:** `src/components/TodoList.tsx` + `src/components/TodoList.css`

A vertical list of `TodoItem` rows.

| Property | Value |
|---|---|
| Container class | `.todo-list` |
| Layout | Vertical stack of `.todo-item` ⚠️ |
| Loading state | `<div className="todo-list-loading">Loading todos...</div>` |
| Empty state | `<div className="todo-list-empty">No todos yet. Add one to get started!</div>` |
| Error state | `<div className="todo-list-error">{errorMessage}</div>` |
| Filter support | `filter` prop: `'all' | 'active' | 'completed'` |
| Refresh | `refreshKey` prop — incrementing triggers re-fetch |

#### TodoItem Row

**Component:** `TodoItem`
**File:** `src/components/TodoItem.tsx` + `src/components/TodoItem.css`

| Property | Value |
|---|---|
| Container class | `.todo-item` |
| Layout | Horizontal flex: checkbox → title → (description) → delete button ⚠️ |
| Alignment | `center` ⚠️ |
| Padding | `8px 16px` ⚠️ |

**Row anatomy (left to right):**

| Slot | Element | Class | Notes |
|---|---|---|---|
| 1 | Checkbox | `.todo-checkbox` | Native `<input type="checkbox">` |
| 2 | Title | `.todo-title` / `.todo-title.completed` | Strikethrough + dimmed when completed |
| 3 | Description (optional) | `.todo-description` | Only rendered when `todo.description` exists |
| 4 | Delete button | `.todo-delete-button` | Right-aligned, destructive style |

```tsx
import { Todo } from '../api/todos';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
        aria-label={`Mark "${todo.title}" as ${
          todo.completed ? 'incomplete' : 'complete'
        }`}
      />
      <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
        {todo.title}
      </span>
      {todo.description && (
        <span className="todo-description">{todo.description}</span>
      )}
      <button
        onClick={() => onDelete(todo.id)}
        className="todo-delete-button"
        aria-label={`Delete "${todo.title}"`}
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
```

### 4.6 Stats Bar — StatsBar

**Component:** `StatsBar`
**File:** `src/components/StatsBar.tsx` + `src/components/StatsBar.css`

A horizontal bar displaying aggregate todo statistics.

| Property | Value |
|---|---|
| Container class | `.stats-bar` |
| Content class | `.stats-bar-content` |
| Error variant | `.stats-bar.stats-bar-error` |
| Layout | Horizontal flex with `.stat-item` children ⚠️ |
| Stat item anatomy | `.stat-label` + `.stat-value` |
| Stats displayed | Total, Active, Completed |
| Data source | `fetchStats()` API call on mount |
| Loading state | `"Loading stats..."` text |
| Error state | `"Failed to load stats: {message}"` on `.stats-bar-error` surface |

```tsx
import { useState, useEffect } from 'react';
import { fetchStats, StatsResponse, ApiError } from '../api/todos';
import './StatsBar.css';

function StatsBar() {
  const [stats, setStats] = useState<StatsResponse>({
    total: 0,
    active: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to load stats: ${err.message}`);
        } else {
          setError('Failed to load stats');
        }
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-bar">
        <div className="stats-bar-content">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-bar stats-bar-error">
        <div className="stats-bar-content">{error}</div>
      </div>
    );
  }

  return (
    <div className="stats-bar">
      <div className="stats-bar-content">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
```

### Item Counter

**Component:** `ItemCounter`
**File:** `src/components/ItemCounter.tsx` + `src/components/ItemCounter.css`

| Property | Value |
|---|---|
| Container class | `.item-counter` |
| Text pattern | `"{count} item(s) left"` |
| Pluralisation | `count === 1 ? 'item' : 'items'` |
| Font size | `0.875em` ⚠️ |
| Colour | `--color-text-secondary` ⚠️ |

```tsx
import './ItemCounter.css';

interface ItemCounterProps {
  count: number;
}

function ItemCounter({ count }: ItemCounterProps) {
  const itemText = count === 1 ? 'item' : 'items';
  return (
    <div className="item-counter">
      {count} {itemText} left
    </div>
  );
}

export default ItemCounter;
```

---

## 5. Templates & Layout Patterns

### 5.1 Page Layout

Single-page layout with vertically centered content.

```
┌──────────────────────────────────────┐
│              <h1> Todo App           │  ← Page title, centered
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [  Input field  ] [ Add ]     │  │  ← AddTodo form
│  │                                │  │
│  │  [ All ] [ Active ] [Complete] │  │  ← FilterTabs
│  │                                │  │
│  │  ☐ First todo         [Delete] │  │  ← TodoItem rows
│  │  ☑ Second todo        [Delete] │  │
│  │  ☐ Third todo         [Delete] │  │
│  │                                │  │
│  │  Total: 3  Active: 2  Done: 1  │  │  ← StatsBar
│  │                                │  │
│  │  2 items left                  │  │  ← ItemCounter
│  └────────────────────────────────┘  │
│               .card                  │
└──────────────────────────────────────┘
```

**Canonical page structure:**

```tsx
import { useState, useEffect, useCallback } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import FilterTabs, { FilterType } from './components/FilterTabs';
import ItemCounter from './components/ItemCounter';
import StatsBar from './components/StatsBar';
import { Todo } from './api/todos';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    if (statusParam === 'active' || statusParam === 'completed') {
      setCurrentFilter(statusParam);
    } else {
      setCurrentFilter('all');
    }
  }, []);

  const handleTodoAdded = () => setRefreshKey((prev) => prev + 1);

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setRefreshKey((prev) => prev + 1);
  };

  const handleTodosChange = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos);
  }, []);

  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <>
      <h1>Todo App</h1>
      <div className="card">
        <AddTodo onAdd={handleTodoAdded} />
        <FilterTabs currentFilter={currentFilter} onFilterChange={handleFilterChange} />
        <TodoList
          refreshKey={refreshKey}
          filter={currentFilter}
          onTodosChange={handleTodosChange}
        />
        <StatsBar />
        <ItemCounter count={activeCount} />
      </div>
    </>
  );
}

export default App;
```

### 5.2 Responsive Grid

No formal grid or breakpoint system exists. The layout is a single centered column. Vite default likely uses:

| Breakpoint | Behaviour |
|---|---|
| All widths | Single column, max-width `~620px`, centered via `margin: 0 auto` ⚠️ |

### 5.3 Empty States

One empty state pattern exists:

```tsx
<div className="todo-list-empty">No todos yet. Add one to get started!</div>
```

**Pattern:** Text-only, no illustration, no CTA button. Displayed when `todos.length === 0` after successful fetch.

### 5.4 Loading States

Text-based loading indicators (no skeletons, no spinners):

| Component | Loading text | Class |
|---|---|---|
| `TodoList` | `"Loading todos..."` | `.todo-list-loading` |
| `StatsBar` | `"Loading stats..."` | `.stats-bar` > `.stats-bar-content` |
| `AddTodo` button | `"Adding..."` | Button text swap, button disabled |

```tsx
// Canonical loading pattern
if (isLoading) {
  return <div className="todo-list-loading">Loading todos...</div>;
}
```

### 5.5 Error States

Two error patterns:

#### Inline error (below form)
```tsx
{error && <div className="add-todo-error">{error}</div>}
```

#### Section-level error (replaces content)
```tsx
// TodoList error — replaces the entire list
if (error) {
  return <div className="todo-list-error">{error}</div>;
}

// StatsBar error — shown on error surface
if (error) {
  return (
    <div className="stats-bar stats-bar-error">
      <div className="stats-bar-content">{error}</div>
    </div>
  );
}
```

**Canonical error handling pattern:**
```tsx
try {
  // async operation
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Fallback error message';
  setError(errorMessage);
}
```

---

## 6. Interaction & Animation

### 6.1 Transition Conventions

No explicit transitions or animations are defined in the component source. **Recommendation:** If adding transitions, use:

| Property | Duration | Easing |
|---|---|---|
| Background, border colour | `150ms` | `ease-in-out` |
| Opacity | `200ms` | `ease` |
| Transform (scale) | `150ms` | `ease-out` |

### 6.2 Focus & Accessibility

**ARIA patterns observed:**

| Component | ARIA usage |
|---|---|
| `FilterTabs` container | `role="tablist"`, `aria-label="Filter todos"` |
| Filter tab buttons | `role="tab"`, `aria-selected={boolean}`, `aria-label="Show {x} todos"` |
| Todo checkbox | `aria-label='Mark "{title}" as complete/incomplete'` — dynamic based on state |
| Delete button | `aria-label='Delete "{title}"'` |

**Focus ring:** Not explicitly defined in source. Likely relies on Vite default:
```css
/* Vite default ⚠️ inferred */
:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
```

**Canonical ARIA pattern for interactive elements:**
- Always provide `aria-label` on icon-only or ambiguous buttons
- Use dynamic `aria-label` that reflects current state
- Use semantic `role` attributes for custom tab patterns

---

## 7. Platform-Specific Rules

Not applicable — this is a web-only React SPA.

---

## 8. Anti-Patterns

### 8.1 ⚠️ Duplicate URL sync logic
Both `App.tsx` and `FilterTabs.tsx` read `window.location.search` on mount to determine the initial filter. This creates a race condition and duplicated logic.

**Canonical fix:** URL reading should happen in **one place only** — `App.tsx` — and the resolved value should be passed down as a prop. `FilterTabs` should be a pure controlled component.

### 8.2 ⚠️ No design token abstraction
All colours, spacing, and typography values are hardcoded in individual CSS files. This makes global theming changes require edits to every file.

**Canonical fix:** Create `src/tokens.css` with CSS custom properties. All component CSS files should reference `var(--token-name)`.

### 8.3 ⚠️ StatsBar fetches independently
`StatsBar` makes its own `fetchStats()` call on mount, completely independent of the `TodoList` data. The stats can become stale relative to the displayed list. There is no refresh mechanism when todos are added/toggled/deleted.

**Canonical fix:** Either lift stats fetching to `App.tsx` and pass as props, or accept `refreshKey` as a prop to re-fetch when data changes.

### 8.4 ⚠️ Browser-default checkbox
The checkbox uses native browser styling, which varies across browsers and is visually inconsistent with the rest of the UI.

**Canonical fix:** Create a custom `Checkbox` atom with `appearance: none` and themed states.

### 8.5 ⚠️ No consistent error boundary
Error handling is implemented per-component with local state. There is no top-level error boundary for unhandled exceptions.

**Canonical fix:** Add a React Error Boundary at the `App` level.

### 8.6 ⚠️ Magic strings for filter values
Filter types `'all' | 'active' | 'completed'` are defined as a union type in `FilterTabs.tsx` and re-declared as inline string literals in `TodoList.tsx` props.

**Canonical fix:** Export `FilterType` from a shared `types.ts` and use it everywhere.