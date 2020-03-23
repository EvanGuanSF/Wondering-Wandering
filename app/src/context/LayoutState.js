// NPM modules
import React, { createContext, useReducer } from 'react'

// Components
import LayoutReducer from './LayoutReducer'

// Initial Layout state.
const initialState = {
  navbarHeight: 0,
  footerHeight: 0,
  usableHeight: 0,
  usableWidth: 0
}

// Create login context
export const LayoutContext = createContext(initialState)

// Create the provider for the context so that other components can use it.
export const LayoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LayoutReducer, initialState)

  function updateUsableDimensions () {
    dispatch({
      type: 'UPDATE_USABLE_DIMENSIONS'
    })
  }

  return (
    <LayoutContext.Provider
      value={{
        state,
        updateUsableDimensions
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutContext
