// NPM modules
import React from 'react'
import PropTypes from 'prop-types'

// CSS
import './ExternalLinkCard.css'

export const LinkCard = (props) => {
  return (
    <b className='card link-card justify-content-center text-center' style={{ backgroundColor: 'var(--whiteish)' }}>
      <a href={props.linkInformation.link}>{props.linkInformation.text}</a>
    </b>
  )
}

// PropTypes
LinkCard.propTypes = {
  linkInformation: PropTypes.object.isRequired
}

export default LinkCard
