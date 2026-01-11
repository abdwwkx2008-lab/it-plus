import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-section">
      <div className="container about-wrapper">
        {/* Левая часть: Контент */}
        <div className="about-text-content">
          <h2 className="about-title">
            Ваш надежный партнер <br /> в мире технологий
          </h2>

          <div className="about-description">
            <p>
              <strong>
                IT <span className="about-span">+</span>
              </strong>{' '}
              — это больше, чем просто магазин. Мы создали пространство, где
              высокие технологии встречаются с безупречным сервисом. Наша
              команда объединяет экспертов в области мобильной электроники и
              сертифицированных инженеров.
            </p>
            <p>
              Мы специализируемся на реализации оригинальной продукции мировых
              брендов и осуществляем ремонт любой сложности. Каждый гаджет в
              нашем каталоге проходит многоуровневую проверку качества, прежде
              чем попасть к вам в руки.
            </p>
            <p>
              За годы работы мы заслужили доверие тысяч клиентов благодаря
              прозрачному подходу: мы не просто продаем или чиним — мы решаем
              ваши задачи быстро, честно и с официальной гарантией.
            </p>
          </div>
        </div>

        {/* Правая часть: Преимущества */}
        <div className="about-features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div className="feature-info">
              <h3>Премиальный выбор</h3>
              <p>
                Только оригинальные смартфоны и аксессуары с полной
                предпродажной проверкой.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h3>Профессиональный ремонт</h3>
              <p>
                Лабораторная точность восстановления техники с использованием
                топового оборудования.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h3>Гарантийный сервис</h3>
              <p>
                Собственные обязательства на все виды работ и товаров. Мы всегда
                на стороне клиента.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h3>Программа лояльности</h3>
              <p>
                Индивидуальные условия для постоянных гостей и поддержка 24/7
                после покупки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
