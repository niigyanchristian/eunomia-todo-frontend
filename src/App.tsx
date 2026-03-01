import { useState } from 'react'
import AddTodo from './components/AddTodo'
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
        <p>Refresh key: {refreshKey}</p>
      </div>
    </>
  )
}

export default App
