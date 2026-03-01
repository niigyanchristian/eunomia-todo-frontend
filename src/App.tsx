import { useState } from 'react'
import AddTodo from './components/AddTodo'
import TodoList from './components/TodoList'
import './App.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTodoAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <>
      <h1>Todo App</h1>
      <div className="card">
        <AddTodo onAdd={handleTodoAdded} />
        <TodoList refreshKey={refreshKey} />
      </div>
    </>
  )
}

export default App
