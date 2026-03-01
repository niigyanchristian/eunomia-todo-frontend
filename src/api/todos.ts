/**
 * Todo API Client Module
 * Provides centralized API client functions for managing todos
 */

// Todo TypeScript interface
export interface Todo {
  id: number;
  title: string;
  description: string | undefined;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// API base URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new ApiError(response.status, errorText || response.statusText);
  }

  // Handle empty responses (e.g., for DELETE requests)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(response.status, 'Invalid JSON response');
  }
}

/**
 * Fetch todos with optional status filter
 * @param status - Optional filter: 'active' for incomplete todos, 'completed' for completed todos
 * @returns Promise with array of todos
 */
export async function fetchTodos(status?: 'active' | 'completed'): Promise<Todo[]> {
  const url = new URL(`${API_BASE_URL}/todos`, window.location.origin);

  if (status) {
    url.searchParams.append('status', status);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Todo[]>(response);
}

/**
 * Create a new todo
 * @param title - The title of the todo
 * @param description - Optional description
 * @returns Promise with the created todo
 */
export async function createTodo(title: string, description?: string): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description: description || undefined,
    }),
  });

  return handleResponse<Todo>(response);
}

/**
 * Update an existing todo
 * @param id - The ID of the todo to update
 * @param updates - Partial todo object with fields to update
 * @returns Promise with the updated todo
 */
export async function updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  return handleResponse<Todo>(response);
}

/**
 * Delete a todo
 * @param id - The ID of the todo to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await handleResponse<void>(response);
}
