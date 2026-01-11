import React from 'react'
import Header from './Header/Header'
import { Outlet, useLocation } from 'react-router' // Добавь useLocation
import Footer from './Footer/Footer'
import { motion, AnimatePresence } from 'framer-motion' // Импорт анимаций

const Layout = () => {
  const location = useLocation()

  return (
    <>
      <Header />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  )
}

export default Layout
