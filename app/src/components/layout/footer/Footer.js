// NPM modules
import React from 'react'

// Components
import PrivacyPolicyPopup from './privacypolicypopup/PrivacyPolicyPopup'
import VisitorCount from './visitorcount/VisitorCount'

// CSS
import './Footer.css'

export const Footer = () => {
  return (
    <footer id='footer' className='text-center justify-content-center fixed-bottom'>
      <div className='container-fluid'>
        <div className='row'>

          <PrivacyPolicyPopup />

          <div className='col grow justify-content-center text-center' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <p id='userGreeting' style={{ verticalAlign: 'middle' }} />
          </div>

          <VisitorCount />

        </div>
      </div>
    </footer>
  )
}

export default Footer
