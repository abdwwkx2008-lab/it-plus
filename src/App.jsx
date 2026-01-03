import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import Context from './store/store'
import './App.css'

const App = () => {
  return (
    <Context>
      <RouterProvider router={router} />
    </Context>
  )
}

export default App
