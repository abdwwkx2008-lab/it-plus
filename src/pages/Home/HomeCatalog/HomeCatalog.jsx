import React from 'react'
import './HomeCatalog.css'
import HomeCatalogIMG1 from '../../../assets/Frame 272.png'
import HomeCatalogIMG2 from '../../../assets/Group 48.svg'
import HomeCatalogIMG3 from '../../../assets/komp.png'
import HomeCatalogIMG4 from '../../../assets/telek.png'
import HomeCatalogIMG5 from '../../../assets/plan.png'

const HomeCatalog = () => {
  return (
    <div className="container">
      <h2 className="home-catalog-title">Каталог</h2>
      <div className="home-catalog-block">
        <div className="home-catalog-box">
          <img src={HomeCatalogIMG1} alt="" className="home-catalog-img" />
        </div>
        <div className="home-catalog-box">
          <img src={HomeCatalogIMG2} alt="" className="home-catalog-img" />
        </div>
        <div className="home-catalog-box">
          <img src={HomeCatalogIMG3} alt="" className="home-catalog-img" />
        </div>
        <div className="home-catalog-box">
          <img src={HomeCatalogIMG4} alt="" className="home-catalog-img" />
        </div>
        <div className="home-catalog-box">
          <img src={HomeCatalogIMG5} alt="" className="home-catalog-img" />
        </div>
      </div>
    </div>
  )
}
export default HomeCatalog
