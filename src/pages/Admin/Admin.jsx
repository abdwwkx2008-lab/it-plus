import React, { useState, useContext, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { CustomContext } from '../../store/store'
import './Admin.css'

const Admin = () => {
  const { user } = useContext(CustomContext)

  // Состояния навигации и загрузки
  const [activeTab, setActiveTab] = useState('add')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // Данные
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    brand: '',
    title: '',
    price: '',
    inStock: true,
    condition: 'new',
    battery_health: '',
    description: '',
    specs: {},
  })

  const brands = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'LG',
    'Sony',
    'ASUS',
    'HP',
    'Lenovo',
    'Google',
    'Huawei',
  ]

  const fieldsByCategory = {
    smartphone: [
      'screen',
      'refresh_rate', // Добавлено поле герцовки
      'processor',
      'ram',
      'storage',
      'battery',
      'camera_main',
      'camera_front',
      'sim_slots',
      'protection',
      'os',
      'nfc',
      'color',
    ],
    laptop: [
      'screen',
      'processor',
      'ram',
      'storage',
      'gpu',
      'display_hz',
      'keyboard_backlight',
      'ports',
      'os',
      'battery_life',
      'weight',
      'color',
    ],
    tv: [
      'screen_size',
      'resolution',
      'matrix_type',
      'refresh_rate', // Для ТВ уже было
      'hdr_support',
      'sound_power',
      'hdmi_ports',
      'smart_tv_os',
      'wi_fi_standard',
      'wall_mount',
      'color',
    ],
    computer: [
      'processor',
      'ram',
      'storage',
      'gpu',
      'motherboard',
      'psu',
      'case_type',
      'cooling',
      'wi_fi_bluetooth',
      'os',
      'warranty_years',
      'color',
    ],
    tablet: [
      'screen',
      'refresh_rate', // Добавлено для планшетов
      'processor',
      'ram',
      'storage',
      'battery',
      'stylus_support',
      'cellular_type',
      'weight',
      'camera',
      'os',
      'color',
    ],
  }

  const labelMap = {
    screen: 'Дисплей',
    processor: 'Процессор',
    ram: 'ОЗУ (ГБ)',
    storage: 'Память (ГБ)',
    battery: 'Батарея (мАч)',
    camera_main: 'Основная камера',
    camera_front: 'Фронтальная камера',
    sim_slots: 'SIM-карты',
    protection: 'Влагозащита',
    os: 'Операционная система',
    nfc: 'NFC',
    color: 'Цвет',
    gpu: 'Видеокарта',
    display_hz: 'Частота экрана (Гц)',
    keyboard_backlight: 'Подсветка',
    ports: 'Разъемы',
    battery_life: 'Автономность',
    weight: 'Вес',
    screen_size: 'Диагональ',
    resolution: 'Разрешение',
    matrix_type: 'Тип матрицы',
    refresh_rate: 'Частота обновления (Гц)', // Подпись для поля
    hdr_support: 'HDR',
    sound_power: 'Звук (Вт)',
    hdmi_ports: 'HDMI порты',
    smart_tv_os: 'Smart TV OS',
    wi_fi_standard: 'Wi-Fi стандарт',
    wall_mount: 'Крепление',
    motherboard: 'Материнская плата',
    psu: 'Блок питания',
    case_type: 'Корпус',
    cooling: 'Охлаждение',
    wi_fi_bluetooth: 'Беспроводные модули',
    warranty_years: 'Гарантия (лет)',
    stylus_support: 'Стилус',
    cellular_type: 'Тип связи (5G/Wi-Fi)',
    camera: 'Камера',
  }


  const fetchProducts = async () => {
    setFetching(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProducts(data)
    setFetching(false)
  }

  useEffect(() => {
    if (activeTab === 'manage') fetchProducts()
  }, [activeTab])

  const startEdit = (product) => {
    setEditingProduct(product)
    setCategory(product.category)
    setFormData({
      brand: product.brand,
      title: product.title,
      price: product.price,
      inStock: product.in_stock,
      condition: product.condition || 'new',
      battery_health: product.battery_health || '',
      description: product.description,
      specs: product.specs || {},
    })
    setSelectedFiles([])
    setActiveTab('add')
  }

  const handleSpecChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [name]: value },
    }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот товар со склада?')) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrls = editingProduct ? editingProduct.images : []
      if (selectedFiles.length > 0) {
        const newUrls = []
        for (const file of selectedFiles) {
          const fileName = `${Date.now()}-${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)
          if (uploadError) throw uploadError
          const {
            data: { publicUrl },
          } = supabase.storage.from('product-images').getPublicUrl(fileName)
          newUrls.push(publicUrl)
        }
        imageUrls = editingProduct ? [...imageUrls, ...newUrls] : newUrls
      }
      if (imageUrls.length === 0) throw new Error('Нужно хотя бы одно фото!')

      const productBody = {
        brand: formData.brand,
        title: formData.title,
        category,
        price: Number(formData.price),
        in_stock: formData.inStock,
        condition: formData.condition,
        battery_health:
          formData.condition === 'used' && formData.battery_health
            ? Number(formData.battery_health)
            : null,
        description: formData.description,
        specs: formData.specs,
        images: imageUrls,
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productBody)
          .eq('id', editingProduct.id)
        if (error) throw error
        alert('Обновлено!')
      } else {
        const { error } = await supabase.from('products').insert([productBody])
        if (error) throw error
        alert('Опубликовано!')
      }

      setEditingProduct(null)
      setCategory('')
      setFormData({
        brand: '',
        title: '',
        price: '',
        inStock: true,
        condition: 'new',
        battery_health: '',
        description: '',
        specs: {},
      })
      setSelectedFiles([])
      setActiveTab('manage')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (user?.email !== 'abdwwkx2008@gmail.com')
    return (
      <div className="admin-access-denied">
        <h2>🚫 Нет доступа</h2>
      </div>
    )

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">
          IT <span>+</span> Admin
        </h2>
        <nav>
          <button
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => {
              setActiveTab('add')
              setEditingProduct(null)
            }}
          >
            {editingProduct ? '📝 Редактировать' : '➕ Добавить'}
          </button>
          <button
            className={activeTab === 'manage' ? 'active' : ''}
            onClick={() => setActiveTab('manage')}
          >
            📦 Склад
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === 'add' ? (
          <form
            className="admin-content-card animate-in"
            onSubmit={handleSubmit}
          >
            <div className="form-header">
              <h1>
                {editingProduct
                  ? `Правка: ${editingProduct.title}`
                  : 'Новый товар'}
              </h1>
              {editingProduct && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingProduct(null)
                    setActiveTab('manage')
                  }}
                >
                  Отмена
                </button>
              )}
            </div>

            <section className="admin-section">
              <h3>Базовые данные</h3>
              <div className="admin-grid">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="smartphone">Смартфон</option>
                  <option value="laptop">Ноутбук</option>
                  <option value="tv">Телевизор</option>
                  <option value="computer">Компьютер</option>
                  <option value="tablet">Планшет</option>
                </select>
                <select
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                >
                  <option value="">Бренд</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Название"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Цена (₽)"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                  required
                >
                  <option value="new">🆕 Новый (New)</option>
                  <option value="used">🔄 Б/У (Used)</option>
                </select>
                {formData.condition === 'used' && (
                  <input
                    type="number"
                    placeholder="Процент АКБ (%)"
                    value={formData.battery_health}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        battery_health: e.target.value,
                      })
                    }
                  />
                )}
                <select
                  value={formData.inStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inStock: e.target.value === 'true',
                    })
                  }
                >
                  <option value="true">✅ В наличии</option>
                  <option value="false">❌ Нет в наличии</option>
                </select>
              </div>
            </section>

            {category && fieldsByCategory[category] && (
              <section className="admin-section animate-in">
                <h3>Технические характеристики</h3>
                <div className="admin-grid">
                  {fieldsByCategory[category].map((field) => (
                    <input
                      key={field}
                      name={field}
                      value={formData.specs[field] || ''}
                      placeholder={labelMap[field]}
                      onChange={handleSpecChange}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="admin-section">
              <h3>Описание и Медиа</h3>
              <textarea
                className="admin-textarea"
                value={formData.description}
                placeholder="Текст описания..."
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div className="upload-zone">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <p>Добавить новые фото</p>
              </div>
              <div className="image-preview-grid">
                {editingProduct && selectedFiles.length === 0
                  ? editingProduct.images.map((img, i) => (
                      <img key={i} src={img} className="preview-img" alt="" />
                    ))
                  : selectedFiles.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        className="preview-img"
                        alt=""
                      />
                    ))}
              </div>
            </section>

            <button type="submit" className="save-button" disabled={loading}>
              {loading
                ? 'Загрузка...'
                : editingProduct
                ? 'Сохранить изменения'
                : 'Опубликовать'}
            </button>
          </form>
        ) : (
          <div className="admin-content-card animate-in">
            <div className="manage-header">
              <h1>Склад ({products.length})</h1>
              <button onClick={fetchProducts} className="refresh-btn">
                🔄
              </button>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="td-product">
                        <img src={p.images?.[0]} alt="" />
                        <div>
                          <strong>{p.brand}</strong> {p.title}
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>{p.price?.toLocaleString()} ₽</td>
                      <td>
                        <span
                          className={p.in_stock ? 'status-ok' : 'status-err'}
                        >
                          {p.in_stock ? 'OK' : 'Empty'}
                        </span>
                      </td>
                      <td className="td-actions">
                        <button onClick={() => startEdit(p)}>✏️</button>
                        <button onClick={() => handleDelete(p.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Admin
