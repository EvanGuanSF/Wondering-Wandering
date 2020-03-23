// NPM modules
import React, { Component } from 'react'

// Components
import LoginSubmissionForm from './loginsubmissionform/LoginSubmissionForm'

// Contexts
import LayoutContext from '../../../context/LayoutState'

// CSS
import './Login.css'

export default class Login extends Component {
  static contextType = LayoutContext

  componentDidMount () {
    // Update render dimensions.
    this.context.updateUsableDimensions()

    // Add the window resize event listener.
    window.addEventListener('resize', this.context.updateUsableDimensions.bind(this))
  }

  componentWillUnmount () {
    // Remove the event listener when we are done.
    window.removeEventListener('resize', this.context.updateUsableDimensions.bind(this))
  }

  render () {
    return (
      <div
        id='login-container-col'
        style={{ height: `${this.context.state.usableHeight}px` }}
      >
        <div className='row'>
          {/* <!--- Padding column ---> */}
          <div className='col-3 justify-content-center text-center' />

          {/* <!--- Primary column ---> */}
          <div className='col-6 justify-content-center text-center'>
            <br />
            <h1>Admin Login</h1>
            <LoginSubmissionForm />
          </div>
        </div>

        {/* <!--- Padding column ---> */}
        <div className='col-3 justify-content-center text-center' />
      </div>
    )
  }
}
