import React, { useState, useContext, useEffect } from 'react'
import { CustomContext } from '../../store/store'
import { supabase } from '../../supabaseClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = () => {
  const { user, setUser, clearCart } = useContext(CustomContext)
  const [activeTab, setActiveTab] = useState('account')
  const navigate = useNavigate()

  // Состояния для форм
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [orders, setOrders] = useState([])
  const [isLogoutModal, setIsLogoutModal] = useState(false)

  // Подгружаем заказы только когда открыта вкладка "История заказов"
  useEffect(() => {
    if (activeTab === 'orders' && user?.id) {
      const fetchOrders = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error) setOrders(data || [])
      }
      fetchOrders()
    }
  }, [activeTab, user?.id])

  // Логика обновления профиля
  const updateProfile = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profileForm.full_name, phone: profileForm.phone })
      .eq('id', user.id)

    if (error) {
      toast.error('Ошибка обновления: ' + error.message)
    } else {
      setUser({ ...user, ...profileForm })
      toast.success('👉 Данные профиля успешно обновлены')
    }
  }

  // Логика смены пароля
  const updatePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Новый пароль должен быть не менее 6 символов')
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Пароли не совпадают')
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    })

    if (error) {
      toast.error('Ошибка: ' + error.message)
    } else {
      toast.success('👉 Пароль успешно изменён')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  // Логика выхода
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    if (clearCart) clearCart()
    setUser(null)
    navigate('/login')
    toast.info('Вы вышли из системы')
  }

  return (
    <div className="profile-wrapper animate-in">
      <h1 className="main-title">ЛИЧНЫЙ КАБИНЕТ</h1>

      <div className="profile-layout">
        {/* ЛЕВОЕ МЕНЮ */}
        <aside className="sidebar-menu">
          <div
            className={`menu-nav-item ${
              activeTab === 'account' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('account')}
          >
            Мой аккаунт
          </div>
          <div
            className={`menu-nav-item ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            Редактировать профиль
          </div>
          <div
            className={`menu-nav-item ${
              activeTab === 'orders' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('orders')}
          >
            История заказов
          </div>
          <div
            className={`menu-nav-item ${
              activeTab === 'password' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('password')}
          >
            Пароль
          </div>
          <div
            className="menu-nav-item logout-text"
            onClick={() => setIsLogoutModal(true)}
          >
            Выход
          </div>
        </aside>

        {/* КОНТЕНТНАЯ ЧАСТЬ */}
        <main className="content-area">
          {/* ВКЛАДКА: МОЙ АККАУНТ */}
          {activeTab === 'account' && (
            <div className="tab-content">
              <h2 className="welcome-text">
                Приветствуем, {user?.full_name || 'Пользователь'} !
              </h2>

              <div className="account-grid">
                <div
                  className="grid-box"
                  onClick={() => setActiveTab('account')}
                >
                  <span className="grid-icon">👤</span>
                  <span>Мой аккаунт</span>
                </div>
                <div
                  className="grid-box"
                  onClick={() => setActiveTab('orders')}
                >
                  <span className="grid-icon">📋</span>
                  <span>Заказы</span>
                </div>
                <div className="grid-box" onClick={() => setActiveTab('edit')}>
                  <span className="grid-icon">✏️</span>
                  <span>Редактировать профиль</span>
                </div>
                <div className="grid-box">
                  <span className="grid-icon">⭐</span>
                  <span>Избранные товары</span>
                </div>
                <div
                  className="grid-box logout-box"
                  onClick={() => setIsLogoutModal(true)}
                >
                  <span className="grid-icon">↪️</span>
                  <span>Выход</span>
                </div>
              </div>

              <div className="recent-orders">
                <h3>Последние заказы</h3>
                <p className="empty-txt">У вас пока нет заказов.</p>
              </div>
            </div>
          )}

          {/* ВКЛАДКА: РЕДАКТИРОВАНИЕ */}
          {activeTab === 'edit' && (
            <form className="tab-content" onSubmit={updateProfile}>
              <h2>Редактировать профиль</h2>
              <div className="form-group">
                <label>Полное имя</label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      full_name: e.target.value,
                    })
                  }
                  placeholder="Введите ваше имя"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
                <small className="input-hint">Email менять нельзя</small>
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="Номер телефона"
                />
              </div>
              <button type="submit" className="save-btn">
                Сохранить изменения
              </button>
            </form>
          )}

          {/* ВКЛАДКА: ПАРОЛЬ */}
          {activeTab === 'password' && (
            <form className="tab-content" onSubmit={updatePassword}>
              <h2>Смена пароля</h2>
              <div className="form-group">
                <label>Старый пароль</label>
                <input
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Новый пароль</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Повторите новый пароль</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <button type="submit" className="save-btn">
                Сохранить
              </button>
            </form>
          )}

          {/* ВКЛАДКА: ЗАКАЗЫ */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h2>История заказов</h2>
              <div className="orders-container">
                {orders.length === 0 ? (
                  <p className="empty-txt">У вас еще нет заказов.</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-row">
                        <div className="order-info">
                          <span className="order-num">
                            Заказ #{order.id.slice(0, 8)}
                          </span>
                          <span className="order-date">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="order-meta">
                          <span className="order-price">
                            {order.total_price.toLocaleString()} ₽
                          </span>
                          <span className={`status-pill ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* МОДАЛКА ВЫХОДА (Apple Style) */}
      {isLogoutModal && (
        <div className="modal-overlay" onClick={() => setIsLogoutModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Подтверждение</div>
            <div className="modal-body">
              Вы действительно хотите выйти из аккаунта?
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn-cancel"
                onClick={() => setIsLogoutModal(false)}
              >
                Отмена
              </button>
              <button className="modal-btn-exit" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
