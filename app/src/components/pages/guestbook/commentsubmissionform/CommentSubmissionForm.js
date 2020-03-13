// NPM modules
import React, { Component } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import validator from 'validator'

// CSS
import './CommentSubmissionForm.css'

export default class commentSubmissionForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      guestName: '',
      guestComment: '',
      'g-recaptcha-response': ''
    }
    this.recaptchaKey = 0
    
    this.updateCommentCards = this.props.updateCommentCards.bind(this)
  }

  onReCAPTCHASuccess = (token) => {
    this.setState({ 'g-recaptcha-response': token })
  }

  /**
   * Set the state given the form element that has been changed.
   */
  handleFormChange = (fieldName, event) => {
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
      window.fetch('/submitComment', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          redirect: 'follow',
          referrerPolicy: 'no-refferer'
        },
        // Stringify the needed data for a post to the endpoint.
        body: JSON.stringify({
          guestName: this.state.guestName,
          guestComment: this.state.guestComment,
          'g-recaptcha-response': this.state['g-recaptcha-response']
        })
      })
        .then(response => {
          // If the post request was accepted, then signal for a 
          // reload of the comment cards and reload the recaptcha element.
          if (response.status === 200) {
            this.updateCommentCards()
            this.recaptchaKey++
            this.setState({
              guestName: '',
              guestComment: '',
              'g-recaptcha-response': ''
            })
          }
        })
    }
  }

  /**
   * Validate the input. Return true if everything is ok, false otherwise.
   */
  validateInput = () => {
    var isValid = true

    if (!this.isGuestNameValid()) {
      isValid = false
    }

    if (!this.isGuestCommentValid()) {
      isValid = false
    }

    if (!this.isReCAPTCHAValid()) {
      isValid = false
    }

    return isValid
  }

  
  /**
   * Validate guest name input.
   */
  isGuestNameValid = () => {
    if (validator.isLength(this.state.guestName + '', { min: 2, max: 40 })) {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('guestNameValidity').textContent = ''
      return true
    } else {
      // Display error and scroll to the field.
      document.getElementById('guestNameValidity').textContent = 'Please enter your name. (2-40 characters)'
      document.getElementById('guestNameEntry').scrollIntoView({ behavior: 'smooth', alignToTop: 'false', inline: 'nearest' })
      return false
    }
  }

  /**
   * Validate guest comment input.
   */
  isGuestCommentValid = () => {
    if (validator.isLength(this.state.guestComment + '', { min: 2, max: 500 })) {
      // Be sure to empty the field of past errors if there were any.
      document.getElementById('guestCommentValidity').textContent = ''
      return true
    } else {
      // Display error and scroll to the field.
      document.getElementById('guestCommentValidity').textContent = 'Please enter your comment. (2-40 characters)'
      document.getElementById('guestCommentEntry').scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
      return false
    }
  }

  /**
   * Validate reCAPTCHA status.
   */
  isReCAPTCHAValid = () => {
    if (this.state['g-recaptcha-response'] && this.state['g-recaptcha-response'] > 0) {
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
      <form id='comment-submission-form' onSubmit={this.handleFormSubmit}>

        {/* <!-- Guestbook entry form. --> */}
        <br />
        <hr />
        <div className='form-group'>
          <label htmlFor='guestNameEntry' style={{ textAlign: 'left', display: 'block' }}>Guest name:</label>
          <input
            type='text'
            className='form-control shadow-sm comment-submission-name'
            name='guestName'
            id='guestNameEntry'
            value={this.state.guestName}
            onChange={this.handleFormChange.bind(this, 'guestName')}
            placeholder='Name'
            maxLength='40'
          />
          <strong style={{ color: 'red' }}><div id='guestNameValidity' /></strong>
        </div>

        <div className='form-group'>
          <label htmlFor='guestCommentEntry' style={{ textAlign: 'left', display: 'block' }}>Comment:</label>
          <textarea
            type='text'
            className='form-control shadow-sm comment-submission-textarea'
            name='guestComment'
            id='guestCommentEntry'
            value={this.state.guestComment}
            onChange={this.handleFormChange.bind(this, 'guestComment')}
            placeholder='Comment (500 characters max)'
            rows='5'
            maxLength='300'
          />
          <strong style={{ color: 'red' }}><div id='guestCommentValidity' /></strong>
        </div>

        {/* <!--- Captcha section ---> */}
        <div id='captchaBox' className='form-group d-flex justify-content-center'>
          <ReCAPTCHA
            key={this.recaptchaKey}
            sitekey='6Ld-2sMUAAAAAOEHB0AioqRN-lJc0NTqBOTXjbTL'
            onChange={this.onReCAPTCHASuccess}
          ></ReCAPTCHA>
        </div>
        <strong style={{ color: 'red' }}><div id='captchaValidity'></div></strong>
        <br />

        {/* <!--- Privacy heads up. ---> */}
        <p>
          <strong style={{ color: 'red', fontWeight: '800', fontSize: '125%' }}>* </strong>
          Personally identifiable information is neither tracked nor stored for comments unless provided in a comment.
        </p>

        {/* <!--- Submit button ---> */}
        <br />
        <button id='submitButton' type='submit' className='btn-outline-dark mx-auto'>Submit comment</button>
      </form>
    )
  }
}
