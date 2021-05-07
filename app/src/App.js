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
import ExternalLinks from './components/pages/externallinks/ExternalLinks'
import PageNotFound from './components/pages/PageNotFound'

// Contexts
import { LoginProvider, LoginContext } from './context/LoginState'
import { PortfolioProvider } from './context/PortfolioState'
import { LayoutProvider } from './context/LayoutState'

// CSS
import './App.css'

export default class App extends Component {
  static contextType = LoginContext

  componentDidUpdate () {
    this.context.updateCookieInfo()
  }

  render () {
    return (
      <div className='container col-12' style={{ margin: '0 0 0 0', padding: '0 0 0 0', width: '100%' }}>
        <Router>
        
          <LayoutProvider>
            <LoginProvider>
              <PortfolioProvider>

                <Route path='*' component={Navbar} />

                <Switch>
                  <Route
                    exact path='/'
                    render={() => 
                        <Portfolio />
                    }
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

                  <Route
                    exact path='/external-links'
                    component={ExternalLinks}
                  />

                  <Route
                    path='/*'
                    component={PageNotFound}
                  />
                </Switch>

                <Footer />

              </PortfolioProvider>
            </LoginProvider>
          </LayoutProvider>

        </Router>
      </div>
    )
  }
}
