import { useState, useEffect, useCallback } from 'react';
import { Todo, fetchTodos, updateTodo, deleteTodo } from '../api/todos';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  refreshKey?: number;
  filter?: 'all' | 'active' | 'completed';
  onTodosChange?: (todos: Todo[]) => void;
}

function TodoList({ refreshKey, filter = 'all', onTodosChange }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Pass filter to fetchTodos based on current filter state
      const status = filter === 'all' ? undefined : filter;
      const fetchedTodos = await fetchTodos(status);
      setTodos(fetchedTodos);
      // Notify parent component of todos change
      if (onTodosChange) {
        onTodosChange(fetchedTodos);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load todos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filter, onTodosChange]);

  useEffect(() => {
    loadTodos();
  }, [refreshKey, loadTodos]);

  const handleToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await updateTodo(id, { completed: !todo.completed });
      setTodos(prevTodos => {
        const newTodos = prevTodos.map(t => (t.id === id ? updatedTodo : t));
        if (onTodosChange) {
          onTodosChange(newTodos);
        }
        return newTodos;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => {
        const newTodos = prevTodos.filter(t => t.id !== id);
        if (onTodosChange) {
          onTodosChange(newTodos);
        }
        return newTodos;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="todo-list-loading">Loading todos...</div>;
  }

  if (error) {
    return <div className="todo-list-error">{error}</div>;
  }

  if (todos.length === 0) {
    return <div className="todo-list-empty">No todos yet. Add one to get started!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default TodoList;
