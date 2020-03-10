import React, { Component } from 'react'
import './ProjectCategories.css'
import ProjectCard from '../projectcards/ProjectCard'
import PropTypes from 'prop-types'

class ProjectCategories extends Component {
  state = {
    categories: []
  }

  componentDidMount () {
    this.setUniqueProjectCategoriesState()
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
                  <ProjectCard
                    key={project.projectID}
                    categoryIndex={index.toString()}
                    project={project}
                    highlightCard={this.props.highlightCard}
                    showCardDetails={this.props.showCardDetails}
                    setIsShowingAboutMe={this.props.setIsShowingAboutMe}
                  />
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

export default ProjectCategories
