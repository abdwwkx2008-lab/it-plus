import React, { useState } from 'react'
import './Repair.css'

const Repair = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: '',
    problem: '',
  })

  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const sendToTelegram = async (e) => {
    e.preventDefault()
    const { name, phone, device, problem } = formData
    if (!name || !phone || !device || !problem) return

    const BOT_TOKEN = '8453282894:AAGNBL6RZrKVkdJCCU0RwStBwdrifFDDlnM'
    const CHAT_ID = '1722434856'

    const text = `
🛠️ Заявка на ремонт
👤 Имя: ${name}
📞 Телефон: ${phone}
📱 Устройство: ${device}
📝 Проблема: ${problem}
    `

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      })
      setFormData({ name: '', phone: '', device: '', problem: '' })
      setSuccess(true)
    } catch (error) {
      alert('Ошибка при отправке')
    }
  }

  return (
    <section className="repair-section">
      {/* Твой глобальный контейнер из index.css */}
      <div className="container">
        <div className="repair-grid">
          {/* ЛЕВАЯ ЧАСТЬ: ИНСТРУКЦИЯ */}
          <div className="repair-info">
            <h1>Как оставить заявку</h1>
            <p className="subtitle">
              Это займет не больше минуты. Следуйте простым шагам:
            </p>

            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h3>Заполните данные</h3>
                  <p>Введите ваше имя и номер телефона для связи.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h3>Укажите устройство</h3>
                  <p>
                    Напишите модель (например, iPhone 14 Pro или MacBook Air).
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h3>Опишите проблему</h3>
                  <p>Кратко расскажите, что именно не работает.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-text">
                  <h3>Подтвердите отправку</h3>
                  <p>
                    Нажмите кнопку «Отправить». Мы перезвоним вам в течение 15
                    минут!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: КАРТОЧКА С ФОРМОЙ */}
          <div className="repair-card">
            <h2>Заявка на ремонт</h2>
            <p>Оставьте заявку и мы свяжемся с вами</p>

            <form onSubmit={sendToTelegram}>
              <input
                name="name"
                placeholder="Ваше имя"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <input
                name="phone"
                placeholder="Номер телефона"
                required
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                name="device"
                placeholder="Устройство (iPhone, ноутбук...)"
                required
                value={formData.device}
                onChange={handleChange}
              />
              <textarea
                name="problem"
                placeholder="Опишите проблему"
                required
                value={formData.problem}
                onChange={handleChange}
              />
              <button type="submit">Отправить заявку</button>
            </form>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО */}
      {success && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Ваша заявка отправлена ✅</h3>
            <p>Мы свяжемся с вами в течение 15 минут</p>
            <button onClick={() => setSuccess(false)}>Понятно</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Repair
