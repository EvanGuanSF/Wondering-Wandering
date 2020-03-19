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
        className={`collapse card show card-bg project-card shadow justify-content-center text-center project-category-${props.categoryIndex}`}
        style={{ backgroundColor: 'var(--whiteish)' }}
        onClick={() => {
          props.showCardDetails(project.projectID)
          props.highlightCard(project.projectID)
          portfolioState.setIsShowingAboutMe(false)
          portfolioState.setFocusedProjectID(project.projectID)
        }}
      >

        <div className='container-fluid p-0 m-0'>
          <div className='row p-0 m-0 content-col-row'>

            <div className='col-6 p-0 m-0'>
              <div className='content-grid-unit'>
                <img
                  alt={project.projectName}
                  src={`/img/${project.projectImage}`}
                  className='card-img-top project-card-image justify-content-center text-center p-0 m-0'
                  referrerPolicy='no-referrer'
                />
              </div>
            </div>

            <div className='card-body project-card-body col-6 p-0 m-0'>
              <p className='card-title project-card-title p-0 m-0'><b>{project.projectName}</b> </p>
              <p className='card-text project-card-text text-lef'>{project.projectDetails}</p>
              <p className='card-title project-card-title p-0 m-0'><b>Click this card for more details</b></p>
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
