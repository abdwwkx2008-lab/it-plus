import React from 'react'
import { motion } from 'framer-motion' // Импорт
import Swiper from '../Home/Swiper/Swiper'
import HomeCatalog from './HomeCatalog/HomeCatalog'
import Contacts from '../Contacts/Contacts'
import About from '../About/About'
import SmartSwiper from './SmartSwiper/SmartSwiper'
import Payment from '../Payment/Payment'
import Delivery from '../Delivery/Delivery'
import FAQ from '../FAQ/FAQ'
import Repair from '../Repair/Repair'
const Home = () => {
  const sectionAnim = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6 },
  }

  return (
    <>
      <Swiper />
      <motion.div {...sectionAnim}>
        <HomeCatalog />
      </motion.div>
      <motion.div {...sectionAnim}>
        <SmartSwiper />
      </motion.div>
      <motion.div {...sectionAnim}>
        <About />
      </motion.div>
      <motion.div {...sectionAnim}>
        <Contacts />
      </motion.div>
      <motion.div {...sectionAnim}>
        <Repair />
      </motion.div>
      <motion.div {...sectionAnim}>
        <Payment />
      </motion.div>
      <motion.div {...sectionAnim}>
        <Delivery />
      </motion.div>
      <motion.div {...sectionAnim}>
        <FAQ />
      </motion.div>
    </>
  )
}
export default Home
