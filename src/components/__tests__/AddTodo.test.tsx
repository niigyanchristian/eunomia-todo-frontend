import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodo from '../AddTodo';
import * as todosApi from '../../api/todos';

// Mock the todos API module
vi.mock('../../api/todos', () => ({
  createTodo: vi.fn(),
}));

describe('AddTodo Component', () => {
  const mockOnAdd = vi.fn();
  const mockCreateTodo = vi.mocked(todosApi.createTodo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with input field and correct placeholder', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders Add button', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
  });

  it('disables Add button when input is empty', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeDisabled();
  });

  it('disables Add button when input contains only whitespace', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, '   ');

    expect(button).toBeDisabled();
  });

  it('enables Add button when input has text', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'New todo item');

    expect(button).not.toBeDisabled();
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'Test todo');

    expect(input).toHaveValue('Test todo');
  });

  it('calls createTodo with correct data on form submission', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockResolvedValueOnce({
      id: 1,
      title: 'New todo',
      description: undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'New todo');
    await user.click(button);

    expect(mockCreateTodo).toHaveBeenCalledWith('New todo');
    expect(mockCreateTodo).toHaveBeenCalledTimes(1);
  });

  it('trims whitespace before calling createTodo', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockResolvedValueOnce({
      id: 1,
      title: 'Trimmed todo',
      description: undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, '  Trimmed todo  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockCreateTodo).toHaveBeenCalledWith('Trimmed todo');
  });

  it('clears input field after successful submission', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockResolvedValueOnce({
      id: 1,
      title: 'New todo',
      description: undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('calls onAdd callback after successful submission', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockResolvedValueOnce({
      id: 1,
      title: 'New todo',
      description: undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error message when API call fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Network error';
    mockCreateTodo.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays generic error message for non-Error failures', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockRejectedValueOnce('Unknown error');

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create todo')).toBeInTheDocument();
    });
  });

  it('does not call onAdd callback when API call fails', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockRejectedValueOnce(new Error('API error'));

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not clear input when API call fails', async () => {
    const user = userEvent.setup();
    mockCreateTodo.mockRejectedValueOnce(new Error('API error'));

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });

    expect(input).toHaveValue('New todo');
  });

  it('disables input and button while submitting', async () => {
    const user = userEvent.setup();
    let resolveCreateTodo: (value: any) => void;
    const createTodoPromise = new Promise((resolve) => {
      resolveCreateTodo = resolve;
    });
    mockCreateTodo.mockReturnValueOnce(createTodoPromise as any);

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'New todo');
    await user.click(button);

    // Check that input and button are disabled during submission
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Adding...');

    // Resolve the promise
    resolveCreateTodo!({
      id: 1,
      title: 'New todo',
      description: undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('prevents form submission when input is empty', async () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const form = screen.getByRole('button', { name: /add/i }).closest('form');

    fireEvent.submit(form!);

    expect(mockCreateTodo).not.toHaveBeenCalled();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('clears error message on successful retry', async () => {
    const user = userEvent.setup();

    // First attempt fails
    mockCreateTodo.mockRejectedValueOnce(new Error('Network error'));

    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Second attempt succeeds
    mockCreateTodo.mockResolvedValueOnce({
      id: 1,
      title: 'New todo',
      description: undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await user.type(input, 'Another todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.queryByText('Network error')).not.toBeInTheDocument();
    });
  });
});
