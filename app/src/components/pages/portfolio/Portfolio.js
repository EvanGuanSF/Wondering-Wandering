import React, { Component } from 'react'
import './Portfolio.css'
import ProjectCategories from './projectcategories/ProjectCategories'
import DetailContent from './detailcontent/DetailContent'

import { calculateUsableHeight, calculateUsableWidth } from '../pageWindowFunctions'

export default class Portfolio extends Component {
  state = {
    projectInfo: null,
    focusedProjectID: 0,

    usableHeight: 0,
    usableWidth: 0
  }

  /**
   * Constructor for the portfolio page.
   * Fetch big things like about me and project information.
   * @param {*} props
   */
  constructor (props) {
    super(props)
    // Get and set project information.
    window.fetch('/getProjectInfo')
      .then(fetchResponse => fetchResponse.json())
      .then(projectInfoResponse => {
        // console.log('Project Info:', projectInfoResponse)
        this.setState({ projectInfo: projectInfoResponse })
      })
  }

  updateDimensions = () => {
    this.setState({ usableHeight: calculateUsableHeight() })
    this.setState({ usableWidth: calculateUsableWidth() })
    // console.log('Viewable height: ', this.state.usableHeight)
  }

  // static getDerivedStateFromProps (props, state) {
  //   if (props.isShowingAboutMe) {
  //     state.focusedProjectID = 0
  //   }

  //   return state
  // }

  componentDidUpdate () {
    if (this.props.isShowingAboutMe && this.state.focusedProjectID !== 0) {
      this.highlightCard(0)
      this.setState({ focusedProjectID: 0 })
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

  /**
   * Highlight the clicked card and un-highlight the previously clicked card if applicable.
   */
  highlightCard = (projectID) => {
    const previouslyClickedCardID = this.state.focusedProjectID
    var cardID = 'card-' + projectID
    var previousCardID = 'card-' + previouslyClickedCardID

    // If the clicked card and the previously clicked card are the same, we have nothing to do.
    if (projectID === previouslyClickedCardID) {
      return
    }

    // Otherwise...
    // Chenge the color of the clicked card.
    if (projectID > 0) {
      document.getElementById(cardID).style.backgroundColor = 'var(--lavenderish)'
    }
    // Reset the color of the previously clicked card.
    if (previouslyClickedCardID > 0) {
      document.getElementById(previousCardID).style.backgroundColor = 'var(--whiteish)'
    }

    // Update the previouslyClickedCardID
    this.setState({ previouslyClickedCardID: projectID })
  }

  /**
   * Gets and displays project info on the left/top column.
   */
  showCardDetails = (projectID) => {
    const previouslyClickedCardID = this.state.focusedProjectID
    // If the clicked card and the previously clicked card are the same, we have nothing to do.
    if (projectID === previouslyClickedCardID) {
      return
    }

    // Update the state to reflect the projectID of the card that was clicked.
    this.setState({ focusedProjectID: projectID })
  }

  render () {
    if (this.state.projectInfo === null) { return <div /> }

    return (
      <div id='contentContainer' className='container-fluid'>
        <div id='contentRow' className='row'>

          <div style={{ height: `${this.state.usableHeight}px` }} id='details-col' className='col-lg-6 content-col'>
            <div className='d-flex flex-column flex-row'>
              {/* <div id='detailContents' className='card-container' dangerouslySetInnerHTML={{ __html: this.state.currentDetails }} /> */}
              <div id='detailContents' className='card-container'>
                <DetailContent
                  focusedProjectID={this.state.focusedProjectID}
                  projects={this.state.projectInfo}
                />
              </div>
            </div>
          </div>

          <div style={{ height: `${this.state.usableHeight}px` }} id='scrollable-col' className='col-lg-6 justify-content-center text-center content-col'>
            <div className='d-flex flex-column flex-row'>
              <div id='cardContainer' className='card-container' />
              <ProjectCategories
                projects={this.state.projectInfo}
                highlightCard={this.highlightCard}
                showCardDetails={this.showCardDetails}
                setIsShowingAboutMe={this.props.setIsShowingAboutMe}
              />
            </div>
          </div>

        </div>
      </div>
    )
  }
}
