import React, { useState, useContext } from 'react' // Добавили useContext
import { CustomContext } from '../../store/store' // Импортируем контекст
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../Register/Register.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login } = useContext(CustomContext) // Берем функцию из стора
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success('С возвращением!')
        navigate('/')
      } else {
        toast.error(result.error || 'Неверный email или пароль')
      }
    } catch (err) {
      toast.error('Произошла ошибка при входе')
      console.error(err)
    } finally {
      setLoading(false) // Кнопка отлипнет в любом случае
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">С возвращением!</h1>
        <p className="auth-subtitle">Введите данные для входа в аккаунт</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Пароль</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
            <div
              className="forgot-pass"
              onClick={() =>
                toast.info('Функция восстановления пароля в разработке')
              }
            >
              Забыли пароль?
            </div>
          </div>

          <button className="main-auth-btn" type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <div className="auth-footer">
            Нет аккаунта?{' '}
            <span onClick={() => navigate('/register')}>
              Зарегистрироваться
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
