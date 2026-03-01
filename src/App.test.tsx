import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as todosApi from './api/todos';

// Mock the API module
vi.mock('./api/todos', () => ({
  fetchTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

describe('App Component', () => {
  let originalLocation: Location;
  let originalHistory: History;

  const mockTodos = [
    {
      id: 1,
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Todo 2',
      description: 'Description 2',
      completed: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      title: 'Test Todo 3',
      description: 'Description 3',
      completed: false,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    originalLocation = window.location;
    originalHistory = window.history;

    // Mock window.location
    delete (window as unknown as Record<string, unknown>).location;
    window.location = {
      ...originalLocation,
      href: 'http://localhost:3000/',
      search: '',
      origin: 'http://localhost:3000',
    } as Location;

    // Mock window.history.pushState
    window.history.pushState = vi.fn();

    // Default mock implementation
    vi.mocked(todosApi.fetchTodos).mockResolvedValue(mockTodos);
  });

  afterEach(() => {
    window.location = originalLocation;
    window.history = originalHistory;
  });

  describe('Component Rendering', () => {
    it('renders all main components', async () => {
      render(<App />);

      // Check for main heading
      expect(screen.getByText('Todo App')).toBeInTheDocument();

      // Wait for todos to load
      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Check for AddTodo component (look for the form or input)
      expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();

      // Check for FilterTabs component
      expect(screen.getByRole('tab', { name: /show all todos/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /show active todos/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /show completed todos/i })).toBeInTheDocument();

      // Check for TodoList component (todos should be rendered)
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 3')).toBeInTheDocument();

      // Check for ItemCounter component (2 active items out of 3 total)
      expect(screen.getByText(/2 items left/i)).toBeInTheDocument();
    });

    it('renders AddTodo at the top', () => {
      render(<App />);

      const card = screen.getByText('Todo App').nextElementSibling;
      const firstChild = card?.firstElementChild;

      // AddTodo should contain a form with the input
      expect(firstChild?.querySelector('input[placeholder*="What needs to be done"]')).toBeInTheDocument();
    });

    it('renders ItemCounter at the bottom', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      const card = screen.getByText('Todo App').nextElementSibling;
      const lastChild = card?.lastElementChild;

      // ItemCounter should show the count
      expect(lastChild?.textContent).toMatch(/items left/i);
    });
  });

  describe('Filter State Management', () => {
    it('initializes with "all" filter when no URL parameter', async () => {
      window.location.search = '';
      render(<App />);

      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith(undefined);
      });

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      expect(allTab).toHaveClass('active');
    });

    it('initializes with "active" filter from URL parameter', async () => {
      window.location.search = '?status=active';
      const activeTodos = mockTodos.filter(t => !t.completed);
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(activeTodos);

      render(<App />);

      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('active');
      });

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      expect(activeTab).toHaveClass('active');
    });

    it('initializes with "completed" filter from URL parameter', async () => {
      window.location.search = '?status=completed';
      const completedTodos = mockTodos.filter(t => t.completed);
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(completedTodos);

      render(<App />);

      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('completed');
      });

      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      expect(completedTab).toHaveClass('active');
    });
  });

  describe('Filter Tab Interaction', () => {
    it('clicking Active tab updates URL and fetches active todos', async () => {
      const user = userEvent.setup();
      const activeTodos = mockTodos.filter(t => !t.completed);

      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Clear previous calls
      vi.mocked(todosApi.fetchTodos).mockClear();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(activeTodos);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      await user.click(activeTab);

      // Check URL was updated
      expect(window.history.pushState).toHaveBeenCalled();
      const pushStateCall = vi.mocked(window.history.pushState).mock.calls[0];
      const newUrl = pushStateCall[2];
      expect(newUrl.toString()).toContain('status=active');

      // Check todos were re-fetched with filter
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('active');
      });
    });

    it('clicking Completed tab updates URL and fetches completed todos', async () => {
      const user = userEvent.setup();
      const completedTodos = mockTodos.filter(t => t.completed);

      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Clear previous calls
      vi.mocked(todosApi.fetchTodos).mockClear();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(completedTodos);

      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      await user.click(completedTab);

      // Check URL was updated
      expect(window.history.pushState).toHaveBeenCalled();
      const pushStateCall = vi.mocked(window.history.pushState).mock.calls[0];
      const newUrl = pushStateCall[2];
      expect(newUrl.toString()).toContain('status=completed');

      // Check todos were re-fetched with filter
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('completed');
      });
    });

    it('clicking All tab removes status from URL and fetches all todos', async () => {
      const user = userEvent.setup();
      window.location.search = '?status=active';

      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Clear previous calls
      vi.mocked(todosApi.fetchTodos).mockClear();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(mockTodos);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      await user.click(allTab);

      // Check URL was updated (status param removed)
      expect(window.history.pushState).toHaveBeenCalled();
      const pushStateCall = vi.mocked(window.history.pushState).mock.calls[0];
      const newUrl = pushStateCall[2];
      expect(newUrl.toString()).not.toContain('status=');

      // Check todos were re-fetched without filter
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith(undefined);
      });
    });

    it('switching between filters multiple times works correctly', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      const allTab = screen.getByRole('tab', { name: /show all todos/i });

      // Clear initial fetch
      vi.mocked(todosApi.fetchTodos).mockClear();

      // Click Active
      await user.click(activeTab);
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('active');
      });

      // Click Completed
      vi.mocked(todosApi.fetchTodos).mockClear();
      await user.click(completedTab);
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('completed');
      });

      // Click All
      vi.mocked(todosApi.fetchTodos).mockClear();
      await user.click(allTab);
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe('Item Counter', () => {
    it('displays correct count of active (incomplete) items', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // 2 active todos out of 3 total (IDs 1 and 3 are incomplete)
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });

    it('updates count when todos change', async () => {
      const user = userEvent.setup();
      vi.mocked(todosApi.updateTodo).mockImplementation(async (id, updates) => {
        const todo = mockTodos.find(t => t.id === id);
        return { ...todo!, ...updates };
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Initial count: 2 items left
      expect(screen.getByText('2 items left')).toBeInTheDocument();

      // Find and click checkbox for an active todo to mark it complete
      const checkboxes = await screen.findAllByRole('checkbox');
      const firstActiveCheckbox = checkboxes.find(cb => !(cb as HTMLInputElement).checked);

      if (firstActiveCheckbox) {
        await user.click(firstActiveCheckbox);

        // Count should update to 1 item left
        await waitFor(() => {
          expect(screen.getByText('1 item left')).toBeInTheDocument();
        });
      }
    });

    it('shows singular "item" when count is 1', async () => {
      const oneTodoActive = [
        { ...mockTodos[0], completed: false },
        { ...mockTodos[1], completed: true },
        { ...mockTodos[2], completed: true },
      ];
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(oneTodoActive);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('1 item left')).toBeInTheDocument();
      });
    });

    it('shows plural "items" when count is not 1', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('2 items left')).toBeInTheDocument();
      });
    });

    it('shows 0 items when all todos are completed', async () => {
      const allCompleted = mockTodos.map(t => ({ ...t, completed: true }));
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(allCompleted);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('0 items left')).toBeInTheDocument();
      });
    });
  });

  describe('Todo Addition', () => {
    it('refreshes todo list when new todo is added', async () => {
      const user = userEvent.setup();
      const newTodo = {
        id: 4,
        title: 'New Todo',
        description: 'New Description',
        completed: false,
        created_at: '2024-01-04T00:00:00Z',
        updated_at: '2024-01-04T00:00:00Z',
      };

      vi.mocked(todosApi.createTodo).mockResolvedValue(newTodo);

      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Clear initial fetch calls
      vi.mocked(todosApi.fetchTodos).mockClear();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue([...mockTodos, newTodo]);

      // Add a new todo
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      await user.type(titleInput, 'New Todo');

      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      // Verify todos were re-fetched
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalled();
      });
    });
  });

  describe('Integration', () => {
    it('maintains filter state when adding a new todo', async () => {
      const user = userEvent.setup();
      window.location.search = '?status=active';
      const activeTodos = mockTodos.filter(t => !t.completed);
      vi.mocked(todosApi.fetchTodos).mockResolvedValue(activeTodos);

      const newTodo = {
        id: 4,
        title: 'New Active Todo',
        description: '',
        completed: false,
        created_at: '2024-01-04T00:00:00Z',
        updated_at: '2024-01-04T00:00:00Z',
      };

      vi.mocked(todosApi.createTodo).mockResolvedValue(newTodo);

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
      });

      // Clear initial calls
      vi.mocked(todosApi.fetchTodos).mockClear();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue([...activeTodos, newTodo]);

      // Add a new todo
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      await user.type(titleInput, 'New Active Todo');

      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      // Verify todos were fetched with active filter maintained
      await waitFor(() => {
        expect(todosApi.fetchTodos).toHaveBeenCalledWith('active');
      });
    });
  });
});
