import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import FooterLogo from '../../../assets/logo-it-plus.jpg'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-content">
        {/* БЛОК 1: ЛОГО И ОПИСАНИЕ */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={FooterLogo} alt="IT+" />
            <span>
              IT<span>+</span>
            </span>
          </Link>
          <p className="footer-slogan">
            Ваш надежный партнер в мире технологий. <br />
            Продажа и профессиональный ремонт.
          </p>
        </div>

        {/* БЛОК 2: КАТАЛОГ */}
        <div className="footer-links">
          <h5>Каталог</h5>
          <Link to="/catalog?category=smartphone">Смартфоны</Link>
          <Link to="/catalog?category=laptop">Ноутбуки</Link>
          <Link to="/catalog?category=tablet">Планшеты</Link>
          <Link to="/catalog?category=tv">Телевизоры</Link>
          <Link to="/catalog?category=computer">Компьютеры</Link>
        </div>

        {/* БЛОК 3: ИНФО */}
        <div className="footer-links">
          <h5>Информация</h5>
          <Link to="/about">О нас</Link>
          <Link to="/delivery">Доставка</Link>
          <Link to="/payment">Оплата</Link>
          <Link to="/contacts">Контакты</Link>
          <Link to="/contacts">Заявка на ремонт</Link>
        </div>

        {/* БЛОК 4: КОНТАКТЫ */}
        <div className="footer-contacts">
          <h5>Связаться с нами</h5>
          <a href="tel:+79510030332" className="footer-phone">
            +7 951 003 03 32
          </a>
          <p className="footer-addr">
            г.Владивосток Ул.Луговая 21А пешеходный переход 340 бутик
          </p>
          <div className="footer-socials">
            <a
              href="https://t.me/ITREPEIR"
              target="_blank"
              rel="noreferrer"
              className="social-btn telegram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              Telegram
            </a>

            <a
              href="https://www.instagram.com/it_plus125"
              target="_blank"
              rel="noreferrer"
              className="social-btn instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
