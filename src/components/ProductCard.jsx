import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CustomContext } from '../store/store'
import { toast } from 'react-toastify'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { favorites, toggleFavorite, addToCart } = useContext(CustomContext)
  const isFavorite = favorites?.some((fav) => fav.id === product.id)

  if (!product) return null

  const inStock = product.count > 0 || product.in_stock === true
  const productColor = product.specs?.color
  const productStorage = product.specs?.storage

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product)
    // Уведомление toast уже вызывается внутри функции toggleFavorite в store
  }

  const handleCartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    // Уведомление toast уже вызывается внутри функции addToCart в store
  }

  return (
    <div className="product-card">
      {/* Кнопка избранного */}
      <div
        className={`product-card-favorite-button ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
        <svg
          className="heart-icon"
          viewBox="0 0 24 24"
          fill={isFavorite ? '#ff3b30' : 'none'}
          stroke={isFavorite ? '#ff3b30' : '#1d1d1f'}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <Link to={`/product/${product.id}`} className="product-card-link">
        {/* Изображение */}
        <div className="product-image-wrapper">
          <img
            className="product-img"
            src={product.images?.[0] || 'placeholder.jpg'}
            alt={product.title}
          />
        </div>

        {/* Контентная часть */}
        <div className="product-info-wrapper">
          <div className="product-meta-top">
            <span className="product-brand-name">{product.brand}</span>
            <div className="product-status-tags">
              <span className={`condition-tag ${product.condition}`}>
                {product.condition === 'used' ? 'Б/У' : 'Новый'}
              </span>
              <span
                className={`product-stock-badge ${
                  inStock ? 'is-ok' : 'is-order'
                }`}
              >
                {inStock ? '●' : '🔵'}
              </span>
            </div>
          </div>

          <h3 className="product-name">{product.title}</h3>

          {/* Характеристики в одну линию */}
          <div className="product-tags-row">
            {productColor && (
              <span className="badge-tag color-tag">{productColor}</span>
            )}
            {productStorage && (
              <span className="badge-tag storage-tag">{productStorage}</span>
            )}
            {product.condition === 'used' && product.battery_health && (
              <span className="badge-tag battery-tag">
                🔋 {product.battery_health}%
              </span>
            )}
          </div>

          {/* Подвал с ценой и кнопкой */}
          <div className="product-card-footer">
            <p className="product-price">{product.price?.toLocaleString()} ₽</p>
            <button
              className={`product-card-add-btn-gradient ${
                !inStock ? 'btn-order' : ''
              }`}
              onClick={handleCartClick}
            >
              <svg
                className="cart-mini-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>{inStock ? 'В корзину' : 'Заказать'}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
