import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../TodoItem';
import { Todo } from '../../api/todos';

describe('TodoItem Component', () => {
  const mockTodo: Todo = {
    id: 1,
    title: 'Test todo',
    description: undefined,
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders todo with title', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('renders checkbox', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders delete button', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('checkbox is unchecked when todo is not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox is checked when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('applies completed styling when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const title = screen.getByText('Test todo');
    expect(title).toHaveClass('completed');
  });

  it('does not apply completed styling when todo is not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const title = screen.getByText('Test todo');
    expect(title).not.toHaveClass('completed');
  });

  it('calls onToggle with correct id when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with correct id when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('checkbox has correct aria-label for incomplete todo', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test todo" as complete');
  });

  it('checkbox has correct aria-label for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test todo" as incomplete');
  });

  it('delete button has correct aria-label', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toHaveAttribute('aria-label', 'Delete "Test todo"');
  });

  it('renders todo with long title correctly', () => {
    const longTitleTodo = {
      ...mockTodo,
      title: 'This is a very long todo title that should wrap properly in the UI',
    };
    render(<TodoItem todo={longTitleTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    expect(screen.getByText(longTitleTodo.title)).toBeInTheDocument();
  });

  it('does not call onDelete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const localOnDelete = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={localOnDelete} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(localOnDelete).not.toHaveBeenCalled();
  });
});
