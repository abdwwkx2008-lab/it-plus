import React from 'react'
import './Header.css'
import HeaderLogo from '../../../assets/logo-it-plus.jpg'
import SearchIcon from '../../../assets/search-icon.svg'
import CatalogLogo from '../../../assets/catalog icon.svg'
import BasketLogo from '../../../assets/basket-icon.svg'
import ProfileLogo from '../../../assets/profil-icon.svg'
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-block">
          <div className="header-logo-title-block">
            <img src={HeaderLogo} alt="" className="header-logo" />
            <h1 className="header-title">
              IT <span className="header-title-span">+</span>
            </h1>
          </div>

          <div className="header-search-wrapper">
            <img src={SearchIcon} alt="" className="header-search-icon" />
            <input type="text" placeholder="Поиск" className="header-search" />
          </div>

          <div className="header-right-block">
            <div className="header-right-block-box">
              <img
                src={CatalogLogo}
                alt=""
                className="header-right-block-img"
              />
              <h3 className="header-right-block-title">Меню</h3>
            </div>

            <div className="header-right-block-box">
              <img src={BasketLogo} alt="" className="header-right-block-img" />
              <h3 className="header-right-block-title">Корзина</h3>
            </div>

            <div className="header-right-block-box">
              <img
                src={ProfileLogo}
                alt=""
                className="header-right-block-img"
              />
              <h3 className="header-right-block-title">Профиль</h3>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header
