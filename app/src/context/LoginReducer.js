// NPM modules
import Cookies from 'universal-cookie'

export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_FROM_COOKIE': {
      console.log('Updating from cookie info...')
      const cookies = new Cookies()
      var loginCookie = cookies.get('UserName')
      console.log(loginCookie)
      // isClientLoggedIn

      var newState = { ...state }

      // console.log(newState)
      return newState
    }
    default: {
      return state
    }
  }
}
