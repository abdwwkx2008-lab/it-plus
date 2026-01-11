import React, { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CustomContext } from '../../../store/store'
import './Header.css'

// Иконки
import HeaderLogo from '../../../assets/logo-it-plus.jpg'
import SearchIcon from '../../../assets/search-icon.svg'
import CatalogLogo from '../../../assets/catalog icon.svg'
import BasketLogo from '../../../assets/basket-icon.svg'
import ProfileLogo from '../../../assets/profil-icon.svg'
import HeartIcon from '../../../assets/heart-icon.svg'

// ==========================================================
// ВСПОМОГАТЕЛЬНЫЕ ДАННЫЕ И ХЕЛПЕРЫ ДЛЯ УМНОГО ПОИСКА
// ==========================================================

const SEARCH_DICTIONARY = {
  smartphone: [
    'смартфон',
    'телефон',
    'мобильный',
    'мобила',
    'phone',
    'smart phone',
    'iphone',
    'android',
  ],

  tablet: ['планшет', 'tablet', 'ipad', 'tab'],

  laptop: ['ноутбук', 'ноут', 'laptop', 'macbook', 'mac'],

  computer: ['компьютер', 'пк', 'системник', 'pc', 'desktop'],

  tv: ['телевизор', 'тв', 'television', 'tv', 'смарт тв', 'smart tv'],

  // =========================
  // 🏷 БРЕНДЫ
  // =========================
  apple: [
    'a',
    'ap',
    'app',
    'appl',
    'apple',
    'эп',
    'эпл',
    'ай',
    'айф',
    'айфо',
    'айфон',
    'iphone',
    'ip',
    'iph',
    'ipho',
    'iphon',
    'ipad',
    'ip',
    'ipa',
    'ipad',
    'mac',
    'macb',
    'macbo',
    'macbook',
    'мак',
    'макбук',
  ],

  samsung: [
    's',
    'sa',
    'sam',
    'sams',
    'samsu',
    'samsun',
    'samsung',
    'сам',
    'самс',
    'самсу',
    'самсунг',
    'gal',
    'gala',
    'galax',
    'galaxy',
  ],

  xiaomi: [
    'x',
    'xi',
    'xia',
    'xiao',
    'xiaom',
    'xiaomi',
    'ся',
    'сяо',
    'сяом',
    'сяоми',
    'mi',
    'red',
    'redm',
    'redmi',
    'po',
    'poc',
    'poco',
  ],

  huawei: [
    'h',
    'hu',
    'hua',
    'huaw',
    'huawe',
    'huawei',
    'ху',
    'хуа',
    'хуав',
    'хуавей',
    'hon',
    'hono',
    'honor',
    'онор',
  ],

  honor: ['hon', 'hono', 'honor', 'он', 'оно', 'онор'],

  google: [
    'g',
    'go',
    'goo',
    'goog',
    'googl',
    'google',
    'гу',
    'гуг',
    'гугл',
    'pix',
    'pixe',
    'pixel',
  ],

  sony: ['s', 'so', 'son', 'sony', 'со', 'сон', 'сони'],

  lg: ['l', 'lg', 'л', 'лж', 'лджи'],

  asus: ['a', 'as', 'asu', 'asus', 'ас', 'асу', 'асус'],

  hp: ['h', 'hp', 'эйч', 'эйчпи'],

  lenovo: ['l', 'le', 'len', 'leno', 'lenov', 'lenovo', 'ле', 'лен', 'леново'],

  dell: ['d', 'de', 'del', 'dell', 'дел', 'делл'],

  acer: ['a', 'ac', 'ace', 'acer', 'асер'],

  msi: ['m', 'ms', 'msi', 'эм', 'эмэсай'],

  intel: ['i', 'in', 'int', 'inte', 'intel', 'интел'],

  amd: ['a', 'am', 'amd', 'амд'],

  microsoft: ['m', 'mi', 'mic', 'micro', 'micros', 'microsoft', 'майкрософт'],

  realme: ['r', 're', 'rea', 'real', 'realm', 'realme', 'реалми'],

  oneplus: ['o', 'on', 'one', 'onep', 'onepl', 'oneplus', 'уанплас'],

  oppo: ['o', 'op', 'opp', 'oppo', 'оппо'],

  vivo: ['v', 'vi', 'viv', 'vivo', 'виво'],

  nokia: ['n', 'no', 'nok', 'noki', 'nokia', 'нокиа'],

  // =========================
  // ⚙️ ХАРАКТЕРИСТИКИ (specs)
  // =========================
  ram: ['озу', 'ram', 'оперативка', 'оперативная память', 'memory'],

  storage: ['память', 'storage', 'rom', 'gb', 'гб', 'терабайт', 'tb'],

  battery: ['батарея', 'аккумулятор', 'battery', 'mah', 'мач'],

  processor: [
    'процессор',
    'cpu',
    'snapdragon',
    'intel',
    'amd',
    'm1',
    'm2',
    'm3',
  ],

  screen: ['экран', 'дисплей', 'screen', 'display', 'oled', 'amoled', 'lcd'],

  refresh_rate: ['герц', 'гц', 'hz', '120hz', '144hz', '60hz'],

  camera: ['камера', 'camera', 'мп', 'mp', 'megapixel'],

  gpu: ['видеокарта', 'gpu', 'graphics', 'rtx', 'gtx'],

  os: ['android', 'ios', 'windows', 'macos', 'linux'],

  color: [
    'цвет',
    'color',
    'black',
    'white',
    'silver',
    'grey',
    'gray',
    'blue',
    'red',
    'green',
  ],

  // =========================
  // 🔎 СОСТОЯНИЕ
  // =========================
  used: ['бу', 'б/у', 'used', 'second hand'],
  new: ['новый', 'new', 'но', 'нов', 'новы', 'новый'],
}

