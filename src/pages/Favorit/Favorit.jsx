import React, { useContext, useMemo } from 'react'
import { CustomContext } from '../../store/store'
import ProductCard from '../../components/ProductCard'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Favorit.css'

const Favorit = () => {
  const { favorites, toggleFavorite } = useContext(CustomContext)

  const countText = useMemo(() => {
    const n = favorites.length
    if (n === 1) return '1 товар'
    if (n > 1 && n < 5) return `${n} товара`
    return `${n} товаров`
  }, [favorites.length])

  const clearFavorites = () => {
    if (favorites.length === 0) return
    favorites.forEach((item) => toggleFavorite(item))
    toast.info('Избранное очищено')
  }

  return (
    <div className="favorit-page-wrapper">
      <div className="container">
        <header className="favorit-header">
          <div className="favorit-header-left">
            <h1 className="page-main-title">Избранное</h1>
            <span className="items-count">{countText}</span>
          </div>

          {favorites.length > 0 && (
            <button className="clear-favorites-btn" onClick={clearFavorites}>
              Очистить
            </button>
          )}
        </header>

        {favorites.length > 0 ? (
          <div className="favorite-grid">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-page-state">
            <div className="empty-card">
              <span className="empty-icon">🤍</span>
              <h2>В избранном пока пусто</h2>
              <p>
                Добавляйте товары в избранное, чтобы быстро вернуться к ним
                позже.
              </p>
              <Link to="/catalog" className="apple-link-btn">
                Перейти в каталог
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorit
