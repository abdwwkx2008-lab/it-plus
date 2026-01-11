import React, { useState } from 'react'
import './FAQ.css'

const faqData = [
  {
    category: 'Общие вопросы',
    items: [
      {
        question: 'Чем занимается ваш интернет-магазин?',
        answer:
          'Мы специализируемся на продаже оригинальной электроники: смартфонов, ноутбуков, аксессуаров и другой техники. Наша цель — предложить качественные товары по лучшим ценам.',
      },
      {
        question: 'Гарантирована ли безопасность моих данных?',
        answer:
          'Мы гарантируем полную безопасность ваших персональных данных. Все платежи проходят через защищенные системы. Если у вас есть вопросы, ознакомьтесь с нашей Политикой конфиденциальности.',
      },
    ],
  },
  {
    category: 'Товары',
    items: [
      {
        question: 'Вы продаете оригинальную технику?',
        answer:
          'Да, мы работаем только с официальными поставщиками и гарантируем 100% подлинность всех смартфонов, ноутбуков и аксессуаров в нашем магазине.',
      },
      {
        question: 'Почему цена может отличаться у разных моделей?',
        answer:
          'Цена на технику может различаться из-за характеристик модели, комплектации или акций от производителя. Мы всегда стараемся предложить оптимальные цены для наших клиентов.',
      },
    ],
  },
  {
    category: 'Доставка',
    items: [
      {
        question: 'Сколько идет доставка?',
        answer:
          'Доставка по городу Владивосток обычно занимает 20–40 минут. Доставка в другие регионы — от 1 до 10 рабочих дней, в зависимости от города и района.',
      },
      {
        question: 'Можно ли вернуть товар?',
        answer:
          'Да, вы можете вернуть любой товар в течение 3 дней после покупки, при условии сохранения товарного вида, упаковки и комплектации. Поврежденные или использованные устройства к возврату не принимаются.',
      },
    ],
  },
]

const Faq = () => {
  const [openIndex, setOpenIndex] = useState('0-1')

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-hero">
          <h1 className="faq-main-title">FAQ</h1>
          <p className="faq-subtitle">
            Ответы на самые часто задаваемые вопросы.
          </p>
        </div>

        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="faq-category">
            <h2 className="faq-category-title">{category.category}</h2>
            <div className="faq-items-container">
              {category.items.map((item, itemIndex) => {
                const index = `${categoryIndex}-${itemIndex}`
                const isOpen = openIndex === index
                return (
                  <div className="faq-item" key={index}>
                    <button
                      className="faq-question-button"
                      onClick={() => handleToggle(index)}
                    >
                      <span>{item.question}</span>
                      <div
                        className={`faq-arrow ${isOpen ? 'open' : ''}`}
                      ></div>
                    </button>
                    <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Faq
