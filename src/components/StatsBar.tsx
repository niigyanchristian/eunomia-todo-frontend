import { useState, useEffect } from 'react';
import { fetchStats, StatsResponse, ApiError } from '../api/todos';
import './StatsBar.css';

function StatsBar() {
  const [stats, setStats] = useState<StatsResponse>({ total: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Failed to load stats: ${err.message}`);
        } else if (err instanceof Error) {
          setError(`Failed to load stats: ${err.message}`);
        } else {
          setError('Failed to load stats');
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-bar">
        <div className="stats-bar-content">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-bar stats-bar-error">
        <div className="stats-bar-content">{error}</div>
      </div>
    );
  }

  return (
    <div className="stats-bar">
      <div className="stats-bar-content">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
