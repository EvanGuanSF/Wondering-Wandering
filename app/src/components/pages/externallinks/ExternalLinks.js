// NPM modules
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'

// Components
import ExternalLinkCard from './externallinkcard/ExternalLinkCard'

// Contexts

// CSS
import './ExternalLinks.css'

export default class ExternalLinks extends Component {
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
      <CSSTransition
        in={true}
        appear={true}
        timeout={1500}
        classNames="defaultTransition"
      >
        <div 
          id='link-container-col'
        >
          <div className='row'>
            {/* <!--- Padding column ---> */}
            <div className='col-3 justify-content-center text-center p-0 m-0' />

            {/* <!--- Primary column ---> */}
            <div className='col-6 justify-content-center text-center p-0 m-0'>
              <br />
              <h1>External Links</h1>
              <hr />
              <div id='cardContainer'/>
                <div className='row justify-content-center'>
                  <div className='col-6 p-0 m-0'>
                    {
                      links.map((link, index) => {
                        return (
                          <CSSTransition
                            in={true}
                            appear={true}
                            key={index}
                            timeout={1500}
                            classNames="defaultTransition"
                          >
                            <ExternalLinkCard key={index} linkInformation={link}></ExternalLinkCard>
                          </CSSTransition>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

            {/* <!--- Padding column ---> */}
            <div className='col-3 justify-content-center text-center p-0 m-0' />
          </div>
        </div>
      </CSSTransition>
    )
  }
}
