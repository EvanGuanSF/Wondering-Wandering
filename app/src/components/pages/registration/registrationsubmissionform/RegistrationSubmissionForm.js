// NPM modules
import React, { Component } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import validator from 'validator'

// CSS
import './RegistrationSubmissionForm.css'

export default class RegistrationSubmissionForm extends Component {
  /**
   * Constructor for the registration form.
   * @param {*} props
   */
  constructor (props) {
    super(props)

    this.state = {
      userName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      'g-recaptcha-response': ''
    }
  }

  onReCAPTCHASuccess = (token) => {
    this.setState({ 'g-recaptcha-response': token })
  }

  /**
   * Set the state given the form element that has been changed.
   */
  handleFormChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  /**
   * Handle the submit process when the submit button is pressed.
   */
  handleFormSubmit = (event) => {
    // Prevent the default action.
    event.preventDefault()

    // Check the user input.
    if (this.validateInput()) {
      // If the user input is valid, fire a post request.
      console.log('calling registration endpoint.')
      window.fetch('/register', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          redirect: 'disabled',
          referrerPolicy: 'no-refferer'
        },
        // Stringify the needed data for a post to the endpoint.
        body: JSON.stringify({
          'userName': this.state.userName,
          'email': this.state.email,
          'password': this.state.password,
          'passwordConfirmation': this.state.passwordConfirmation,
          'g-recaptcha-response': this.state['g-recaptcha-response']
        })
      })
        .then(response => {
          // If the post request was accepted, then follow the redirect.
          if (response.redirected) {
              window.location.href = response.url;
          }
        })
    }
  }

  /**
   * Validate the input. Return true if everything is ok, false otherwise.
   */
  validateInput = () => {
    var isValid = true

    if (!this.isUserNameValid()) {
      isValid = false
    }

    if (!this.isEmailValid()) {
      isValid = false
    }

    if (!this.isPasswordValid()) {
      isValid = false
    }

    if (!this.isPasswordConfirmationValid()) {
      isValid = false
    }

    if (!this.isReCAPTCHAValid()) {
      isValid = false
    }

    return isValid
  }

  /**
   * Validate new user password.
   */
  isUserNameValid = () => {
    if (validator.isLength(this.state.userName.trim() + '', { min: 3, max: 50 })) {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('userNameValidity').textContent = ''
      return true
    } else {
      // Display error and scroll to the field.
      document.getElementById('userNameValidity').textContent = 'Please enter a valid user name 3-50 characters long.'
      document.getElementById('userNameValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    }
  }
  
  /**
   * Validate new user email address.
   */
  isEmailValid = () => {
    if (validator.isEmail(this.state.email.trim()) && validator.isLength(this.state.email.trim() + '', { max: 90 })) {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('emailValidity').textContent = ''
      return true
    } else {
      // Display error and scroll to the field.
      document.getElementById('emailValidity').textContent = 'Please enter a valid email.'
      document.getElementById('emailValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    }
  }
  
  /**
   * Validate new user password.
   */
  isPasswordValid = () => {
    if (validator.isLength(this.state.password.trim() + '', { min: 7, max: 50 })) {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('passwordValidity').textContent = ''
      return true
    } else {
      // Display error and scroll to the field.
      document.getElementById('passwordValidity').textContent = 'Please enter a valid password 7-50 characters long.'
      document.getElementById('passwordValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    }
  }
  
  /**
   * Validate new user password match.
   */
  isPasswordConfirmationValid = () => {
    if (this.state.passwordConfirmation.trim() === this.state.password.trim()) {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('passwordConfirmationValidity').textContent = ''
      return true
    } else {
      // Display error and scroll to the field.
      document.getElementById('passwordConfirmationValidity').textContent = 'Passwords do not match.'
      document.getElementById('passwordConfirmationValidity').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    }
  }

  /**
   * Validate reCAPTCHA status.
   */
  isReCAPTCHAValid = () => {
    if (this.state['g-recaptcha-response'] && this.state['g-recaptcha-response'].length > 0) {
      // Captcha checked
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('captchaValidity').textContent = ''
      return true
    } else {
      // Captcha not checked
      // Display error and scroll to the field.
      document.getElementById('captchaValidity').textContent = 'Please check the box to continue.'
      document.getElementById('captchaBox').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    }
  }

  render () {
    return (
      <form id='registration-form' action='/register' method='post' encType='application/json'>
        <br />
        <hr />

        <div className='form-group'>
          <label htmlFor='userNameEntry' style={{ textAlign: 'left', display: 'block' }}>User name:</label>
          <input
            type='text'
            className='form-control shadow-sm registration-form-input'
            name='userName'
            id='userNameEntry'
            placeholder='User Name'
            rows='1'
            maxLength='50'
            onLoad={this.handleFormChange.bind(this)}
            onChange={this.handleFormChange.bind(this)}
          />
          <strong style={{ color: 'red' }}><div id='userNameValidity' /></strong>
        </div>

        <div className='form-group'>
          <label htmlFor='emailEntry' style={{ textAlign: 'left', display: 'block' }}>Email address:</label>
          <input
            type='text'
            className='form-control shadow-sm registration-form-input'
            name='email'
            id='emailEntry'
            placeholder='Email'
            rows='1'
            maxLength='90'
            onLoad={this.handleFormChange.bind(this)}
            onChange={this.handleFormChange.bind(this)}
          />
          <strong style={{ color: 'red' }}><div id='emailValidity' /></strong>
        </div>

        <div className='form-group'>
          <label htmlFor='password' style={{ textAlign: 'left', display: 'block' }}>Password:</label>
          <input
            type='password'
            autoComplete='new-password'
            className='form-control shadow-sm registration-form-input'
            name='password'
            id='passwordEntry'
            placeholder='Password (7-30 chars)'
            rows='1'
            maxLength='50'
            onLoad={this.handleFormChange.bind(this)}
            onChange={this.handleFormChange.bind(this)}
          />
          <strong style={{ color: 'red' }}><div id='passwordValidity' /></strong>
        </div>

        <div className='form-group'>
          <label htmlFor='passwordConfirmation' style={{ textAlign: 'left', display: 'block' }}>Confirm password:</label>
          <input
            type='password'
            autoComplete='new-password'
            className='form-control shadow-sm registration-form-input'
            name='passwordConfirmation'
            id='passwordConfirmationEntry'
            placeholder='Confirm Password'
            rows='1'
            maxLength='50'
            onLoad={this.handleFormChange.bind(this)}
            onChange={this.handleFormChange.bind(this)}
          />
          <strong style={{ color: 'red' }}><div id='passwordConfirmationValidity' /></strong>
        </div>

        <div id='captchaBox' className='form-group d-flex justify-content-center'>
          <ReCAPTCHA
            key={this.recaptchaKey}
            sitekey='6Ld-2sMUAAAAAOEHB0AioqRN-lJc0NTqBOTXjbTL'
            onChange={this.onReCAPTCHASuccess.bind(this)}
          />
        </div>
        <strong style={{ color: 'red' }}><div id='captchaValidity' /></strong>
        <strong style={{ color: 'red' }}><div id='errorText' /></strong>

        <br />
        <button
          id='registrationSubmitButton'
          type='submit'
          className='btn-outline-dark mx-auto'
          style={{ borderWidth: '2px' }}
          onClick={this.handleFormSubmit.bind(this)}
        >Register</button>
        <hr />
        <br />

      </form>
    )
  }
}
