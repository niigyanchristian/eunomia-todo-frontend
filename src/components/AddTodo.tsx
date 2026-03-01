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

    if (!inputValue.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createTodo(inputValue.trim());
      setInputValue('');
      onAdd();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
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
