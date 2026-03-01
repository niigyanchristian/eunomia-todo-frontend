import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StatsBar from '../StatsBar';
import * as todosApi from '../../api/todos';

// Mock the todos API module
vi.mock('../../api/todos', () => ({
  fetchStats: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

describe('StatsBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(todosApi.fetchStats).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<StatsBar />);

    expect(screen.getByText('Loading stats...')).toBeInTheDocument();
  });

  it('fetches and displays stats on mount', async () => {
    const mockStats = {
      total: 10,
      active: 6,
      completed: 4,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Active:')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Completed:')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('displays zero stats correctly', async () => {
    const mockStats = {
      total: 0,
      active: 0,
      completed: 0,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });

    const zeroValues = screen.getAllByText('0');
    expect(zeroValues).toHaveLength(3);
  });

  it('handles all active todos', async () => {
    const mockStats = {
      total: 5,
      active: 5,
      completed: 0,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });

    const fiveValues = screen.getAllByText('5');
    expect(fiveValues).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles all completed todos', async () => {
    const mockStats = {
      total: 8,
      active: 0,
      completed: 8,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });

    const eightValues = screen.getAllByText('8');
    expect(eightValues).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays error message on API error', async () => {
    const apiError = new todosApi.ApiError(500, 'Server error');
    vi.mocked(todosApi.fetchStats).mockRejectedValueOnce(apiError);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load stats: Server error')).toBeInTheDocument();
    });
  });

  it('displays error message on network error', async () => {
    vi.mocked(todosApi.fetchStats).mockRejectedValueOnce(new Error('Network error'));

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load stats: Network error')).toBeInTheDocument();
    });
  });

  it('displays generic error message on unknown error', async () => {
    vi.mocked(todosApi.fetchStats).mockRejectedValueOnce('Unknown error');

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load stats')).toBeInTheDocument();
    });
  });

  it('applies correct CSS class to stats bar', async () => {
    const mockStats = {
      total: 5,
      active: 3,
      completed: 2,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    const { container } = render(<StatsBar />);

    await waitFor(() => {
      const statsBar = container.querySelector('.stats-bar');
      expect(statsBar).toBeInTheDocument();
    });
  });

  it('applies error class when there is an error', async () => {
    vi.mocked(todosApi.fetchStats).mockRejectedValueOnce(new Error('Error'));

    const { container } = render(<StatsBar />);

    await waitFor(() => {
      const statsBar = container.querySelector('.stats-bar-error');
      expect(statsBar).toBeInTheDocument();
    });
  });

  it('renders all stat items with correct structure', async () => {
    const mockStats = {
      total: 15,
      active: 9,
      completed: 6,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    const { container } = render(<StatsBar />);

    await waitFor(() => {
      const statItems = container.querySelectorAll('.stat-item');
      expect(statItems).toHaveLength(3);
    });

    const statLabels = container.querySelectorAll('.stat-label');
    expect(statLabels).toHaveLength(3);

    const statValues = container.querySelectorAll('.stat-value');
    expect(statValues).toHaveLength(3);
  });

  it('calls fetchStats only once on mount', async () => {
    const mockStats = {
      total: 3,
      active: 2,
      completed: 1,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });

    expect(todosApi.fetchStats).toHaveBeenCalledTimes(1);
  });

  it('handles large numbers correctly', async () => {
    const mockStats = {
      total: 999,
      active: 500,
      completed: 499,
    };

    vi.mocked(todosApi.fetchStats).mockResolvedValueOnce(mockStats);

    render(<StatsBar />);

    await waitFor(() => {
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('499')).toBeInTheDocument();
  });
});
