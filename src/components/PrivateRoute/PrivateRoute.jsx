import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CustomContext } from '../../store/store'

const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useContext(CustomContext)
  const location = useLocation()

  // ⏳ Состояние проверки сессии Supabase
  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '20px',
          background: '#fff',
        }}
      >
        {/* Можно заменить на ваш SVG-спиннер */}
        <div
          className="loader-simple"
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '18px', color: '#666', fontWeight: '500' }}>
          Проверка доступа...
        </span>
      </div>
    )
  }

  // ❌ Если не авторизован — отправляем на логин
  // Сохраняем текущий путь в state, чтобы вернуться сюда после входа
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ✅ Если авторизован — рендерим защищенный контент
  return children
}

export default PrivateRoute
