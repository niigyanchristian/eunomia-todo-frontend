import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../TodoList';
import * as todosApi from '../../api/todos';

// Mock the todos API module
vi.mock('../../api/todos', () => ({
  fetchTodos: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

describe('TodoList Component', () => {
  const mockFetchTodos = vi.mocked(todosApi.fetchTodos);
  const mockUpdateTodo = vi.mocked(todosApi.updateTodo);
  const mockDeleteTodo = vi.mocked(todosApi.deleteTodo);

  const mockTodos = [
    {
      id: 1,
      title: 'First todo',
      description: undefined,
      completed: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Second todo',
      description: undefined,
      completed: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      title: 'Third todo',
      description: undefined,
      completed: false,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    mockFetchTodos.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<TodoList />);

    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  it('fetches and displays todos on mount', async () => {
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText('Third todo')).toBeInTheDocument();
    expect(mockFetchTodos).toHaveBeenCalledTimes(1);
  });

  it('displays empty state when no todos exist', async () => {
    mockFetchTodos.mockResolvedValueOnce([]);
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'Network error';
    mockFetchTodos.mockRejectedValueOnce(new Error(errorMessage));
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays generic error message for non-Error failures', async () => {
    mockFetchTodos.mockRejectedValueOnce('Unknown error');
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load todos')).toBeInTheDocument();
    });
  });

  it('renders correct number of todo items', async () => {
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    render(<TodoList />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });
  });

  it('calls updateTodo with correct params when checkbox is toggled', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockUpdateTodo.mockResolvedValueOnce({
      ...mockTodos[0],
      completed: true,
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith(1, { completed: true });
    });
    expect(mockUpdateTodo).toHaveBeenCalledTimes(1);
  });

  it('calls updateTodo to uncomplete a completed todo', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockUpdateTodo.mockResolvedValueOnce({
      ...mockTodos[1],
      completed: false,
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith(2, { completed: false });
    });
  });

  it('updates UI optimistically when todo is toggled', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockUpdateTodo.mockResolvedValueOnce({
      ...mockTodos[0],
      completed: true,
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
    });
  });

  it('calls deleteTodo with correct id when delete button is clicked', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockDeleteTodo.mockResolvedValueOnce();

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith(1);
    });
    expect(mockDeleteTodo).toHaveBeenCalledTimes(1);
  });

  it('removes todo from list after successful deletion', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockDeleteTodo.mockResolvedValueOnce();

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('First todo')).not.toBeInTheDocument();
    });

    // Other todos should still be present
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText('Third todo')).toBeInTheDocument();
  });

  it('displays error message when update fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to update';
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockUpdateTodo.mockRejectedValueOnce(new Error(errorMessage));

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays error message when delete fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to delete';
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockDeleteTodo.mockRejectedValueOnce(new Error(errorMessage));

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('refetches todos when refreshKey changes', async () => {
    mockFetchTodos.mockResolvedValue(mockTodos);

    const { rerender } = render(<TodoList refreshKey={0} />);

    await waitFor(() => {
      expect(mockFetchTodos).toHaveBeenCalledTimes(1);
    });

    // Change refreshKey
    rerender(<TodoList refreshKey={1} />);

    await waitFor(() => {
      expect(mockFetchTodos).toHaveBeenCalledTimes(2);
    });
  });

  it('does not refetch when refreshKey stays the same', async () => {
    mockFetchTodos.mockResolvedValue(mockTodos);

    const { rerender } = render(<TodoList refreshKey={0} />);

    await waitFor(() => {
      expect(mockFetchTodos).toHaveBeenCalledTimes(1);
    });

    // Rerender with same refreshKey
    rerender(<TodoList refreshKey={0} />);

    // Should still be called only once
    expect(mockFetchTodos).toHaveBeenCalledTimes(1);
  });

  it('displays empty state after deleting the last todo', async () => {
    const user = userEvent.setup();
    const singleTodo = [mockTodos[0]];
    mockFetchTodos.mockResolvedValueOnce(singleTodo);
    mockDeleteTodo.mockResolvedValueOnce();

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
    });
  });

  it('displays generic error message for non-Error update failures', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockUpdateTodo.mockRejectedValueOnce('Unknown error');

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getByText('Failed to update todo')).toBeInTheDocument();
    });
  });

  it('displays generic error message for non-Error delete failures', async () => {
    const user = userEvent.setup();
    mockFetchTodos.mockResolvedValueOnce(mockTodos);
    mockDeleteTodo.mockRejectedValueOnce('Unknown error');

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete todo')).toBeInTheDocument();
    });
  });
});
