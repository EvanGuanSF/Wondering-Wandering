// NPM modules
import React from 'react'
import PropTypes from 'prop-types'

// CSS
import './GuestbookCard.css'

export const GuestbookCard = (props) => {
  return (
    <div className='card-bg card comment-card justify-content-center text-center' style={{ backgroundColor: 'var(--khaki)' }}>
      <div className='container-fluid p-0 m-0'>
        <div className='row p-0 m-0'>

          <div className='card-body comment-card-body col-12 p-0 m-0'>
            <b><p className='card-title comment-card-title p-0 m-0'>{props.commentInformation.guestName}</p></b>
            <p className='card-text comment-card-text text-left'>{props.commentInformation.guestComment}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

// PropTypes
GuestbookCard.propTypes = {
  commentInformation: PropTypes.object.isRequired
}

export default GuestbookCard
