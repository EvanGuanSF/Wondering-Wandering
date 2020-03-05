import React, { Component } from 'react'
import './Portfolio.css'
import ProjectCard from './projectcards/ProjectCard'
import ProjectCategories from './projectcategories/ProjectCategories'

import { calculateUsableHeight, calculateUsableWidth } from '../pageWindowFunctions'

export class Portfolio extends Component {
  state = {
    aboutMeHTML: [],
    currentDetails: [],
    previouslyClickedCardID: 0,

    projectInfo: [],
    categories: [],

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

    // Get and set AboutMe html.
    console.log('Getting about me text...')
    window.fetch('/AboutMe.txt')
      .then(fetchResponse => fetchResponse.text())
      .then(aboutTextResponse => {
        // console.log('About text', aboutTextResponse)
        this.setState({ aboutMeHTML: aboutTextResponse, currentDetails: aboutTextResponse })
      })

    // Get and set project information.
    console.log('Getting project info...')
    window.fetch('/getProjectInfo')
      .then(fetchResponse => fetchResponse.json())
      .then(projectInfoResponse => {
        // console.log('Project Info:', projectInfoResponse)
        this.setState({ projectInfo: projectInfoResponse })

        // Find all of the unique project categories and store them in the component state.
        this.state.projectInfo.map(project =>
          !this.state.categories.includes(project.projectCategory)
            ? this.setState({ categories: [...this.state.categories, project.projectCategory] })
            : null
        )
        console.log('Categories: ', this.state.categories)
      })
    // console.log(this.state.projectInfo.groupBy('projectCategory'))

    // var grouped = this.state.projectInfo.map(this.state.projectInfo.groupBy )
  }

  updateDimensions = () => {
    this.setState({ usableHeight: calculateUsableHeight() })
    this.setState({ usableWidth: calculateUsableWidth() })
    // console.log('Viewable height: ', this.state.usableHeight)
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

  render () {
    return (
      <div id='contentContainer' className='container-fluid'>
        <div id='contentRow' className='row'>

          <div style={{ height: `${this.state.usableHeight}px` }} id='details-col' className='col-lg-6 content-col'>
            <div className='d-flex flex-column flex-row'>
              <div id='detailContents' className='card-container' dangerouslySetInnerHTML={{ __html: this.state.currentDetails }} />
            </div>
          </div>

          <div style={{ height: `${this.state.usableHeight}px` }} id='scrollable-col' className='col-lg-6 justify-content-center text-center content-col'>
            <div className='d-flex flex-column flex-row'>
              <div id='cardContainer' className='card-container' />
              {
                this.state.projectInfo.map((project) => (
                  <ProjectCard key={project.projectID} project={project} />
                ))
              }
              {/* {
                this.state.projectInfo.map((project) => (
                  <ProjectCategories key={project.projectID} project={project} />
                ))
              } */}
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Portfolio
