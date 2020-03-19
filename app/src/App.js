// NPM modules
import React, { Component } from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'

// Components
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Portfolio from './components/pages/portfolio/Portfolio'
import Guestbook from './components/pages/guestbook/Guestbook'
import Login from './components/pages/login/Login'
import Registration from './components/pages/registration/Registration'

// Contexts
import { LoginProvider, LoginContext } from './context/LoginState'
import { PortfolioProvider } from './context/PortfolioState'

// CSS
import './App.css'

class App extends Component {
  static contextType = LoginContext

  componentDidUpdate () {
    this.context.updateCookieInfo()
  }

  render () {

    return (
      <div className='container col-12' style={{ margin: '0 0 0 0', padding: '0 0 0 0', width: '100%' }}>
        {/* These routes can all make use of login state information. */}
        <Router>
          <LoginProvider>
            {/* Always show the navbar. */}
            {/* Conditionally show the portfolio based on route. */}
            <Switch>

              <Route
                exact path='/'
                render={() => 
                  <PortfolioProvider>
                    <Navbar />
                    <Portfolio />
                  </PortfolioProvider>
                }
              />

              <Route to='*' component={Navbar} />
              
            </Switch>

            {/* Conditionally show the guestbook page based on route. */}
            <Route
              exact path='/guestbook'
              component={Guestbook}
            />

            {/* Conditionally show the login page based on route. */}
            <Route
              exact path='/login'
              component={Login}
            />

            {/* Conditionally show the registration page based on route. */}
            <Route
              exact path='/register'
              component={Registration}
            />

            {/* Always show the footer. */}
            <Footer />
          </LoginProvider>
        </Router>
      </div>
    )
  }
}

export default App
