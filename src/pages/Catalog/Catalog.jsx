import React, { useContext, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CustomContext } from '../../store/store'
import { filtersConfig } from './filtersConfig'
import ProductCard from '../../components/ProductCard'
import './Catalog.css'

const CATEGORY_LABELS = {
  smartphone: 'смартфонов',
  laptop: 'ноутбуков',
  computer: 'компьютеров',
  tv: 'телевизоров',
  tablet: 'планшетов',
}

const Catalog = () => {
  const { products, productsLoading } = useContext(CustomContext)

  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'smartphone'

  const [activeFilters, setActiveFilters] = useState({})
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const currentCategoryFilters = useMemo(
    () => [...filtersConfig.common, ...(filtersConfig[category] || [])],
    [category]
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // ИСПРАВЛЕНИЕ: приводим всё к нижнему регистру перед сравнением
      const productCat = product.category ? product.category.toLowerCase() : ''
      const currentCat = category ? category.toLowerCase() : ''

      if (productCat !== currentCat) return false

      const price = product.price || 0
      if (priceRange.min && price < Number(priceRange.min)) return false
      if (priceRange.max && price > Number(priceRange.max)) return false

      for (const filterId in activeFilters) {
        const selectedValues = activeFilters[filterId]
        if (selectedValues && selectedValues.length > 0) {
          const filterDef = currentCategoryFilters.find(
            (f) => f.id === filterId
          )

          const productValue = filterDef?.isSpec
            ? product.specs?.[filterId]
            : product[filterId]

          if (!selectedValues.includes(String(productValue))) return false
        }
      }

      return true
    })
  }, [
    products,
    category,
    priceRange.min,
    priceRange.max,
    activeFilters,
    currentCategoryFilters,
  ])

  const hasCategoryProducts = products.some(
    (p) => p.category?.toLowerCase() === category?.toLowerCase()
  )

  const toggleFilter = (filterId, value) => {
    setActiveFilters((prev) => {
      const current = prev[filterId] || []
      const next = current.includes(String(value))
        ? current.filter((v) => v !== String(value))
        : [...current, String(value)]
      return { ...prev, [filterId]: next }
    })
  }

  return (
    <div className="catalog-wrapper">
      <div className="container catalog-flex">
        <aside className="apple-sidebar">
          <div className="filters-card">
            <h3 className="sidebar-title">Фильтры</h3>

            <div className="filter-group">
              <label className="filter-label-main">Цена, ₽</label>
              <div className="price-range-inputs">
                <input
                  type="number"
                  placeholder="от"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                />
                <div className="price-divider"></div>
                <input
                  type="number"
                  placeholder="до"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                />
              </div>
            </div>

            {currentCategoryFilters.map((filter) => (
              <div key={filter.id} className="filter-group">
                <label className="filter-label-main">{filter.label}</label>
                <div className="checkbox-list">
                  {(
                    filter.options || [
                      ...new Set(
                        products
                          .filter(
                            (p) =>
                              p.category?.toLowerCase() ===
                              category?.toLowerCase()
                          )
                          .map((p) =>
                            filter.isSpec ? p.specs?.[filter.id] : p[filter.id]
                          )
                      ),
                    ]
                  )
                    .filter(Boolean)
                    .map((opt) => (
                      <label key={String(opt)} className="ios-checkbox-item">
                        <input
                          type="checkbox"
                          checked={
                            activeFilters[filter.id]?.includes(String(opt)) ||
                            false
                          }
                          onChange={() => toggleFilter(filter.id, opt)}
                        />
                        <span className="ios-check-box"></span>
                        <span className="ios-check-text">
                          {filter.labels ? filter.labels[opt] : opt}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="catalog-content">
          <div className="product-grid">
            {productsLoading ? (
              <div
                className="loader"
                style={{ textAlign: 'center', width: '100%', padding: '50px' }}
              >
                <div className="spinner"></div>
                <p>Загрузка товаров...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : !hasCategoryProducts ? (
              <div
                className="no-products"
                style={{ textAlign: 'center', width: '100%' }}
              >
                <h3>
                  У нас пока что нет {CATEGORY_LABELS[category] || 'товаров'}
                </h3>
                <p>Мы уже работаем над пополнением каталога 🙂</p>
              </div>
            ) : (
              <div
                className="no-products"
                style={{ textAlign: 'center', width: '100%' }}
              >
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить параметры фильтров</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Catalog
