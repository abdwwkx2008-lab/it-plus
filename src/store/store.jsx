import React, { createContext } from 'react'

export const CustomContext = createContext()

const Context = ({ children }) => {
  const value = {}

  return (
    <CustomContext.Provider value={value}>{children}</CustomContext.Provider>
  )
}

export default Context
