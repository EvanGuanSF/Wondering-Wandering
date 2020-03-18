export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_ABOUT_ME': {
      console.log('Updating isShowingAboutMe...')

      // console.log(newState)
      return state
    }
    default: {
      return state
    }
  }
}
