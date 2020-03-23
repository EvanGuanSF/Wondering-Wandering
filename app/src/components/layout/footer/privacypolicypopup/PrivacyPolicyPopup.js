// NPM modules
import React, { Component } from 'react'
import axios from 'axios'

// CSS
import './PrivacyPolicyPopup.css'

export default class PrivacyPolicyPopup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      privacyText: ''
    }

    this.getVisitorCount()
  }

  componentWillUnmount () {
    // Cancel requests.
    if (this.cancelRequests !== null) {
      this.cancelRequests()
    }
  }

  getVisitorCount = () => {
    axios.get('/PrivacyPolicy.txt', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
      // Unwrap response.
      // .then(fetchResponse => fetchResponse.text())
      // Access and store response.
      .then(privacyTextResponse => {
        // console.log('Privacy text:', privacyTextResponse.data)
        this.setState({ privacyText: privacyTextResponse.data })
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
        }
      })
  }

  render () {
    if (this.state.privacyText === '') {
      return null
    } else {
      return (
        <div className='col grow justify-content-left text-left'>
          <button id='privacyPolicyLink' data-toggle='modal' data-target='#privacyModal'><b>Privacy Policy</b></button>
          <div className='modal fade' id='privacyModal' role='dialog'>
            <div className='modal-dialog modal-dialog-centered'>

              <div id='privacyPolicyPopup' className='modal-content'>
                <div className='modal-header'>
                  <h4 className='modal-title'>Privacy Policy</h4>
                  <button type='button' className='close' data-dismiss='modal'>&times;</button>
                </div>
                <div className='modal-body' dangerouslySetInnerHTML={{ __html: this.state.privacyText }} />
              </div>

            </div>
          </div>
        </div>
      )
    }
  }
}
