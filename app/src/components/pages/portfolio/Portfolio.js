// NPM modules
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'

// Components
import ProjectCategories from './projectcategories/ProjectCategories'
import DetailContent from './detailcontent/DetailContent'

// Contexts
import LayoutContext from '../../../context/LayoutState'

// CSS
import './Portfolio.css'

export default class Portfolio extends Component {
  static contextType = LayoutContext

  constructor (props) {
    super(props)

    this.state = {
      projectInfo: null
    }
  }

  componentDidMount () {
    // Get project info.
    this.getProjectInfo()

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

  getProjectInfo = () => {
    // Get and set project information.
    axios.get('/api/getProjectInfo', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
      .then(projectInfoResponse => {
        this.setState({ projectInfo: projectInfoResponse.data }, () => {
          // console.log('Project Info:', this.state.projectInfo)
        })
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
        }
      })
  }

  render () {
    if (this.state.projectInfo === null) { return <div /> }

    return (
      <CSSTransition
      transitionName="portfolio-page"
      transitionAppear={true}
      transitionAppearTimeout={300}
      transitionEnter={true}
      transitionEnterTimeout={300}
      transitionLeave={false}>

        <div id='contentContainer' className='container-fluid'>
          <div id='contentRow' className='row'>

              <div style={{ width:`${this.context.state.usableWidth}px`, height: `${this.context.state.usableHeight}px` }} id='details-col' className='col-lg-6 content-col'>
                <div className='d-flex flex-column flex-row'>
                    <div id='detailContents' className='card-container'>
                      <div>
                          <DetailContent
                            projects={this.state.projectInfo}
                          />
                      </div>
                    </div>
                </div>
              </div>

              <div style={{ width:`${this.context.state.usableWidth}px`, height: `${this.context.state.usableHeight}px` }} id='scrollable-col' className='col-lg-6 justify-content-center text-center scrollable-col'>
                <div className='d-flex flex-column flex-row'>
                  <div id='cardContainer' className='card-container' />
                  <ProjectCategories
                    projects={this.state.projectInfo}
                  />
                </div>
              </div>

          </div>
        </div>

      </CSSTransition>
    )
  }
}
