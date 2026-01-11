import React, { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-toastify'

export const CustomContext = createContext()

// 2. Основной компонент
export const Context = ({ children }) => {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])

  const fetchProducts = async () => {
    console.log('🚀 ЗАПРОС В SUPABASE')

    const { data, error } = await supabase.from('products').select('*')

    console.log('📦 DATA:', data)
    console.log('❌ ERROR:', error)

    if (!error) {
      setProducts(data || [])
    }
  }

  // =========================
  // ЗАГРУЗКА ПРОФИЛЯ
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
      return profile ? { ...authUser, ...profile } : authUser
    } catch (e) {
      console.error('Profile error:', e.message)
      return authUser
    }
  }, [])

  // =========================
  // 1️⃣ ЗАГРУЗКА ТОВАРОВ (НЕ ЗАВИСИТ ОТ AUTH)
  // =========================
  useEffect(() => {
    console.log('🚀 ЗАГРУЗКА ТОВАРОВ ЗАПУЩЕНА!') // Это МЫ ДОЛЖНЫ УВИДЕТЬ В КОНСОЛИ

    const loadProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')

        if (error) {
          console.error('❌ Ошибка базы:', error.message)
        } else {
          console.log('✅ Товаров получено:', data?.length)
          setProducts(data || [])
        }
      } catch (err) {
        console.error('❌ Сбой JS:', err)
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
  }, [])
  // =========================
  // 2️⃣ АВТОРИЗАЦИЯ (ОТДЕЛЬНО)
  // =========================
  useEffect(() => {
    const loadAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const fullUser = await fetchFullUser(data.session.user)
        setUser(fullUser)
      }

      setAuthLoading(false) // ✅ ИСПРАВЛЕНО
    }

    loadAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const fullUser = await fetchFullUser(session.user)
        setUser(fullUser)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchFullUser])

  // =========================
  // LOCAL STORAGE
  // =========================
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedFavs = localStorage.getItem('favorites')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavs) setFavorites(JSON.parse(savedFavs))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // =========================
  // CART
  // =========================
  const addToCart = (product) => {
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
  // FAVORITES
  // =========================
  const toggleFavorite = (p) => {
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
  // ОТПРАВКА ЗАКАЗА (БЕЗ ИЗМЕНЕНИЙ)
  // =========================
  const sendOrder = async (info) => {
    let orderId = 'Гость'
    const BOT_TOKEN = '8453282894:AAGNBL6RZrKVkdJCCU0RwStBwdrifFDDlnM'
    const CHAT_ID = '1722434856'

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user?.id || null,
            total_price: totalPrice,
            status: 'pending',
            customer_name: info.name,
            customer_phone: info.phone,
            customer_email: info.email || '',
          },
        ])
        .select()

      if (!error && data.length > 0) {
        orderId = data[0].id
        const items = cart.map((item) => ({
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
        await supabase.from('order_items').insert(items)
      }
    } catch (e) {
      console.error('DB Error:', e)
    }

    const media = cart
      .map((item) => ({
        type: 'photo',
        media: item.images?.[0] || 'https://via.placeholder.com/300',
        caption:
          item.id === cart[0].id ? `📸 Фото товаров к заказу #${orderId}` : '',
      }))
      .slice(0, 10)

    try {
      if (media.length > 0) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, media }),
        })
      }

      let orderList = cart
        .map(
          (item, index) => `${index + 1}. <b>${item.brand} ${item.title}</b>
- Цена: ${item.price}₽
- Кол-во: ${item.quantity} шт.
- Память: ${item.specs?.storage || '—'}
- Цвет: ${item.specs?.color || '—'}
- Состояние: ${item.condition === 'used' ? 'Б/У' : 'Новый'}
${item.battery_health ? `- АКБ: ${item.battery_health}%` : ''}`
        )
        .join('\n\n')

      const text = `📦 <b>НОВЫЙ ЗАКАЗ #${orderId}</b>

👤 <b>Клиент:</b> ${info.name}
📞 <b>Телефон:</b> <code>${info.phone}</code>
📧 <b>Email:</b> ${info.email || 'не указан'}

🛒 <b>Состав заказа:</b>
${orderList}

💰 <b>ИТОГО: ${totalPrice.toLocaleString()}₽</b>`

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
      console.error('TG Error:', e)
      toast.error('Ошибка отправки в Telegram')
      return false
    }
  }

  // =========================
  // PROVIDER
  // =========================
  const value = {
    user,
    setUser,

    products,
    productsLoading, // ✅ ИСПРАВЛЕНО
    authLoading, // ✅ ИСПРАВЛЕНО

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
