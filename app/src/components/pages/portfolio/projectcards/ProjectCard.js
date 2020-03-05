import React, { Component } from 'react'
import './ProjectCard.css'
import PropTypes from 'prop-types'

class ProjectCard extends Component {
  render () {
    const project = this.props.project
    // console.log('Making project card for: ', project)

    const cardBackgroundColor = {
      backgroundColor: 'var(--whiteish)'
    }

    return (
      <div
        key={project.projectID} id={project.projectID}
        className={`collapse show card-bg card shadow justify-content-center text-center ${project.projectCategory}`}
        style={cardBackgroundColor}
      >

        <div className='container-fluid p-0 m-0'>
          <div className='row p-0 m-0 content-col-row'>

            <div className='col-6 p-0 m-0'>
              <div className='content-grid-unit'>
                <img alt={project.projectName} src={`/img/${project.projectImage}`} className='card-img-top justify-content-center text-center p-0 m-0' />
              </div>
            </div>

            <div className='card-body col-6 p-0 m-0'>
              <b><p className='card-title p-0 m-0'> {project.projectName} </p></b>
              <p className='card-text text-lef'> {project.projectDetails} </p>
              <b><p className='card-title p-0 m-0'>Click this card for more details</p></b>
            </div>

          </div>
        </div>

      </div>
    )
  }
}

// PropTypes
ProjectCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectCard
