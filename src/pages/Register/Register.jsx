import React, { useState, useContext } from 'react' // Добавили useContext
import { CustomContext } from '../../store/store' // Импортируем контекст
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Register.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useContext(CustomContext) // Берем функцию из стора
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Вызываем функцию из стора, которую мы написали в предыдущем шаге
      const result = await register({
        email,
        password,
        fullName,
        phone,
      })

      if (result.success) {
        toast.success('Успешно! Добро пожаловать.')
        navigate('/')
      } else {
        // Если в сторе произошла ошибка, она придет сюда в result.error
        toast.error(result.error || 'Ошибка при регистрации')
      }
    } catch (err) {
      toast.error('Произошла непредвиденная ошибка')
      console.error(err)
    } finally {
      setLoading(false) // ВСЕГДА выключаем загрузку
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Создать аккаунт</h1>
        <p className="auth-subtitle">Заполните данные для регистрации</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Полное имя</label>
            <input
              type="text"
              placeholder="ФИО"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <label>Номер телефона</label>
            <input
              type="tel"
              placeholder="+7..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
                minLength={6}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>

          <button className="main-auth-btn" type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Зарегистрироваться'}
          </button>

          <div className="auth-footer">
            Уже есть аккаунт?{' '}
            <span onClick={() => navigate('/login')}>Войти</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
