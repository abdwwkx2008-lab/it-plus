export const filtersConfig = {
  // Общие фильтры (есть у всех)
  common: [
    { id: 'brand', label: 'Бренд' },
    { id: 'condition', label: 'Состояние', options: ['new', 'used'], labels: { new: 'Новый', used: 'Б/У' } },
    { id: 'in_stock', label: 'Наличие', options: [true, false], labels: { true: 'В наличии', false: 'Под заказ' } }
  ],
  
  // Динамические фильтры по категориям
  smartphone: [
    { id: 'storage', label: 'Встроенная память', isSpec: true, options: ['64 ГБ', '128 ГБ', '256 ГБ', '512 ГБ', '1 ТБ'] },
    { id: 'ram', label: 'Оперативная память', isSpec: true, options: ['4 ГБ', '6 ГБ', '8 ГБ', '12 ГБ'] }
  ],
  laptop: [
    { id: 'processor', label: 'Процессор', isSpec: true, options: ['M1', 'M2', 'M3', 'Intel i5', 'Intel i7', 'Ryzen 7'] },
    { id: 'ram', label: 'Оперативная память', isSpec: true, options: ['8 ГБ', '16 ГБ', '32 ГБ', '64 ГБ'] }
  ],
  tablet: [
    { id: 'storage', label: 'Память', isSpec: true, options: ['64 ГБ', '128 ГБ', '256 ГБ', '512 ГБ'] },
    { id: 'screen_size', label: 'Диагональ', isSpec: true, options: ['8"', '10.2"', '11"', '12.9"'] }
  ],
  tv: [
    { id: 'matrix', label: 'Тип матрицы', isSpec: true, options: ['LED', 'OLED', 'QLED'] },
    { id: 'screen_size', label: 'Диагональ', isSpec: true, options: ['43"', '55"', '65"', '75"'] }
  ],
  computer: [
    { id: 'gpu', label: 'Видеокарта', isSpec: true, options: ['RTX 3060', 'RTX 4060', 'RTX 4070', 'RTX 4080'] },
    { id: 'ram', label: 'Оперативная память', isSpec: true, options: ['16 ГБ', '32 ГБ', '64 ГБ'] }
  ]
};