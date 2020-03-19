// NPM modules
import React, { createContext, useReducer } from 'react'

// Components
import PortfolioReducer from './PortfolioReducer'

// Initial portfolio state.
const initialState = {
  isShowingAboutMe: true,
  focusedProjectID: 0,
  previouslyClickedCardID: 0
}

// Create login context
export const PortfolioContext = createContext(initialState)

// Create the provider for the context so that other components can use it.
export const PortfolioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PortfolioReducer, initialState)

  // State operations
  function setIsShowingAboutMe (bool) {
    dispatch({
      type: 'SET_IS_SHOWING_ABOUT_ME',
      payload: bool
    })
  }

  // State operations
  function setFocusedProjectID (projectID) {
    dispatch({
      type: 'SET_FOCUSED_PROJECT_ID',
      payload: projectID
    })
  }

  return (
    <PortfolioContext.Provider
      value={{
        state,
        setIsShowingAboutMe,
        setFocusedProjectID
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export default PortfolioContext
