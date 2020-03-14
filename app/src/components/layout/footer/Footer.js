// NPM modules
import React, { useState } from 'react'

// CSS
import './Footer.css'

export const Footer = () => {
  const [privacyText, setPrivacyText] = useState('')
  const [visitorCount, setVisitorCount] = useState('')

  window.fetch('/PrivacyPolicy.txt')
    // Unwrap response.
    .then(fetchResponse => fetchResponse.text())
    // Access and store response.
    .then(privacyTextResponse => {
      setPrivacyText(privacyTextResponse)
    })
  window.fetch('/getVisitorCount')
    // Unwrap response.
    .then(fetchResponse => fetchResponse.json())
    // Access and store response.
    .then(visitorCountResponse => {
      setVisitorCount(visitorCountResponse[0].visitorCount)
    })

  return (
    <footer id='footer' className='text-center justify-content-center fixed-bottom'>
      <div className='container-fluid'>
        <div className='row'>

          <div className='col grow justify-content-left text-left'>
            <button id='privacyPolicyLink' data-toggle='modal' data-target='#myModal'><b>Privacy Policy</b></button>
          </div>

          <div className='col grow justify-content-center text-center' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <p id='userGreeting' style={{ verticalAlign: 'middle' }} />
          </div>

          <div className='col grow justify-content-right text-right' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <p id='uniqueVisitorsCounter' style={{ verticalAlign: 'middle' }}>Unique Visitors: {visitorCount}</p>
          </div>

        </div>
      </div>

      <div className='modal fade' id='myModal' role='dialog'>
        <div className='modal-dialog modal-dialog-centered'>

          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='modal-title'>Privacy Policy</h4>
              <button type='button' className='close' data-dismiss='modal'>&times;</button>
            </div>
            <div id='privacyPolicyPopup' className='modal-body' dangerouslySetInnerHTML={{ __html: privacyText }} />
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
