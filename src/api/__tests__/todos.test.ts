/**
 * Comprehensive unit tests for the todos API client module
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  fetchStats,
  ApiError,
  type Todo,
  type StatsResponse,
} from '../todos';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Sample todo data for testing
const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const mockTodos: Todo[] = [
  mockTodo,
  {
    id: 2,
    title: 'Another Todo',
    description: undefined,
    completed: true,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
];

describe('Todo API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock window.location.origin for URL construction
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchTodos', () => {
    it('should fetch all todos without status filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTodos,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchTodos();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockTodos);
    });

    it('should fetch todos with active status filter', async () => {
      const activeTodos = mockTodos.filter((t) => !t.completed);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => activeTodos,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchTodos('active');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos?status=active',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(activeTodos);
    });

    it('should fetch todos with completed status filter', async () => {
      const completedTodos = mockTodos.filter((t) => t.completed);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => completedTodos,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchTodos('completed');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos?status=completed',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(completedTodos);
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchTodos();

      expect(result).toEqual([]);
    });

    it('should throw ApiError on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error occurred',
        headers: new Headers(),
      });

      try {
        await fetchTodos();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Server error occurred');
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchTodos()).rejects.toThrow('Network error');
    });
  });

  describe('createTodo', () => {
    it('should create a todo with title and description', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockTodo,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await createTodo('Test Todo', 'Test Description');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Todo',
            description: 'Test Description',
          }),
        })
      );
      expect(result).toEqual(mockTodo);
    });

    it('should create a todo with only title', async () => {
      const todoWithoutDescription = { ...mockTodo, description: undefined };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => todoWithoutDescription,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await createTodo('Test Todo');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'Test Todo',
            description: undefined,
          }),
        })
      );
      expect(result).toEqual(todoWithoutDescription);
    });

    it('should handle empty description string', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ ...mockTodo, description: undefined }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await createTodo('Test Todo', '');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos',
        expect.objectContaining({
          body: JSON.stringify({
            title: 'Test Todo',
            description: undefined,
          }),
        })
      );
      expect(result.description).toBeUndefined();
    });

    it('should throw ApiError on validation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Title is required',
        headers: new Headers(),
      });

      try {
        await createTodo('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Title is required');
      }
    });

    it('should throw ApiError on server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Database connection failed',
        headers: new Headers(),
      });

      await expect(createTodo('Test')).rejects.toThrow(ApiError);
    });
  });

  describe('updateTodo', () => {
    it('should update todo with partial fields', async () => {
      const updatedTodo = { ...mockTodo, completed: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedTodo,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await updateTodo(1, { completed: true });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        })
      );
      expect(result).toEqual(updatedTodo);
    });

    it('should update todo title', async () => {
      const updatedTodo = { ...mockTodo, title: 'Updated Title' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedTodo,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await updateTodo(1, { title: 'Updated Title' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos/1',
        expect.objectContaining({
          body: JSON.stringify({ title: 'Updated Title' }),
        })
      );
      expect(result.title).toBe('Updated Title');
    });

    it('should update todo description', async () => {
      const updatedTodo = { ...mockTodo, description: 'New Description' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedTodo,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await updateTodo(1, { description: 'New Description' });

      expect(result.description).toBe('New Description');
    });

    it('should update multiple fields at once', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      };
      const updatedTodo = { ...mockTodo, ...updates };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedTodo,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await updateTodo(1, updates);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos/1',
        expect.objectContaining({
          body: JSON.stringify(updates),
        })
      );
      expect(result).toEqual(updatedTodo);
    });

    it('should throw ApiError when todo not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Todo not found',
        headers: new Headers(),
      });

      try {
        await updateTodo(999, { completed: true });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Todo not found');
      }
    });

    it('should handle invalid update data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid update data',
        headers: new Headers(),
      });

      await expect(updateTodo(1, {})).rejects.toThrow(ApiError);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({ 'content-length': '0' }),
        json: async () => {
          throw new Error('No content');
        },
      });

      await expect(deleteTodo(1)).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should handle 200 response with empty body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-length': '0' }),
        json: async () => {
          throw new Error('No content');
        },
      });

      await expect(deleteTodo(1)).resolves.toBeUndefined();
    });

    it('should throw ApiError when todo not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Todo not found',
        headers: new Headers(),
      });

      try {
        await deleteTodo(999);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Todo not found');
      }
    });

    it('should handle deletion of already deleted todo', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 410,
        statusText: 'Gone',
        text: async () => 'Todo already deleted',
        headers: new Headers(),
      });

      await expect(deleteTodo(1)).rejects.toThrow(ApiError);
    });
  });

  describe('ApiError', () => {
    it('should create ApiError with status and message', () => {
      const error = new ApiError(404, 'Not Found');

      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.name).toBe('ApiError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be catchable as Error', () => {
      try {
        throw new ApiError(500, 'Server Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.status).toBe(500);
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      try {
        await fetchTodos();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Invalid JSON response');
      }
    });

    it('should handle error response with no body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => {
          throw new Error('Cannot read body');
        },
        headers: new Headers(),
      });

      await expect(fetchTodos()).rejects.toThrow(ApiError);
    });

    it('should use statusText when error body is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        text: async () => '',
        headers: new Headers(),
      });

      await expect(fetchTodos()).rejects.toThrow('Service Unavailable');
    });
  });

  describe('fetchStats', () => {
    it('should fetch stats successfully', async () => {
      const mockStats: StatsResponse = {
        total: 10,
        active: 6,
        completed: 4,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockStats,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchStats();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos/stats',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockStats);
    });

    it('should handle zero stats', async () => {
      const mockStats: StatsResponse = {
        total: 0,
        active: 0,
        completed: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockStats,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchStats();

      expect(result).toEqual(mockStats);
      expect(result.total).toBe(0);
      expect(result.active).toBe(0);
      expect(result.completed).toBe(0);
    });

    it('should handle all active todos', async () => {
      const mockStats: StatsResponse = {
        total: 5,
        active: 5,
        completed: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockStats,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchStats();

      expect(result.total).toBe(5);
      expect(result.active).toBe(5);
      expect(result.completed).toBe(0);
    });

    it('should handle all completed todos', async () => {
      const mockStats: StatsResponse = {
        total: 8,
        active: 0,
        completed: 8,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockStats,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchStats();

      expect(result.total).toBe(8);
      expect(result.active).toBe(0);
      expect(result.completed).toBe(8);
    });

    it('should handle large numbers', async () => {
      const mockStats: StatsResponse = {
        total: 999,
        active: 500,
        completed: 499,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockStats,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await fetchStats();

      expect(result.total).toBe(999);
      expect(result.active).toBe(500);
      expect(result.completed).toBe(499);
    });

    it('should throw ApiError on server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Failed to fetch stats',
        headers: new Headers(),
      });

      try {
        await fetchStats();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Failed to fetch stats');
        expect((error as ApiError).status).toBe(500);
      }
    });

    it('should throw ApiError on not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Stats endpoint not found',
        headers: new Headers(),
      });

      try {
        await fetchStats();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Stats endpoint not found');
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchStats()).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      try {
        await fetchStats();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Invalid JSON response');
      }
    });
  });

  describe('Interface Validation', () => {
    it('should validate Todo interface structure', () => {
      const todo: Todo = {
        id: 1,
        title: 'Test',
        description: 'Description',
        completed: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      expect(todo.id).toBeTypeOf('number');
      expect(todo.title).toBeTypeOf('string');
      expect(todo.description).toBeTypeOf('string');
      expect(todo.completed).toBeTypeOf('boolean');
      expect(todo.created_at).toBeTypeOf('string');
      expect(todo.updated_at).toBeTypeOf('string');
    });

    it('should allow undefined description', () => {
      const todo: Todo = {
        id: 1,
        title: 'Test',
        description: undefined,
        completed: false,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      expect(todo.description).toBeUndefined();
    });

    it('should work with Partial<Todo> for updates', () => {
      const updates: Partial<Todo> = {
        completed: true,
      };

      expect(updates.completed).toBe(true);
      expect(updates.title).toBeUndefined();
    });

    it('should validate StatsResponse interface structure', () => {
      const stats: StatsResponse = {
        total: 10,
        active: 6,
        completed: 4,
      };

      expect(stats.total).toBeTypeOf('number');
      expect(stats.active).toBeTypeOf('number');
      expect(stats.completed).toBeTypeOf('number');
    });
  });
});
