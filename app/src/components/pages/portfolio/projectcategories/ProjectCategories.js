import React, { Component } from 'react'
import './ProjectCategories.css'
import PropTypes from 'prop-types'

class ProjectCategories extends Component {
  render () {
    const projects = this.props.projects
    // console.log('Making project card for: ', project)

    const cardBackgroundColor = {
      backgroundColor: 'var(--whiteish)'
    }

    return (
      <div
        key={projects.projectID} id={projects.projectID}
        className={`collapse show card-bg card shadow justify-content-center text-center ${projects.projectCategory}`}
        style={cardBackgroundColor}
      >

        <div className='container-fluid p-0 m-0'>
          <div className='row p-0 m-0 content-col-row'>

            <div className='col-6 p-0 m-0'>
              <div className='content-grid-unit'>
                <img alt={projects.projectName} src={`/img/${projects.projectImage}`} className='card-img-top justify-content-center text-center p-0 m-0' />
              </div>
            </div>

            <div className='card-body col-6 p-0 m-0'>
              <b><p className='card-title p-0 m-0'> {projects.projectName} </p></b>
              <p className='card-text text-lef'> {projects.projectDetails} </p>
              <b><p className='card-title p-0 m-0'>Click this card for more details</p></b>
            </div>

          </div>
        </div>

      </div>
    )
  }
}

// PropTypes
ProjectCategories.propTypes = {
  projects: PropTypes.object.isRequired
}

export default ProjectCategories
