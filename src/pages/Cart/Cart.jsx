import React, { useContext, useState } from 'react'
import { CustomContext } from '../../store/store'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Cart.css'

const Cart = () => {
  const {
    cart,
    addToCart,
    minusOne,
    removeFromCart,
    totalPrice,
    sendOrder,
    clearCart,
    user,
  } = useContext(CustomContext)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const navigate = useNavigate()

  const deliveryLimit = 50000
  const deliveryPrice = 500
  const remainsForFree = deliveryLimit - totalPrice
  const finalPrice =
    totalPrice >= deliveryLimit ? totalPrice : totalPrice + deliveryPrice

  const handleCheckout = async () => {
    if (!user) {
      toast.warning('Пожалуйста, войдите в аккаунт для оформления заказа')
      navigate('/login')
      return
    }

    setIsSending(true)

    const customerData = {
      name: user?.user_metadata?.full_name || 'Не указано',
      phone: user?.user_metadata?.phone || 'Не указан',
      email: user?.email || '', // Добавляем email для полноты данных
    }

    try {
      const success = await sendOrder(customerData)

      if (success) {
        setIsModalOpen(true)
        clearCart()
      }
    } catch (error) {
      toast.error('Ошибка при оформлении заказа')
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  if (cart.length === 0 && !isModalOpen) {
    return (
      <div className="empty-page-state">
        <div className="container">
          <div className="empty-card">
            <span className="empty-icon">🛒</span>
            <h2>Корзина пуста</h2>
            <p>Но это легко исправить!</p>
            <Link to="/catalog" className="apple-link-btn">
              В каталог
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <h1 className="page-main-title">Ваша корзина</h1>
        <div className="cart-layout">
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="item-img-wrapper">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/120'}
                    alt={item.title}
                    className="item-img"
                  />
                </div>

                <div className="item-main-info">
                  <div className="item-header">
                    <span className="item-brand">{item.brand}</span>
                    <h3 className="item-title">{item.title}</h3>
                  </div>

                  <div className="item-controls-row">
                    <div className="qty-selector">
                      <button onClick={() => minusOne(item.id)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div className="item-price-block">
                  <p className="item-total-price">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-checkout-sidebar">
            <div className="summary-card">
              <h3>Итого</h3>
              <div className="summary-row">
                <span>Товары</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="summary-row">
                <span>Доставка</span>
                <span
                  className={totalPrice >= deliveryLimit ? 'free-text' : ''}
                >
                  {totalPrice >= deliveryLimit
                    ? 'Бесплатно'
                    : `${deliveryPrice} ₽`}
                </span>
              </div>

              {totalPrice < deliveryLimit && (
                <p className="delivery-hint">
                  Добавьте товаров на{' '}
                  <strong>{remainsForFree.toLocaleString()} ₽</strong> для
                  бесплатной доставки
                </p>
              )}

              <hr className="summary-divider" />

              <div className="summary-total-row">
                <span>К оплате</span>
                <span>{finalPrice.toLocaleString()} ₽</span>
              </div>

              <button
                className="checkout-main-btn"
                onClick={handleCheckout}
                disabled={isSending}
              >
                {isSending
                  ? 'Отправка...'
                  : user
                  ? 'Оформить заказ'
                  : 'Войти и оформить'}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">✅</div>
            <h2>Заказ отправлен!</h2>
            <p>Мы свяжемся с вами в течение 10 минут для подтверждения.</p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  navigate('/profile')
                }}
                className="apple-link-btn"
              >
                Посмотреть в профиле
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  navigate('/')
                }}
                className="secondary-modal-btn"
              >
                На главную
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
