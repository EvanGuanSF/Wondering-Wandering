// NPM modules
import React from 'react'
import PropTypes from 'prop-types'

// CSS
import './ExternalLinkCard.css'

export const GuestbookCard = (props) => {
  return (
    <div className='card-bg card link-card justify-content-center text-center' style={{ backgroundColor: 'var(--khaki)' }}>
      <div className='container-fluid p-0 m-0'>
        <div className='row p-0 m-0'>

          <div className='card-body link-card-body col-12 p-0 m-0'>
            <b>
              <a href={props.linkInformation.link}>{props.linkInformation.text}</a>
            </b>
          </div>

        </div>
      </div>
    </div>
  )
}

// PropTypes
GuestbookCard.propTypes = {
  linkInformation: PropTypes.object.isRequired
}

export default GuestbookCard
