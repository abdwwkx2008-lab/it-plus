import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Layout from '../components/Layout/Layout'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Admin from '../pages/Admin/Admin'
import Catalog from '../pages/Catalog/Catalog'
import Cart from '../pages/Cart/Cart'
import Favorit from '../pages/Favorit/Favorit'
import ProductPage from '../pages/ProductPage/ProductPage'
import Contacts from '../pages/Contacts/Contacts'
import About from '../pages/About/About'
import SmartSwiper from '../pages/Home/SmartSwiper/SmartSwiper'
import Profile from '../pages/Profile/Profile'

// 1. Импортируем твой компонент защиты
import PrivateRoute from '../components/PrivateRoute/PrivateRoute'
import Payment from '../pages/Payment/Payment'
import Delivery from '../pages/Delivery/Delivery'
import FAQ from '../pages/FAQ/FAQ'
import Repair from '../pages/Repair/Repair'
const router = createBrowserRouter([
  {
    element: <Layout />,
    path: '/',
    children: [
      { element: <Home />, path: '' },
      { element: <Catalog />, path: 'catalog' },
      { element: <Favorit />, path: 'favorit' },
      { element: <Cart />, path: 'cart' },
      { element: <Contacts />, path: 'contacts' },
      { element: <About />, path: 'about' },
      { element: <ProductPage />, path: 'product/:id' },
      { element: <SmartSwiper />, path: 'smartswiper' },
      { element: <Payment />, path: 'payment' },
      { element: <Delivery />, path: 'delivery' },
      { element: <FAQ />, path: 'faq' },
      { element: <Repair />, path: 'repair' },

      // 2. Оборачиваем Profile в PrivateRoute
      {
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
        path: 'profile',
      },
    ],
  },

  // Если хочешь защитить и админку, можешь обернуть её так же
  {
    element: (
      <PrivateRoute>
        <Admin />
      </PrivateRoute>
    ),
    path: 'admin',
  },

  { element: <Login />, path: 'login' },
  { element: <Register />, path: 'register' },
])

export default router
