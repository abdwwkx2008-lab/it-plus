import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
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

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error: sbError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
        },
      },
    })

    if (sbError) {
      toast.error(`Ошибка: ${sbError.message}`)
    } else {
      toast.success('Успешно! Добро пожаловать.')
      navigate('/')
    }
    setLoading(false)
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
