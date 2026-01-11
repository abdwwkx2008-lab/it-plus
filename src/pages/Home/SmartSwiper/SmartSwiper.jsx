import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { supabase } from '../../../supabaseClient' // Убедитесь, что путь верный
import ProductCard from '../../../components/ProductCard'

// Импорт стилей Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './SmartSwiper.css'

const SmartSwiper = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSmartphones = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')

        .ilike('category', '%smartphone%')

      if (!error) {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchSmartphones()
  }, [])

  if (loading) {
    return <div className="loader-container">Загрузка смартфонов...</div>
  }

  return (
    <div className="smart-swiper-section">
      <div className="container">
        <h2 className="smart-swiper-title">СМАРТФОНЫ</h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={'auto'} // 'auto' позволяет карточкам иметь свою ширину из CSS
          grabCursor={true}
          navigation={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            // Настройка адаптивности
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            480: { slidesPerView: 1.5, spaceBetween: 15 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 25 },
          }}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="smart-slide">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="smart-bth-block">
          <Link to="/catalog?category=smartphone" className="smart-bth">
            СМОТРЕТЬ ВСЕ МОДЕЛИ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SmartSwiper
