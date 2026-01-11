import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { CustomContext } from '../../store/store'

const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useContext(CustomContext)

  // ⏳ ЖДЁМ ТОЛЬКО ПРОВЕРКУ АВТОРИЗАЦИИ
  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Секунду, проверяем доступ...
      </div>
    )
  }

  // ❌ ЕСЛИ НЕ АВТОРИЗОВАН — НА /login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ✅ ЕСЛИ АВТОРИЗОВАН — ПОКАЗЫВАЕМ СТРАНИЦУ
  return children
}

export default PrivateRoute
