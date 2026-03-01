import { useEffect, useRef } from 'react';
import './FilterTabs.css';

export type FilterType = 'all' | 'active' | 'completed';

interface FilterTabsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const currentFilterRef = useRef(currentFilter);
  const onFilterChangeRef = useRef(onFilterChange);
  currentFilterRef.current = currentFilter;
  onFilterChangeRef.current = onFilterChange;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');

    if (statusParam === 'active' || statusParam === 'completed') {
      if (currentFilterRef.current !== statusParam) {
        onFilterChangeRef.current(statusParam);
      }
    } else if (statusParam !== null || currentFilterRef.current !== 'all') {
      // If status param is invalid or null, and current filter is not 'all', reset to 'all'
      if (currentFilterRef.current !== 'all') {
        onFilterChangeRef.current('all');
      }
    }
  }, []);

  const handleTabClick = (filter: FilterType) => {
    const url = new URL(window.location.href);

    if (filter === 'all') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', filter);
    }

    window.history.pushState({}, '', url);
    onFilterChange(filter);
  };

  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter todos">
      <button
        role="tab"
        aria-selected={currentFilter === 'all'}
        aria-label="Show all todos"
        className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => handleTabClick('all')}
      >
        All
      </button>
      <button
        role="tab"
        aria-selected={currentFilter === 'active'}
        aria-label="Show active todos"
        className={`filter-tab ${currentFilter === 'active' ? 'active' : ''}`}
        onClick={() => handleTabClick('active')}
      >
        Active
      </button>
      <button
        role="tab"
        aria-selected={currentFilter === 'completed'}
        aria-label="Show completed todos"
        className={`filter-tab ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => handleTabClick('completed')}
      >
        Completed
      </button>
    </div>
  );
}

export default FilterTabs;
