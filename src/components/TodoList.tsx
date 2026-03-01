import { useState, useEffect } from 'react';
import { Todo, fetchTodos, updateTodo, deleteTodo } from '../api/todos';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  refreshKey?: number;
}

function TodoList({ refreshKey }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTodos = await fetchTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load todos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [refreshKey]);

  const handleToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await updateTodo(id, { completed: !todo.completed });
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === id ? updatedTodo : t))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
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
