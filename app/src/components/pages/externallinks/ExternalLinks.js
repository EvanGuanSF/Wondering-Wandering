// NPM modules
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'

// Components
import ExternalLinkCard from './externallinkcard/ExternalLinkCard'

// Contexts
import LayoutContext from '../../../context/LayoutState'

// CSS
import './ExternalLinks.css'

export default class ExternalLinks extends Component {
  static contextType = LayoutContext

  constructor (props) {
    super(props)

    this.state = {
      linkData: null,
      usableHeight: 0,
      usableWidth: 0
    }


    // Get and set comment card information.
    this.updateCommentCards()
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
    axios.get('/api/getExternalLinkInfo', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
      .then(linkDataResponse => {
        // console.log('Comments:', commentResponse.data)
        this.setState({ linkData: linkDataResponse.data })
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
        }
      })
  }

  render () {
    if (this.state.linkData === null || this.state.linkData === undefined) { return <div /> }
    const links = this.state.linkData

    return (
        <div 
          id='link-container-col'
          style={{ height: `${this.context.state.usableHeight}px` }}
        >
          <div className='row'>
            {/* <!--- Padding column ---> */}
            <div className='col-3 justify-content-center text-center' />

            {/* <!--- Primary column ---> */}
            <div className='col-6 justify-content-center text-center'>
              <br />
              <h1>External Links</h1>
              <br />
              <hr />
              <div className='d-flex flex-column flex-row'>
              
                <div id='cardContainer' className='card-container' />

                  {
                    links.map((link, index) => {
                      return (
                        <ExternalLinkCard key={index} linkInformation={link}></ExternalLinkCard>
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