const HistoryService = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem('search_history') || '[]')
    } catch {
      return []
    }
  },
  save: (query) => {
    if (!query || query.length < 2) return
    let history = HistoryService.get()
    history = [query, ...history.filter((i) => i !== query)].slice(0, 10)
    localStorage.setItem('search_history', JSON.stringify(history))
  },
  clear: () => localStorage.removeItem('search_history'),
}

const getSynonyms = (word) => {
  const query = word.toLowerCase().trim()
  for (const [key, values] of Object.entries(SEARCH_DICTIONARY)) {
    if (key === query || values.includes(query)) {
      return [key, ...values]
    }
  }
  return [query]
}

// ==========================================================
// ОСНОВНОЙ КОМПОНЕНТ HEADER
// ==========================================================

const Header = () => {
  const {
    user,
    cart = [],
    favorites = [],
    products = [],
  } = useContext(CustomContext)
  const navigate = useNavigate()

  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const searchRef = useRef(null)

  // Загрузка истории при монтировании
  useEffect(() => {
    setSearchHistory(HistoryService.get())
  }, [])

  // 🧠 УМНЫЙ АЛГОРИТМ ПОИСКА И РАНЖИРОВАНИЯ
  const suggestions = useMemo(() => {
    const rawQuery = searchValue.trim()

    // Если поле пустое, но фокус есть — можно показать историю (необязательно)
    if (!rawQuery || !Array.isArray(products)) return []

    const queryKeywords = rawQuery.toLowerCase().split(' ').filter(Boolean)

    return products
      .map((item) => {
        let score = 0
        const brand = (item.brand || '').toLowerCase()
        const title = (item.title || '').toLowerCase()
        const category = (item.category || '').toLowerCase()
        const description = (item.description || '').toLowerCase()
        const condition =
          item.condition === 'used' ? 'бу б/у used' : 'новый new'

        // Характеристики в строку для глубокого поиска
        const specsString = Object.values(item.specs || {})
          .join(' ')
          .toLowerCase()

        const targetData = `${brand} ${title} ${category} ${condition} ${specsString} ${description}`

        queryKeywords.forEach((keyword) => {
          const synonyms = getSynonyms(keyword)

          synonyms.forEach((syn) => {
            if (targetData.includes(syn)) {
              // Ранжирование по весам
              if (brand.includes(syn)) score += 50 // Бренд — самый важный
              if (title.includes(syn)) score += 30 // Название — важно
              if (specsString.includes(syn)) score += 20 // Характеристики (память, цвет)
              if (condition.includes(syn)) score += 15 // Состояние
              score += 5 // Просто совпадение
            }
          })
        })

        return { ...item, searchScore: score }
      })
      .filter((item) => item.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 8) // Ограничиваем выдачу 8 товарами
  }, [searchValue, products])

  // Закрытие при клике вне области
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Обработка перехода к результатам
  const handleSearch = (e) => {
    const finalQuery = searchValue.trim()
    if ((e.key === 'Enter' || e.type === 'click') && finalQuery) {
      HistoryService.save(finalQuery)
      setSearchHistory(HistoryService.get())
      navigate(`/catalog?search=${encodeURIComponent(finalQuery)}`)
      setShowSuggestions(false)
    }
  }

  const clearHistory = (e) => {
    e.stopPropagation()
    HistoryService.clear()
    setSearchHistory([])
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-wrap">
          {/* ЛОГОТИП */}
          <Link to="/" className="header-logo">
            <img src={HeaderLogo} alt="IT+" />
            <div className="logo-text">
              IT<span>+</span>
            </div>
          </Link>

          {/* ПОИСКОВИК */}
          <div className="search-wrapper" ref={searchRef}>
            <div className="search-field">
              <img src={SearchIcon} alt="" className="search-img" />
              <input
                type="text"
                placeholder="Что вы ищете? "
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  setShowSuggestions(true)
                }}
                onKeyDown={handleSearch}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchValue && (
                <button
                  className="clear-btn"
                  onClick={() => setSearchValue('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* ВЫПАДАЮЩИЕ ПОДСКАЗКИ */}
            {showSuggestions && (
              <div className="search-results-drop">
                {/* Если пользователь ничего не ввел — показываем историю */}
                {!searchValue && searchHistory.length > 0 && (
                  <div className="search-history-section">
                    <div className="history-header">
                      <span>Последние запросы</span>
                      <button onClick={clearHistory}>Очистить</button>
                    </div>
                    {searchHistory.map((query, idx) => (
                      <div
                        key={idx}
                        className="history-item"
                        onClick={() => {
                          setSearchValue(query)
                          navigate(
                            `/catalog?search=${encodeURIComponent(query)}`
                          )
                          setShowSuggestions(false)
                        }}
                      >
                        <span className="history-icon">🕒</span>
                        {query}
                      </div>
                    ))}
                  </div>
                )}

                {/* Результаты поиска */}
                {suggestions.length > 0
                  ? suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="result-item"
                        onClick={() => {
                          navigate(`/product/${item.id}`)
                          setShowSuggestions(false)
                          setSearchValue('')
                          HistoryService.save(item.title)
                        }}
                      >
                        <img src={item.image || item.images?.[0]} alt="" />
                        <div className="result-info">
                          <span className="result-title">
                            <strong>{item.brand}</strong> {item.title}
                          </span>
                          <div className="result-meta">
                            <span className="result-price">
                              {item.price?.toLocaleString()} ₽
                            </span>
                            {item.specs?.storage && (
                              <span className="result-spec-tag">
                                {item.specs.storage}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  : searchValue && (
                      <div className="no-results">
                        По вашему запросу ничего не найдено
                      </div>
                    )}
              </div>
            )}
          </div>

          {/* НАВИГАЦИЯ */}
          <div className="header-nav">
            <div className="nav-btn-group dropdown-trigger">
              <div className="nav-btn">
                <img src={CatalogLogo} alt="" />
                <span>Меню</span>
              </div>

              <div className="menu-dropdown-content">
                <div className="drop-grid">
                  <div className="drop-col">
                    <h5>Магазин</h5>
                    <Link to="/catalog">Все товары</Link>
                    <Link to="/catalog?category=smartphone">Смартфоны</Link>
                    <Link to="/catalog?category=laptop">Ноутбуки</Link>
                    <Link to="/catalog?category=tv">Телевизоры</Link>
                    <Link to="/catalog?category=tablet">Планшеты</Link>
                    <Link to="/catalog?category=computer">Компьютеры</Link>
                  </div>
                  <div className="drop-col">
                    <h5>Инфо & Сервис</h5>
                    <Link to="/about">О нас</Link>
                    <Link to="/delivery">Доставка</Link>
                    <Link to="/payment">Оплата</Link>
                    <Link to="/contacts">Контакты</Link>
                    <Link to="/repair" className="repair-link">
                      Заявка на ремонт
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/favorit" className="nav-btn">
              <div className="icon-badge-box">
                <img src={HeartIcon} alt="" />
                {favorites?.length > 0 && (
                  <span className="badge">{favorites.length}</span>
                )}
              </div>
              <span>Избранное</span>
            </Link>

            <Link to="/cart" className="nav-btn">
              <div className="icon-badge-box">
                <img src={BasketLogo} alt="" />
                {cart?.length > 0 && (
                  <span className="badge">
                    {cart.reduce((a, b) => a + (b.count || 1), 0)}
                  </span>
                )}
              </div>
              <span>Корзина</span>
            </Link>

            <Link to={user ? '/profile' : '/login'} className="nav-btn">
              <img src={ProfileLogo} alt="" />
              <span>{user ? 'Профиль' : 'Войти'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
