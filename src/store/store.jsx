import React, { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'

export const CustomContext = createContext()

export const Context = ({ children }) => {
  // 1. УЛУЧШЕННЫЙ LOCAL STORAGE (Lazy Initialization - данные подгружаются мгновенно)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  // Кэшируем юзера, чтобы профиль не "прыгал" при перезагрузке страницы
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cached_user')
    return saved ? JSON.parse(saved) : null
  })

  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  // =========================
  // АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ В ПАМЯТЬ (При любом изменении)
  // =========================
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (user) {
      localStorage.setItem('cached_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('cached_user')
    }
  }, [user])

  // =========================
  // ЗАГРУЗКА ПОЛНОГО ПРОФИЛЯ (С приоритетом таблицы profiles)
  // =========================
  const fetchFullUser = useCallback(async (authUser) => {
    if (!authUser) return null
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (error) throw error

      return {
        ...authUser,
        ...profile,
        full_name: profile?.full_name || authUser.user_metadata?.full_name,
        phone: profile?.phone || authUser.user_metadata?.phone,
      }
    } catch (e) {
      console.error('Profile fetch error:', e.message)
      return authUser
    }
  }, [])

  // =========================
  // АВТОРИЗАЦИЯ И СЛУШАТЕЛЬ СОСТОЯНИЯ
  // =========================
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      setAuthLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user && isMounted) {
        const fullUser = await fetchFullUser(session.user)
        if (isMounted) setUser(fullUser)
      }
      if (isMounted) setAuthLoading(false)
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && isMounted) {
        const fullUser = await fetchFullUser(session.user)
        if (isMounted) setUser(fullUser)
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null)
          setCart([])
          setFavorites([])
          localStorage.removeItem('cached_user')
          localStorage.removeItem('cart')
          localStorage.removeItem('favorites')
        }
      }
      if (isMounted) setAuthLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchFullUser])

  // =========================
  // ЗАГРУЗКА ТОВАРОВ ИЗ БАЗЫ
  // =========================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('❌ Ошибка базы:', err.message)
      } finally {
        setProductsLoading(false)
      }
    }
    loadProducts()
  }, [])

  // =========================
  // РЕГИСТРАЦИЯ И ВХОД
  // =========================
  const register = async ({ email, password, fullName, phone }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone },
        },
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setCart([])
      setFavorites([])
      toast.info('Вы вышли из аккаунта')
    } catch (error) {
      console.error('Logout error:', error.message)
    }
  }

  // =========================
  // ЛОГИКА КОРЗИНЫ
  // =========================
  const addToCart = (product) => {
    if (!user) {
      return toast.warning('Войдите в аккаунт, чтобы добавить товар в корзину')
    }
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        toast.info(`Количество ${product.title} увеличено`)
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      toast.success(`${product.title} добавлен в корзину`)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const minusOne = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const removeFromCart = (id) => {
    const product = cart.find((item) => item.id === id)
    setCart((prev) => prev.filter((item) => item.id !== id))
    toast.error(`${product?.title || 'Товар'} удален из корзины`)
  }

  const clearCart = () => setCart([])

  const totalPrice = cart.reduce(
    (acc, rec) => acc + rec.price * rec.quantity,
    0
  )

  // =========================
  // ИЗБРАННОЕ
  // =========================
  const toggleFavorite = (p) => {
    if (!user) {
      return toast.warning('Войдите в аккаунт, чтобы сохранять избранное')
    }
    const isFav = favorites.some((f) => f.id === p.id)
    if (isFav) {
      setFavorites((prev) => prev.filter((f) => f.id !== p.id))
      toast.info('Удалено из избранного')
    } else {
      setFavorites((prev) => [...prev, p])
      toast.success('Добавлено в избранное')
    }
  }

  // =========================
  // ОФОРМЛЕНИЕ ЗАКАЗА (СОХРАНЕНО ВСЁ ПОЛНОСТЬЮ)
  // =========================
  const sendOrder = async (info) => {
    if (!user) {
      toast.error(
        'Ошибка: только авторизованные пользователи могут делать заказы'
      )
      return false
    }

    let orderId = 'Ошибка'
    const BOT_TOKEN = '8453282894:AAGNBL6RZrKVkdJCCU0RwStBwdrifFDDlnM'
    const CHAT_ID = '1722434856'

    try {
      // 1. Сохранение в БД (Supabase)
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_price: totalPrice,
            status: 'pending',
            customer_name: info.name,
            customer_phone: info.phone,
            customer_email: info.email || user.email || '',
          },
        ])
        .select()

      if (orderError) throw orderError

      if (data && data.length > 0) {
        orderId = data[0].id
        const items = cart.map((item) => ({
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
        }))
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(items)
        if (itemsError) throw itemsError
      }

      // 2. Подготовка Media Group для Telegram (Картинки)
      const media = cart
        .map((item) => ({
          type: 'photo',
          media: item.images?.[0] || 'https://via.placeholder.com/300',
          caption:
            item.id === cart[0].id
              ? `📸 Фото товаров к заказу #${orderId.slice(0, 8)}`
              : '',
        }))
        .slice(0, 10)

      if (media.length > 0) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, media }),
        })
      }

      // 3. Подготовка детального текста сообщения
      let orderList = cart
        .map(
          (item, index) =>
            `${index + 1}. <b>${item.brand} ${item.title}</b>\n` +
            `- Цена: ${item.price}₽\n` +
            `- Кол-во: ${item.quantity} шт.\n` +
            `- Память: ${item.specs?.storage || '—'}\n` +
            `- Цвет: ${item.specs?.color || '—'}\n` +
            `- Состояние: ${item.condition === 'used' ? 'Б/У' : 'Новый'}\n` +
            `${item.battery_health ? `- АКБ: ${item.battery_health}%` : ''}`
        )
        .join('\n\n')

      const text =
        `📦 <b>НОВЫЙ ЗАКАЗ #${orderId.slice(0, 8)}</b>\n\n` +
        `👤 <b>Клиент:</b> ${info.name}\n` +
        `📞 <b>Телефон:</b> <code>${info.phone}</code>\n` +
        `📧 <b>Email:</b> ${info.email || user.email || 'не указан'}\n\n` +
        `🛒 <b>Состав заказа:</b>\n${orderList}\n\n` +
        `💰 <b>ИТОГО: ${totalPrice.toLocaleString()}₽</b>`

      const resText = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: 'HTML',
          }),
        }
      )

      if (resText.ok) {
        toast.success('Заказ успешно оформлен!')
        clearCart()
        return true
      }
    } catch (e) {
      console.error('Order Error:', e)
      toast.error('Ошибка при оформлении заказа')
      return false
    }
  }

  const value = {
    user,
    setUser,
    register,
    login,
    logout,
    products,
    productsLoading,
    authLoading,
    cart,
    addToCart,
    minusOne,
    removeFromCart,
    clearCart,
    totalPrice,
    favorites,
    toggleFavorite,
    sendOrder,
  }

  return (
    <CustomContext.Provider value={value}>{children}</CustomContext.Provider>
  )
}

export default Context
