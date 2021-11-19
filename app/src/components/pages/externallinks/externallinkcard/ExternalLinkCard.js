// NPM modules
import React from 'react'
import PropTypes from 'prop-types'

// CSS
import './ExternalLinkCard.css'

export const LinkCard = (props) => {
  return (
      <div
        key={props.linkInformation.id}
        className={`card card-bg link-card shadow justify-content-center text-center`}
        style={{ backgroundColor: 'var(--whiteish)' }}
      >
        <a className='external-link' href={props.linkInformation.link}>
          <div className='row link-card-row p-0 m-0'>

            <div className='col-4 p-0 m-0'>
              <img
                alt={props.linkInformation.text}
                src={`/img/icons/${props.linkInformation.icon}`}
                className='link-card-image'
                referrerPolicy='no-referrer'
              />
            </div>

            <div className='col-8 link-card-body p-0 m-0'>
              <b>
                {props.linkInformation.text}
              </b>
            </div>
            
          </div>
        </a>
      </div>
  )
}

// PropTypes
LinkCard.propTypes = {
  linkInformation: PropTypes.object.isRequired
}

export default LinkCard
