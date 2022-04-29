// NPM modules
import React, { Component } from 'react'
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom'

// Components
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Portfolio from './components/pages/portfolio/Portfolio'
import Guestbook from './components/pages/guestbook/Guestbook'
import Login from './components/pages/login/Login'
import Registration from './components/pages/registration/Registration'
import ExternalLinks from './components/pages/externallinks/ExternalLinks'
import PiDataCharts from './components/pages/pidatacharts/PiDataCharts'
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
                <Navbar />
                <Routes>
                  <Route  exact path="/" element={<Portfolio />} />
                  <Route
                    exact path="/guestbook"
                    element={<Guestbook />}
                  />
                  <Route
                    path="/login"
                    element={<Login />}
                  />
                  <Route
                    path="/register"
                    element={<Registration />}
                  />
                  <Route
                    path="/external-links"
                    element={<ExternalLinks />}
                  />
                  <Route
                    path="/pi-data-charts"
                    element={<PiDataCharts />}
                  />
                  <Route
                    path="/*"
                    element={<PageNotFound />}
                  />
                </Routes>
                <Footer />
              </PortfolioProvider>
            </LoginProvider>
          </LayoutProvider>
        </Router>
      </div>
    )
  }
}
