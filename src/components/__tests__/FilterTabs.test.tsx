import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterTabs from '../FilterTabs';

describe('FilterTabs Component', () => {
  const mockOnFilterChange = vi.fn();
  let originalLocation: Location;
  let originalHistory: History;

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
    } as Location;

    // Mock window.history.pushState
    window.history.pushState = vi.fn();
  });

  afterEach(() => {
    window.location = originalLocation;
    window.history = originalHistory;
  });

  describe('Rendering', () => {
    it('renders all three filter tabs', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      expect(screen.getByRole('tab', { name: /show all todos/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /show active todos/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /show completed todos/i })).toBeInTheDocument();
    });

    it('renders tabs with correct text content', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('renders with tablist role and correct aria-label', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Filter todos');
    });
  });

  describe('Active Tab Highlighting', () => {
    it('highlights "All" tab when currentFilter is "all"', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      expect(allTab).toHaveClass('active');
      expect(allTab).toHaveAttribute('aria-selected', 'true');
    });

    it('highlights "Active" tab when currentFilter is "active"', () => {
      render(<FilterTabs currentFilter="active" onFilterChange={mockOnFilterChange} />);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      expect(activeTab).toHaveClass('active');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('highlights "Completed" tab when currentFilter is "completed"', () => {
      render(<FilterTabs currentFilter="completed" onFilterChange={mockOnFilterChange} />);

      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      expect(completedTab).toHaveClass('active');
      expect(completedTab).toHaveAttribute('aria-selected', 'true');
    });

    it('only one tab is highlighted at a time', () => {
      render(<FilterTabs currentFilter="active" onFilterChange={mockOnFilterChange} />);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });

      expect(allTab).not.toHaveClass('active');
      expect(activeTab).toHaveClass('active');
      expect(completedTab).not.toHaveClass('active');
    });

    it('sets aria-selected to false for non-active tabs', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });

      expect(activeTab).toHaveAttribute('aria-selected', 'false');
      expect(completedTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Filter Change Callback', () => {
    it('calls onFilterChange with "all" when All tab is clicked', async () => {
      const user = userEvent.setup();
      window.location.search = '?status=active';
      render(<FilterTabs currentFilter="active" onFilterChange={mockOnFilterChange} />);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      await user.click(allTab);

      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
      // Should be called once from the click (not from useEffect since currentFilter matches URL)
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFilterChange with "active" when Active tab is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      await user.click(activeTab);

      expect(mockOnFilterChange).toHaveBeenCalledWith('active');
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFilterChange with "completed" when Completed tab is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      await user.click(completedTab);

      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFilterChange even when clicking the already active tab', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      await user.click(allTab);

      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    });
  });

  describe('URL Query Parameter Management', () => {
    it('updates URL with status=active when Active tab is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      await user.click(activeTab);

      expect(window.history.pushState).toHaveBeenCalled();
      const pushStateCall = vi.mocked(window.history.pushState).mock.calls[0];
      const newUrl = pushStateCall[2];
      expect(newUrl.toString()).toContain('status=active');
    });

    it('updates URL with status=completed when Completed tab is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      await user.click(completedTab);

      expect(window.history.pushState).toHaveBeenCalled();
      const pushStateCall = vi.mocked(window.history.pushState).mock.calls[0];
      const newUrl = pushStateCall[2];
      expect(newUrl.toString()).toContain('status=completed');
    });

    it('removes status parameter from URL when All tab is clicked', async () => {
      const user = userEvent.setup();
      window.location.search = '?status=active';

      render(<FilterTabs currentFilter="active" onFilterChange={mockOnFilterChange} />);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      await user.click(allTab);

      expect(window.history.pushState).toHaveBeenCalled();
      const pushStateCall = vi.mocked(window.history.pushState).mock.calls[0];
      const newUrl = pushStateCall[2];
      expect(newUrl.toString()).not.toContain('status=');
    });

    it('initializes from URL query parameter - active', () => {
      window.location.search = '?status=active';

      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      expect(mockOnFilterChange).toHaveBeenCalledWith('active');
    });

    it('initializes from URL query parameter - completed', () => {
      window.location.search = '?status=completed';

      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    });

    it('initializes to "all" when no status parameter in URL', () => {
      window.location.search = '';

      render(<FilterTabs currentFilter="active" onFilterChange={mockOnFilterChange} />);

      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    });

    it('does not call onFilterChange if URL matches current filter', () => {
      window.location.search = '?status=active';

      render(<FilterTabs currentFilter="active" onFilterChange={mockOnFilterChange} />);

      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });

    it('ignores invalid status values in URL', () => {
      window.location.search = '?status=invalid';

      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      // Should not call onFilterChange since currentFilter is already 'all'
      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper role="tab" on all tab buttons', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('has descriptive aria-label for each tab', () => {
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      expect(screen.getByLabelText('Show all todos')).toBeInTheDocument();
      expect(screen.getByLabelText('Show active todos')).toBeInTheDocument();
      expect(screen.getByLabelText('Show completed todos')).toBeInTheDocument();
    });

    it('can be navigated with keyboard', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const allTab = screen.getByRole('tab', { name: /show all todos/i });
      const activeTab = screen.getByRole('tab', { name: /show active todos/i });

      // Tab to first button
      await user.tab();
      expect(allTab).toHaveFocus();

      // Tab to second button
      await user.tab();
      expect(activeTab).toHaveFocus();
    });

    it('can be activated with Enter key', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      activeTab.focus();

      await user.keyboard('{Enter}');

      expect(mockOnFilterChange).toHaveBeenCalledWith('active');
    });

    it('can be activated with Space key', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      completedTab.focus();

      await user.keyboard(' ');

      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    });
  });

  describe('Multiple Tab Clicks', () => {
    it('handles switching between different filters', async () => {
      const user = userEvent.setup();
      render(<FilterTabs currentFilter="all" onFilterChange={mockOnFilterChange} />);

      const activeTab = screen.getByRole('tab', { name: /show active todos/i });
      const completedTab = screen.getByRole('tab', { name: /show completed todos/i });
      const allTab = screen.getByRole('tab', { name: /show all todos/i });

      await user.click(activeTab);
      expect(mockOnFilterChange).toHaveBeenCalledWith('active');

      await user.click(completedTab);
      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');

      await user.click(allTab);
      expect(mockOnFilterChange).toHaveBeenCalledWith('all');

      expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
    });
  });
});
