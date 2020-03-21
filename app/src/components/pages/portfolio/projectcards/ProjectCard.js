// NPM modules
import React, { useContext } from 'react'
import './ProjectCard.css'
import PropTypes from 'prop-types'

// Contexts
import PortfolioContext from '../../../../context/PortfolioState'

export const ProjectCard = (props) => {
  const project = props.project
  const portfolioState = useContext(PortfolioContext)

  // Do not render unless the component has projects to go through.
  if (project === undefined) {
    return <div />
  } else {
    return (
      <div
        key={project.projectID} id={`card-${project.projectID}`}
        className={`collapse show card card-bg project-card shadow justify-content-center text-center project-category-${props.categoryIndex}`}
        style={{ backgroundColor: 'var(--whiteish)' }}
        onClick={() => {
          props.showCardDetails(project.projectID)
          props.highlightCard(project.projectID)
          portfolioState.setIsShowingAboutMe(false)
          portfolioState.setFocusedProjectID(project.projectID)
        }}
      >

        <div className='container-fluid p-0 m-0'>
          <div className='row content-col-row p-0 m-0'>

            <div className='col-6 p-0 m-0'>
              <div className='content-grid-unit'>
                <img
                  alt={project.projectName}
                  src={`/img/${project.projectImage}`}
                  className='card-img-top project-card-image p-0 m-0'
                  referrerPolicy='no-referrer'
                />
              </div>
            </div>

            <div className='project-card-body col-6 p-0 m-0'>

              <div className='project-card-banner-container'>
                <p className='project-card-banner-text'>{project.projectName}</p>
              </div>
              <div className='project-card-text-container'>
                <p className='project-card-text vertical-center'>{project.projectSummary.length > 400 ? project.projectSummary.substring(0, 50).trim() + '...' : project.projectSummary}</p>
              </div>
              <div className='project-card-banner-container'>
                <div className='project-card-banner-text'>
                  <p>Click this card for details</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    )
  }
}

// PropTypes
ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  categoryIndex: PropTypes.string.isRequired
}

export default ProjectCard
