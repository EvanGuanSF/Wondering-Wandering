// NPM modules
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'

// Components
import ProjectCard from '../projectcards/ProjectCard'

// Contexts
import PortfolioContext from '../../../../context/PortfolioState'

// CSS
import './ProjectCategories.css'

export default class ProjectCategories extends Component {
  static contextType = PortfolioContext

  constructor (props) {
    super(props)

    this.state = {
      categories: []
    }
  }

  componentDidUpdate () {
    this.updateCardState()
  }

  componentDidMount () {
    this.setUniqueProjectCategoriesState()
  }
  
  updateCardState = () => {
    // Reset the background color on the previously clicked card if applicable.
    var prevID = this.context.state.previouslyClickedCardID
    var curID = this.context.state.focusedProjectID

    if (curID === prevID) {
      return
    }
    if (curID > 0) {
      // Otherwise...
      // Chenge the color of the clicked card.
      document.getElementById('card-' + curID).style.backgroundColor = 'var(--lavenderish)'
    }
    if (prevID > 0) {
      document.getElementById('card-' + prevID).style.backgroundColor = 'var(--whiteish)'
    }
  }

  /**
   * Finds and assigns an array of unique project types to a state value
   * using data from the projects prop.
   */
  setUniqueProjectCategoriesState = () => {
    // Find all of the unique project categories and store them in an array.
    var uniqueCategories = []

    this.props.projects.forEach(project => {
      if (!uniqueCategories.includes(project.projectCategory)) {
        uniqueCategories.push(project.projectCategory)
        // this.createCategorizedProjectsJSON(project.projectCategory)
      }
    })
    this.setState({ categories: uniqueCategories })
  }

  /**
   * Returns the projects of a given category.
   */
  createCategorizedProjectsJSON = (categoryToFind) => {
    // Holds the project info for a particular category.
    var categorizedProjects = []
    // Loop through the categories and create new jsx for the project info column given project info.
    categorizedProjects = this.props.projects.filter(project => project.projectCategory === categoryToFind)
    // console.log('Found matching project categories:', categorizedProjects)
    return categorizedProjects
  }

  render () {
    // Do not render unless the component has categories to go through.
    if (this.state.categories.length === 0) { return <div /> }

    return (
      this.state.categories.map((category, index) =>
        (
          <div key={`categoryContainer${index}`} className='p-0 m-0' id={`categoryContainer${index}`}>
            <div className='container p-0 m-0 project-category-identifier'>
              <div className='row p-0 m-0' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                <div className='col-6 text-left p-0 m-0'>
                  <p><b>Project Type: {category}</b></p>
                </div>

                <div className='col-6 text-right p-0 m-0'>
                  <button
                    className='categoryContainer category-collapse-button p-0 m-0' data-toggle='collapse'
                    data-target={`.project-category-${index}`}
                    aria-expanded='true' aria-controls='collapse'
                  >
                    <b>Toggle Category</b>
                  </button>
                </div>
              </div>
            </div>
            {
              this.createCategorizedProjectsJSON(category).map(project => {
                return (
                  <CSSTransition
                    in={true}
                    appear={true}
                    key={project.projectID}
                    timeout={1500}
                    classNames="defaultTransition"
                  >
                    <ProjectCard
                      key={project.projectID}
                      categoryIndex={index.toString()}
                      project={project}
                    />
                  </CSSTransition>
                )
              })
            }
          </div>
        )
      )
    )
  }
}

// PropTypes
ProjectCategories.propTypes = {
  projects: PropTypes.array.isRequired
}
