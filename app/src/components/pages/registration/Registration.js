// NPM modules
import React, { Component } from 'react'

// Components
import RegistrationSubmissionForm from './registrationsubmissionform/RegistrationSubmissionForm'

// Contexts
import LayoutContext from '../../../context/LayoutState'

// CSS
import './Registration.css'

export default class Registration extends Component {
  static contextType = LayoutContext

  constructor (props) {
    super(props)

    this.state = {
      usableHeight: 0,
      usableWidth: 0
    }
  }

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
        id='registration-container-col'
        style={{ height: `${this.context.state.usableHeight}px` }}
      >
        <div className='row'>
          {/* <!--- Padding column ---> */}
          <div className='col-3 justify-content-center text-center' />

          {/* <!--- Primary column ---> */}
          <div className='col-6 justify-content-center text-center'>
            <br />
            <h1>Admin Registration</h1>
            <RegistrationSubmissionForm />
          </div>
        </div>

        {/* <!--- Padding column ---> */}
        <div className='col-3 justify-content-center text-center' />
      </div>
    )
  }
}
