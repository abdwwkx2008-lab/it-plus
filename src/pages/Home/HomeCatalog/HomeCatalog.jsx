import React from 'react'
import { Link } from 'react-router-dom' // Импортируем Link
import './HomeCatalog.css'
import HomeCatalogIMG1 from '../../../assets/Frame 272 (1).png'
import HomeCatalogIMG2 from '../../../assets/Group 48.svg'
import HomeCatalogIMG3 from '../../../assets/komp.png'
import HomeCatalogIMG4 from '../../../assets/telek.png'
import HomeCatalogIMG5 from '../../../assets/plan.png'

const HomeCatalog = () => {
  // Массив категорий для удобства (должны совпадать с value в Admin.jsx)
  const categories = [
    { name: 'Смартфоны', slug: 'smartphone', img: HomeCatalogIMG1 },
    { name: 'Ноутбуки', slug: 'laptop', img: HomeCatalogIMG2 },
    { name: 'Компьютеры', slug: 'computer', img: HomeCatalogIMG3 },
    { name: 'Телевизоры', slug: 'tv', img: HomeCatalogIMG4 },
    { name: 'Планшеты', slug: 'tablet', img: HomeCatalogIMG5 },
  ]

  return (
    <div className="container">
      <h2 className="home-catalog-title">Каталог</h2>
      <div className="home-catalog-block">
        {categories.map((item) => (
          <Link
            to={`/catalog?category=${item.slug}`}
            key={item.slug}
            className="home-catalog-box"
          >
            <img src={item.img} alt={item.name} className="home-catalog-img" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomeCatalog
