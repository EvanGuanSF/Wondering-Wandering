// NPM modules
import React, { Component } from 'react'

// Components
import ProjectCategories from './projectcategories/ProjectCategories'
import DetailContent from './detailcontent/DetailContent'

// Contexts
import PortfolioContext from '../../../context/PortfolioState'

// Function libraries.
import { calculateUsableDimensions } from '../../../libraries/pageWindowFunctions'

// CSS
import './Portfolio.css'

export default class Portfolio extends Component {
  static contextType = PortfolioContext

  /**
   * Constructor for the portfolio page.
   * Fetch big things like project information.
   * @param {*} props
   */
  constructor (props) {
    super(props)

    this.state = {
      projectInfo: null,
      previouslyClickedCardID: 0,

      usableHeight: 0,
      usableWidth: 0
    }

    // Get and set project information.
    window.fetch('/getProjectInfo')
      .then(fetchResponse => fetchResponse.json())
      .then(projectInfoResponse => {
        // console.log('Project Info:', projectInfoResponse)
        this.setState({ projectInfo: projectInfoResponse })
      })
  }

  componentDidUpdate () {
    this.updateCardState()
  }

  componentDidMount () {
    // Add the window resize event listener.
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  componentWillUnmount () {
    // Remove the event listener when we are done.
    window.removeEventListener('resize', this.updateDimensions.bind(this))
    this.context.setFocusedProjectID(0)
    this.context.setIsShowingAboutMe(false)
  }

  updateCardState = () => {
    // Reset the background color on the previously clicked card if applicable.
    var prevID = this.context.state.previouslyClickedCardID
    var curID = this.context.state.focusedProjectID

    if (prevID > 0 && prevID !== curID) {
      document.getElementById('card-' + prevID).style.backgroundColor = 'var(--whiteish)'
    }
  }

  updateDimensions = () => {
    var dimensions = calculateUsableDimensions()
    this.setState({ usableWidth: dimensions[0] })
    this.setState({ usableHeight: dimensions[1] })
    // console.log('Viewable height: ', this.state.usableHeight)
  }

  /**
   * Highlight the clicked card and un-highlight the previously clicked card if applicable.
   */
  highlightCard = (projectID) => {
    const previouslyClickedCardID = this.context.state.focusedProjectID
    var cardID = 'card-' + projectID

    // If the clicked card and the previously clicked card are the same, we have nothing to do.
    if (projectID === previouslyClickedCardID) {
      return
    } else if (projectID > 0) {
      // Otherwise...
      // Chenge the color of the clicked card.
      document.getElementById(cardID).style.backgroundColor = 'var(--lavenderish)'
    }
  }

  /**
   * Gets and displays project info on the left/top column.
   */
  showCardDetails = (projectID) => {
    const previouslyClickedCardID = this.context.state.focusedProjectID
    // If the clicked card and the previously clicked card are the same, we have nothing to do.
    if (projectID === previouslyClickedCardID) {
      return
    }
  }

  render () {
    if (this.state.projectInfo === null) { return <div /> }

    return (
      <div id='contentContainer' className='container-fluid'>
        <div id='contentRow' className='row'>

          <div style={{ width:`${this.state.usableWidth}px`, height: `${this.state.usableHeight}px` }} id='details-col' className='col-lg-6 content-col'>
            <div className='d-flex flex-column flex-row'>
              <div id='detailContents' className='card-container'>
                <DetailContent
                  projects={this.state.projectInfo}
                />
              </div>
            </div>
          </div>

          <div style={{ width:`${this.state.usableWidth}px`, height: `${this.state.usableHeight}px` }} id='scrollable-col' className='col-lg-6 justify-content-center text-center scrollable-col'>
            <div className='d-flex flex-column flex-row'>
              <div id='cardContainer' className='card-container' />
              <ProjectCategories
                projects={this.state.projectInfo}
                highlightCard={this.highlightCard}
                showCardDetails={this.showCardDetails}
              />
            </div>
          </div>

        </div>
      </div>
    )
  }
}
