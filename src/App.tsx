import { useState, useEffect, useCallback } from 'react'
import AddTodo from './components/AddTodo'
import TodoList from './components/TodoList'
import FilterTabs, { FilterType } from './components/FilterTabs'
import ItemCounter from './components/ItemCounter'
import StatsBar from './components/StatsBar'
import { Todo } from './api/todos'
import './App.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
  const [todos, setTodos] = useState<Todo[]>([])

  // Read URL query param on mount to set initial filter state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const statusParam = params.get('status')

    if (statusParam === 'active' || statusParam === 'completed') {
      setCurrentFilter(statusParam)
    } else {
      setCurrentFilter('all')
    }
  }, [])

  const handleTodoAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter)
    setRefreshKey(prev => prev + 1)
  }

  const handleTodosChange = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos)
  }, [])

  // Calculate active item count (incomplete todos)
  const activeCount = todos.filter(todo => !todo.completed).length

  return (
    <>
      <h1>Todo App</h1>
      <div className="card">
        <AddTodo onAdd={handleTodoAdded} />
        <FilterTabs currentFilter={currentFilter} onFilterChange={handleFilterChange} />
        <TodoList
          refreshKey={refreshKey}
          filter={currentFilter}
          onTodosChange={handleTodosChange}
        />
        <StatsBar />
        <ItemCounter count={activeCount} />
      </div>
    </>
  )
}

export default App
