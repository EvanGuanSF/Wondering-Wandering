// NPM modules
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Components
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Portfolio from './components/pages/portfolio/Portfolio'
import Guestbook from './components/pages/guestbook/Guestbook'
import Login from './components/pages/login/Login'
import Registration from './components/pages/registration/Registration'

// CSS
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isShowingAboutMe: true
    }
  }

  setIsShowingAboutMe = (isShowing) => {
    this.setState({ isShowingAboutMe: isShowing })
  }

  render () {
    return (
      <div className='App'>
        <div className='container col-12' style={{ margin: '0 0 0 0', padding: '0 0 0 0', width: '100%' }}>
          <Router>
            {/* Always show the navbar. */}
            <Navbar
              isShowingAboutMe={this.state.isShowingAboutMe}
              setIsShowingAboutMe={this.setIsShowingAboutMe}
            />

            {/* Conditionally show components based on route. */}
            <Route
              exact path='/'
              render={() => (
                <Portfolio
                  isShowingAboutMe={this.state.isShowingAboutMe}
                  setIsShowingAboutMe={this.setIsShowingAboutMe}
                >
                </Portfolio>
                )
              }
            >
            </Route>

            <Route
              exact path='/guestbook'
              component={Guestbook}
            >
            </Route>

            <Route
              exact path='/login'
              component={Login}
            >
            </Route>

            <Route
              exact path='/register'
              component={Registration}
            >
            </Route>

            {/* Always show the footer. */}
            <Footer />
          </Router>
        </div>
      </div>
    )
  }
}

export default App
