// NPM modules
import Cookies from 'universal-cookie'

export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_FROM_COOKIE': {
      const cookies = new Cookies()
      var userNameFromCookie = cookies.get('UserName')

      const newState = {
        ...state,
        userName: userNameFromCookie
      }

      return newState
    }
    default: {
      return state
    }
  }
}
