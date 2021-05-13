// NPM modules
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'

// Components
import GuestbookCard from './guestbookcard/GuestbookCard'
import CommentSubmissionForm from './commentsubmissionform/CommentSubmissionForm'

// Contexts

// CSS
import './Guestbook.css'

export default class Guestbook extends Component {
  constructor (props) {
    super(props)

    this.state = {
      commentData: null,
      usableHeight: 0,
      usableWidth: 0
    }


    // Get and set comment card information.
    this.updateCommentCards()
  }

  componentDidMount () {
    }

  componentWillUnmount () {
    // Cancel requests.
    if (this.cancelRequests !== null) {
      this.cancelRequests()
    }
  }

  /**
   * Re-fetch the comment information.
   */
  updateCommentCards = () => {
    // Get and set comment card information.
    axios.get('/api/getComments', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
      .then(commentResponse => {
        // console.log('Comments:', commentResponse.data)
        this.setState({ commentData: commentResponse.data })
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
        }
      })
  }

  render () {
    if (this.state.commentData === null || this.state.commentData === undefined) { return <div /> }
    const comments = this.state.commentData

    return (
      <CSSTransition
        in={true}
        appear={true}
        timeout={1500}
        classNames="defaultTransition"
      >
        <div 
          id='comment-container-col'
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
                    comments.map((comment, index) => {
                      return (
                        <CSSTransition
                          in={true}
                          appear={true}
                          key={index}
                          timeout={1500}
                          classNames="defaultTransition"
                        >
                          <GuestbookCard key={index} commentInformation={comment}></GuestbookCard>
                        </CSSTransition>
                      )
                    })
                  }

              </div>
            </div>

            {/* <!--- Padding column ---> */}
            <div className='col-3 justify-content-center text-center' />
          </div>
        </div>
      </CSSTransition>
    )
  }
}
