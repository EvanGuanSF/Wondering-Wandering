// NPM modules
import React, { createContext, useReducer } from 'react'

// Components
import PortfolioReducer from './PortfolioReducer'

// Initial portfolio state.
const initialState = {
  isShowingAboutMe: true
}

// Create login context
export const PortfolioContext = createContext(initialState)

// Create the provider for the context so that other components can use it.
export const LoginProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PortfolioReducer, initialState)

  // State operations
  function updateIsShowingAboutMe (bool) {
    console.log('updateLoginInfo called.')
    dispatch({
      type: 'UPDATE_ABOUT_ME',
      payload: bool
    })
  }

  return (
    <PortfolioContext.Provider
      value={{
        state,
        updateIsShowingAboutMe
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export default PortfolioContext
