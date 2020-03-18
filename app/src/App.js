// NPM modules
import React, { useState, useContext } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Components
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Portfolio from './components/pages/portfolio/Portfolio'
import Guestbook from './components/pages/guestbook/Guestbook'
import Login from './components/pages/login/Login'
import Registration from './components/pages/registration/Registration'
import { LoginProvider, LoginContext } from './context/LoginState'

// CSS
import './App.css'

class App extends Component {
  const [isShowingAboutMe, setIsShowingAboutMe] = useState(true)
  const { updateLoginInfo } = useContext(LoginContext)

  return (
    <div
      className='App'
      onLoad={updateLoginInfo()}
    >
      <div className='container col-12' style={{ margin: '0 0 0 0', padding: '0 0 0 0', width: '100%' }}>
        {/* These routes can all make use of login state information. */}
        <Router>
          <LoginProvider>
            {/* Always show the navbar. */}
            <Navbar
              isShowingAboutMe={isShowingAboutMe}
              setIsShowingAboutMe={setIsShowingAboutMe}
            />

            {/* Conditionally show components based on route. */}
            <Route
              exact path='/'
              render={() => (
                <Portfolio
                  isShowingAboutMe={isShowingAboutMe}
                  setIsShowingAboutMe={setIsShowingAboutMe}
                />
              )}
            />

            <Route
              exact path='/guestbook'
              component={Guestbook}
            />

            <Route
              exact path='/login'
              component={Login}
            />

            <Route
              exact path='/register'
              component={Registration}
            />

            {/* Always show the footer. */}
            <Footer />
          </LoginProvider>
        </Router>
      </div>
    </div>
  )
}
