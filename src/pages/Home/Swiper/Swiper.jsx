import React from 'react'
import './Swiper.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import SwiperIMG1 from '../../../assets/smart-swiper.png'
import SwiperIMG2 from '../../../assets/remont-banner.png'
import SwiperIMG3 from '../../../assets/nout-banner.png'

function MySwiper() {
  const slideImages = [SwiperIMG1, SwiperIMG2, SwiperIMG3]

  return (
    <section className="swiper-section">
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="swiper-container"
        >
          {slideImages.map(function (imageSrc, index) {
            return (
              <SwiperSlide key={index}>
                <div className="slide-content">
                  <img
                    src={imageSrc}
                    alt={`Slide ${index + 1}`}
                    className="slide-img"
                  />
                  <div className="text-overlay">
                    <Link className="swiper-link" to="/catalog">
                      ПЕРЕЙТИ В КАТАЛОГ
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}

export default MySwiper
