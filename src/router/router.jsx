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
import PrivateRoute from '../components/PrivateRoute/PrivateRoute'
import Payment from '../pages/Payment/Payment'
import Delivery from '../pages/Delivery/Delivery'
import FAQ from '../pages/FAQ/FAQ'
import Repair from '../pages/Repair/Repair'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'favorit', element: <Favorit /> },
      { path: 'cart', element: <Cart /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'about', element: <About /> },
      { path: 'product/:id', element: <ProductPage /> },
      { path: 'smartswiper', element: <SmartSwiper /> },
      { path: 'payment', element: <Payment /> },
      { path: 'delivery', element: <Delivery /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'repair', element: <Repair /> },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <Admin />
      </PrivateRoute>
    ),
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
])

export default router
