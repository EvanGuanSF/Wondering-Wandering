// NPM modules
import React, { Component } from 'react'

export default class PrivacyPolicyPopup extends Component {
  state = {
    privacyText: ''
  }

  render () {
    if(this.state.privacyText === '') {
      window.fetch('/PrivacyPolicy.txt')
        // Unwrap response.
        .then(fetchResponse => fetchResponse.text())
        // Access and store response.
        .then(privacyTextResponse => {
          this.setState({ privacyText: privacyTextResponse })
        })
      return null
    } else {
      return (
        <div className='col grow justify-content-left text-left'>
          <button id='privacyPolicyLink' data-toggle='modal' data-target='#myModal'><b>Privacy Policy</b></button>
          <div className='modal fade' id='myModal' role='dialog'>
            <div className='modal-dialog modal-dialog-centered'>
    
              <div className='modal-content'>
                <div className='modal-header'>
                  <h4 className='modal-title'>Privacy Policy</h4>
                  <button type='button' className='close' data-dismiss='modal'>&times;</button>
                </div>
                <div id='privacyPolicyPopup' className='modal-body' dangerouslySetInnerHTML={{ __html: this.state.privacyText }} />
              </div>
    
            </div>
          </div>
        </div>
      )
    }
    }
}
