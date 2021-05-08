 const PortfolioReducer = (state, action) => {
  switch (action.type) {
    case 'SET_IS_SHOWING_ABOUT_ME': {
      return {
        ...state,
        isShowingAboutMe: action.payload
      }
    }
    case 'SET_FOCUSED_PROJECT_ID': {
      var prevID = state.focusedProjectID
      return {
        ...state,
        previouslyClickedCardID: prevID,
        focusedProjectID: action.payload
      }
    }
    default: {
      return state
    }
  }
}

export default PortfolioReducer