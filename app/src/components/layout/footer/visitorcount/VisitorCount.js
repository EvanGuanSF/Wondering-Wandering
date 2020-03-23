// NPM modules
import React, { Component } from 'react'
import axios from 'axios'

export default class VisitorCount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visitorCount: 0
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
    axios.get('/getVisitorCount', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
      // Access and store response.
      .then(visitorCountResponse => {
        // console.log('Visitor count:', visitorCountResponse.data[0].visitorCount)
        this.setState({ visitorCount: visitorCountResponse.data[0].visitorCount })
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
        }
      })
  }

  render () {
    if (this.state.visitorCount === 0) {
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
