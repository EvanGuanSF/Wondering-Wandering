// NPM modules
import React, { useContext } from 'react'

// Contexts
import LayoutContext from '../../../context/LayoutState'

// Components
import PrivacyPolicyPopup from './privacypolicypopup/PrivacyPolicyPopup'
import UserGreeting from './usergreeting/UserGreeting'
// import VisitorCount from './visitorcount/VisitorCount'

// CSS
import './Footer.css'

export const Footer = () => {
  const layoutState = useContext(LayoutContext)

  return (
    <footer
      id='footer'
      className='text-center justify-content-center fixed-bottom'
      onLoad={layoutState.updateUsableDimensions.bind(this)}
    >
      <div className='container-fluid'>
        <div className='row'>

          <PrivacyPolicyPopup />

          <UserGreeting />

          {/* <VisitorCount /> */}

        </div>
      </div>
    </footer>
  )
}

export default Footer
