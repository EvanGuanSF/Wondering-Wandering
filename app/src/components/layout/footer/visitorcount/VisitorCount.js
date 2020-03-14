// NPM modules
import React, { Component } from 'react'

export default class VisitorCount extends Component {
  state = {
    visitorCount: 0
  }

  render() {
    if (this.state.visitorCount === 0) {
      window.fetch('/getVisitorCount')
        // Unwrap response.
        .then(fetchResponse => fetchResponse.json())
        // Access and store response.
        .then(visitorCountResponse => {
          this.setState({ visitorCount: visitorCountResponse[0].visitorCount })
        })
      return null
    } else {
      return (
        <div className='col grow justify-content-right text-right' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <p id='uniqueVisitorsCounter' style={{ verticalAlign: 'middle' }}>Unique Visitors: {this.state.visitorCount}</p>
        </div>
      )
    }
  }
}
