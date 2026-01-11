import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import '../Register/Register.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (sbError) {
      alert('Неверный email или пароль')
    } else {
      navigate('/')
    }
    setLoading(false)
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
              onClick={() => alert('Функция в разработке')}
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
