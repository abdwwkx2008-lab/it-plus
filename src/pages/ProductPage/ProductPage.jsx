import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { CustomContext } from '../../store/store'
import { filtersConfig } from '../Catalog/filtersConfig'
import { motion, AnimatePresence } from 'framer-motion'
import './ProductPage.css'

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  const { favorites, toggleFavorite, addToCart } = useContext(CustomContext)
  const isFavorite = favorites?.some((fav) => fav.id === product?.id)

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('=== Попытка загрузки одного товара ===')
      console.log('ID товара из URL:', id)

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle() // maybeSingle лучше, чем single, если товар не найден

        if (error) {
          console.error('❌ Ошибка Supabase на ProductPage:', error.message)
        } else if (!data) {
          console.warn('⚠️ Товар с таким ID не найден в базе')
        } else {
          console.log('✅ Товар успешно загружен:', data)
          setProduct(data)
        }
      } catch (err) {
        console.error('❌ Критическая ошибка JS на ProductPage:', err)
      } finally {
        console.log('=== Загрузка завершена ===')
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])
  if (loading)
    return (
      <div className="loader-screen">
        <div className="pulse-circle"></div>
      </div>
    )

  if (!product)
    return (
      <div className="error-screen">
        <h2>Товар не найден</h2>
        <button onClick={() => navigate('/catalog')}>Назад</button>
      </div>
    )

  const getFilterLabel = (specKey, category) => {
    const categoryFilters = filtersConfig[category]
    const filter = categoryFilters?.find((f) => f.id === specKey)
    return filter ? filter.label : specKey
  }

  const inStock = product.count > 0 || product.in_stock === true

  // Настройки анимации для появления блоков
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="pp-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="pp-content-grid">
        {/* ЛЕВАЯ ЧАСТЬ: ГАЛЕРЕЯ */}
        <motion.div className="pp-visual-side" variants={itemVariants}>
          <div className="pp-main-display">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImgIndex}
                src={product.images?.[activeImgIndex]}
                alt={product.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          <div className="pp-nav-thumbs">
            {product.images?.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`pp-thumb-wrapper ${
                  activeImgIndex === idx ? 'active' : ''
                }`}
                onClick={() => setActiveImgIndex(idx)}
              >
                <img src={img} alt="thumb" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ПРАВАЯ ЧАСТЬ: ИНФОРМАЦИЯ */}
        <div className="pp-info-side">
          <motion.header className="pp-header-info" variants={itemVariants}>
            <div className="pp-meta">
              <span className="pp-category-label">{product.category}</span>
              <span className={`pp-condition-label ${product.condition}`}>
                {product.condition === 'used' ? 'Б/У ТОВАР' : 'НОВЫЙ ТОВАР'}
              </span>
              {product.condition === 'used' && product.battery_health && (
                <span className="pp-battery-info">
                  🔋 АКБ {product.battery_health}%
                </span>
              )}
              <span className={`pp-stock-status ${inStock ? 'ok' : 'none'}`}>
                {inStock ? '● В наличии' : '● Нет в наличии'}
              </span>
            </div>
            <h1 className="pp-main-name">
              {product.brand} {product.title}
            </h1>
            <div className="pp-price-tag">
              {product.price?.toLocaleString()} ₽
            </div>
          </motion.header>

          <motion.div className="pp-cta-block" variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pp-main-action-gradient"
              onClick={() => addToCart(product)}
            >
              <svg
                className="pp-cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Добавить в корзину</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              className={`pp-heart-action ${isFavorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
            >
              <svg
                viewBox="0 0 24 24"
                fill={isFavorite ? '#ff3b30' : 'none'}
                stroke={isFavorite ? '#ff3b30' : '#1d1d1f'}
                strokeWidth="1.5"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.button>
          </motion.div>

          <motion.div className="pp-details-section" variants={itemVariants}>
            <div className="pp-tab-header">Характеристики</div>
            <div className="pp-specs-grid">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div className="pp-spec-card" key={key}>
                  <span className="pp-spec-key">
                    {getFilterLabel(key, product.category)}
                  </span>
                  <span className="pp-spec-val">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {product.description && (
            <motion.div
              className="pp-description-section"
              variants={itemVariants}
            >
              <div className="pp-tab-header">Описание</div>
              <p className="pp-desc-text">{product.description}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductPage
