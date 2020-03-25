// NPM modules
import React, { createContext, useReducer } from 'react'

// Components
import LoginReducer from './LoginReducer'

// Initial login state.
const initialState = {
  userName: '',
  isClientLoggedIn: false
}

// Create login context
export const LoginContext = createContext(initialState)

// Create the provider for the context so that other components can use it.
export const LoginProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LoginReducer, initialState)

  // State operations
  function updateLoginInfo () {
    dispatch({
      type: 'UPDATE_FROM_COOKIE'
    })
  }

  return (
    <LoginContext.Provider
      value={{
        state,
        updateLoginInfo
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext
