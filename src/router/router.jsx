import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Layout from '../components/Layout/Layout'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
const router = createBrowserRouter([
  {
    element: <Layout />,
    path: '/',
    children: [{ element: <Home />, path: '' }],
  },
  { element: <Login />, path: 'login' },
  { element: <Register />, path: 'register' },
])

export default router
