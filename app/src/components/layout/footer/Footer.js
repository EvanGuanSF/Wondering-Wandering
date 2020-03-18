// NPM modules
import React from 'react'

// Components
import PrivacyPolicyPopup from './privacypolicypopup/PrivacyPolicyPopup'
import UserGreeting from './usergreeting/UserGreeting'
import VisitorCount from './visitorcount/VisitorCount'

// CSS
import './Footer.css'

export const Footer = () => {
  return (
    <footer id='footer' className='text-center justify-content-center fixed-bottom'>
      <div className='container-fluid'>
        <div className='row'>

          <PrivacyPolicyPopup />

          <UserGreeting />

          <VisitorCount />

        </div>
      </div>
    </footer>
  )
}

export default Footer
