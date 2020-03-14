// NPM modules
import React, { Component } from 'react'

// Components
import RegistrationSubmissionForm from './registrationsubmissionform/RegistrationSubmissionForm'

// CSS
import './Registration.css'

// Function libraries.
import { calculateUsableDimensions } from '../../../libraries/pageWindowFunctions'

export default class Registration extends Component {
  /**
   * Constructor for the registration page.
   * @param {*} props
   */
  constructor (props) {
    super(props)

    this.state = {
      usableHeight: 0,
      usableWidth: 0
    }
  }

  componentDidMount () {
    // Add the window resize event listener.
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  componentWillUnmount () {
    // Remove the event listener when we are done.
    window.removeEventListener('resize', this.updateDimensions.bind(this))
  }

  updateDimensions = () => {
    var dimensions = calculateUsableDimensions()
    this.setState({ usableWidth: dimensions[0] })
    this.setState({ usableHeight: dimensions[1] })
  }

  render () {
    return (
      <div
        id='registration-container-col'
        style={{ height: `${this.state.usableHeight}px` }}
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
