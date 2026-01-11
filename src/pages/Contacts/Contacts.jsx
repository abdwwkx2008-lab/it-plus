import React, { useState } from 'react'
import './Contacts.css'
import qrCode from '../../assets/qr-tg.jpg'

const Contacts = () => {
  const [isQrVisible, setIsQrVisible] = useState(false)

  const toggleQrModal = () => {
    setIsQrVisible(!isQrVisible)
  }

  return (
    <div className="container">
      <header className="contacts-header">
        <h2 className="contacts-title">Контакты</h2>
        <p>Свяжитесь с нами любым удобным способом</p>
      </header>

      <div className="contacts-grid">
        {/* Левая колонка: Карточки с инфо */}
        <div className="contacts-info">
          <div className="contact-card">
            <div className="card-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3>Телефон</h3>
              <a href="tel:+79510030332" className="contact-link">
                +7 951 003 03 32
              </a>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="card-content">
              <h3>Адрес</h3>
              <p>г.Владивосток Ул.Луговая 21А пешеходный переход 340 бутик</p>
            </div>
          </div>

          <div className="social-section">
            <h3>Социальные сети</h3>
            <div className="social-buttons">
              <a
                href="https://www.instagram.com/it_plus125?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
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

              <button onClick={toggleQrModal} className="social-btn telegram">
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
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Telegram
              </button>
            </div>
          </div>
        </div>

        {/* Правая колонка: Карта */}
        <div className="contacts-map">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46535.15413364969!2d131.86176516333682!3d43.115535567781075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb39cba52474155%3A0x62957f8644f51174!2z0JLQu9Cw0LTQuNCy0L7RgdGC0L7Quiwg0J_RgNC40LzQvtGA0YHQutC40Lkg0LrRgNCw0Lk!5e0!3m2!1sru!2sru!4v1709564000000!5m2!1sru!2sru"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Модальное окно QR-кода */}
      {isQrVisible && (
        <div className="modal-overlay" onClick={toggleQrModal}>
          <div
            className="modal-content animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={toggleQrModal}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3>Напишите нам в Telegram</h3>
            <div className="qr-wrapper">
              <img src={qrCode} alt="Telegram QR Code" />
            </div>
            <p>Отсканируйте код камерой телефона</p>
            <a
              href="https://t.me/ITREPEIR"
              target="_blank"
              rel="noopener noreferrer"
              className="direct-link"
            >
              Открыть напрямую
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts
