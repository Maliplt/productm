import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('isAuth') === 'true')

  const handleAuth = (status: boolean) => {
    setIsAuth(status)
    if (status) {
      localStorage.setItem('isAuth', 'true')
    } else {
      localStorage.removeItem('isAuth')
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Dashboard onLogout={() => handleAuth(false)} /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/login" element={!isAuth ? <Login onLogin={() => handleAuth(true)} /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
