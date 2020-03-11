// NPM modules
import React, { Component } from 'react'

// Components
import GuestbookCard from './guestbookcard/GuestbookCard'

// CSS
import './Guestbook.css'

// Function libraries.
import { calculateUsableDimensions } from '../pageWindowFunctions'

export default class Guestbook extends Component {
  state = {
    commentData: null,
    usableHeight: 0,
    usableWidth: 0
  }

  /**
   * Constructor for the guestbook page.
   * Fetch big things like the comment information.
   * @param {*} props
   */
  constructor (props) {
    super(props)
    // Get and set project information.
    window.fetch('/getComments')
      .then(fetchResponse => fetchResponse.text())
      .then(commentResponse => {
        this.setState({ commentData: commentResponse })
      })
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
    // console.log('Viewable height: ', this.state.usableHeight)
  }

  render () {
    if (this.state.commentData === null || this.state.commentData === undefined) { return <div /> }
    const comments = this.state.commentData

    return (
      <div className='container-fluid'>
        {/* <!-- A row goes horizontally, left-right. --> */}
        <div className='row'>
          {/* <!-- A col goes vertically, top-bottom. --> */}
          <div 
            id='comment-container-col' 
            className='col-12 justify-content-center text-center content-col shadow'
            style={{ height: `${this.state.usableHeight}px` }}
          >
            <div className='d-flex flex-column flex-row justify-content-center text-center'>
              <br />
              <h1>Guestbook</h1>
              <br />
              <div><b>Please feel free to leave a comment below.</b></div>

              <div className='container' style={{ ppadding: 'auto', margin: 'auto' }}>
                {/* <!--- Padding column ---> */}
                <div className='row'>
                  <div className='col-3 justify-content-center text-center' />

                  <div className='col-6 justify-content-center text-center'>

                    {/* <!-- Guestbook entry form. --> */}
                    <form id='comment-submission-form' action='/submitComment' method='post' encType='application/json'>

                      <br />
                      <hr />
                      <div className='form-group'>
                        <input type='text' className='form-control' name='guestName' id='guestNameEntry' placeholder='Name' />
                        <strong style={{ color: 'red' }}><div id='guestNameValidity' /></strong>
                      </div>

                      <div className='form-group'>
                        <textarea type='text' className='form-control comment-textarea' name='guestComment' id='guestCommentEntry' placeholder='Comment (500 characters max)' rows='5' maxLength='300' />
                        <strong style={{ color: 'red' }}><div id='guestCommentValidity' /></strong>
                      </div>

                      {/* <!--- Captcha section ---> */}
                      <div className='form-group' style={{ display: 'inline-block' }}>
                        <div id='captchaElement' className='g-recaptcha' data-sitekey='6Ld-2sMUAAAAAOEHB0AioqRN-lJc0NTqBOTXjbTL' data-callback='onReCAPTCHASuccess' />
                      </div>

                      {/* <!--- Privacy heads up. ---> */}
                      <p><strong style={{ color: 'red', fontWeight: '800', fontSize: '125%' }}>* </strong>Personally identifiable information is neither tracked nor stored for comments unless provided in a comment.</p>

                      {/* <!--- Submit button ---> */}
                      <br />
                      <button id='submitButton' type='button' className='btn-outline-dark mx-auto'>Submit comment</button>
                      <hr />
                      <br />
                    </form>

                    <div className='d-flex flex-column flex-row'>
                      <div id='cardContainer' className='card-container' />
                      {
                        JSON.parse(comments).map(comment => {
                          return (
                            <GuestbookCard commentInformation={comment}></GuestbookCard>
                          )
                        })
                      }
                    </div>

                    </div>

                  {/* <!--- Padding column ---> */}
                    <div className='col-3 justify-content-center text-center' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
