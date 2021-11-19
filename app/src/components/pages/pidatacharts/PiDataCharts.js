// NPM modules
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'

// Components
import DigitalHumidityAndTemperatureChart from './sensorcharts/DigitalHumidityAndTemperatureChart'

// Contexts

// CSS
import './PiDataCharts.css'

export default class PiDataCharts extends Component {
  constructor (props) {
    super(props)

    this.state = {
      usableHeight: 0,
      usableWidth: 0
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    // Cancel requests.
    if (this.cancelRequests !== null) {
      this.cancelRequests()
    }
  }

  render () {
    return (
      <CSSTransition
        in={true}
        appear={true}
        timeout={1500}
        classNames="defaultTransition"
      >
        <div className='row p-0 m-0'>
          {/* <!--- Padding column ---> */}
          <div className='col-1 justify-content-center text-center p-0 m-0' />

          {/* <!--- Primary column ---> */}
          <div className='col-10 justify-content-center text-center p-0 m-0'>
            <br />
            <h1>RaspberryPi Sensor Data</h1>
            <hr />

            <h5>Temperature and Humidity (24 hours)</h5>
            <DigitalHumidityAndTemperatureChart />
            <hr />

          </div>

          {/* <!--- Padding column ---> */}
          <div className='col-1 justify-content-center text-center p-0 m-0' />

        </div>
      </CSSTransition>
    )
  }
}
