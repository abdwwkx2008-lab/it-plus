import React, { useContext, useState } from 'react'
import { CustomContext } from '../../store/store'
import { Link } from 'react-router-dom'
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

  const deliveryLimit = 50000
  const remainsForFree = deliveryLimit - totalPrice
  const finalPrice = totalPrice >= deliveryLimit ? totalPrice : totalPrice + 500

  const handleCheckout = async () => {
    setIsSending(true)
    const customerData = {
      name: user?.user_metadata?.full_name || 'Клиент',
      phone: user?.user_metadata?.phone || 'Не указан',
    }

    const success = await sendOrder(customerData)

    if (success) {
      setIsModalOpen(true)
      clearCart()
    }
    setIsSending(false)
  }

  if (cart.length === 0 && !isModalOpen) {
    return (
      <div className="empty-page-state">
        <div className="container">
          <div className="empty-card">
            <span className="empty-icon">🛒</span>
            <h2>Корзина пуста</h2>
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
                {/* Исправили обертку картинки */}
                <div className="item-img-wrapper">
                  <img
                    src={item.images?.[0]}
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
                  {totalPrice >= deliveryLimit ? 'Бесплатно' : '500 ₽'}
                </span>
              </div>

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
                {isSending ? 'Отправка...' : 'Оформить заказ'}
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="apple-link-btn"
            >
              Хорошо
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
