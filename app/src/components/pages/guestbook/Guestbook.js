// NPM modules
import React, { Component } from 'react'

// Components
import GuestbookCard from './guestbookcard/GuestbookCard'
import CommentSubmissionForm from './commentsubmissionform/CommentSubmissionForm'

// CSS
import './Guestbook.css'

// Function libraries.
import { calculateUsableDimensions } from '../../../libraries/pageWindowFunctions'

export default class Guestbook extends Component {
  /**
   * Constructor for the guestbook page.
   * Fetch big things like the comment information.
   * @param {*} props
   */
  constructor (props) {
    super(props)

    this.state = {
      commentData: null,
      usableHeight: 0,
      usableWidth: 0
    }

    // Get and set comment card information.
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
  }

  /**
   * Re-fetch the comment information.
   */
  updateCommentCards = () => {
    // Get and set comment card information.
    window.fetch('/getComments')
      .then(fetchResponse => fetchResponse.text())
      .then(commentResponse => {
        this.setState({ commentData: commentResponse })
      })
  }

  render () {
    if (this.state.commentData === null || this.state.commentData === undefined) { return <div /> }
    const comments = this.state.commentData

    return (
      <div 
        id='comment-container-col'
        style={{ height: `${this.state.usableHeight}px` }}
      >
        <div className='row'>
          {/* <!--- Padding column ---> */}
          <div className='col-3 justify-content-center text-center' />

          {/* <!--- Primary column ---> */}
          <div className='col-6 justify-content-center text-center'>
            <br />
            <h1>Guestbook</h1>
            <br />
            <div><b>Please feel free to leave a comment below.</b></div>
            {/* <!-- Guestbook entry form. --> */}
            <CommentSubmissionForm updateCommentCards={this.updateCommentCards}/>
            <hr />
            <div className='d-flex flex-column flex-row'>
              <div id='cardContainer' className='card-container' />
              {
                JSON.parse(comments).map((comment, index) => {
                  return (
                    <GuestbookCard key={index} commentInformation={comment}></GuestbookCard>
                  )
                })
              }
            </div>
          </div>

          {/* <!--- Padding column ---> */}
          <div className='col-3 justify-content-center text-center' />
        </div>
      </div>
    )
  }
}
