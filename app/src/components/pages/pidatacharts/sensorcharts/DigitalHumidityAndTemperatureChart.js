// NPM modules
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

// CSS
import './DigitalHumidityAndTemperatureChart.css'

function formatDateTimeForChart(dateTimeString) {
  const now = new Date(dateTimeString);
  // console.log(`${now.toDateString()}`)
  // console.log(`${now.toISOString()}`)
  // console.log(`${now.toLocaleDateString()}`)
  // console.log(`${now.toLocaleString()}`)
  // console.log(`${now.toLocaleString().split(' ', 1)[1]}`)
  // console.log(`${now.toLocaleTimeString()}`)
  // console.log(`${now.toTimeString()}`)
  // console.log(`${now.toUTCString()}`)
  // console.log(`\n`)
  // console.log(`${now} - ${now.toLocaleTimeString()} - ${now.valueOf()}`)
  return now.toLocaleTimeString().replace(':00 ', '')
}

const DHTToolTip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const now = new Date(label);
    return (
      <div className="dhtTooltip">
        <b className="sampleDateString">{now.toDateString()} {now.toLocaleTimeString().replace(':00 ', ' ')}</b>
        <br/>
        <b className="humidity">{payload[0].payload.relative_humidity.toFixed(1)}% Humidity</b>
        <br/>
        <b className="temperature">{payload[0].payload.temperature_c.toFixed(1)}°C ({(payload[0].payload.temperature_c * 9 / 5 + 32).toFixed(1)}°F)</b>
        <br/>
      </div>
    )
  }

  return null;
}

export default class DigitalHumidityAndTemperatureChart extends Component {
  constructor (props) {
    super(props)

    this.state = {
      piTempHumData: null
    }

    // Get and set sensor information.
    this.getSensorData()
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    // Cancel requests.
    if (this.cancelRequests !== null) {
      this.cancelRequests()
    }
  }

  /**
   * Gets the sensor information.
   */
  getSensorData = () => {
    // Get and set dht sensor data.
    axios.get('/api/piGetTempHumData', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
    .then(piTempHumDataResponse => {
      for(var i = 0; i < piTempHumDataResponse.data.length; i ++)
        piTempHumDataResponse.data[i].timestamp = new Date(piTempHumDataResponse.data[i].timestamp).valueOf()

      this.setState({ piTempHumData: piTempHumDataResponse.data })
    })
    .catch(err => {
      if (!axios.isCancel(err)) {
        console.log(err)
      }
    })
  }

  render () {
    if (this.state.piTempHumData === null || this.state.piTempHumData === undefined) { return <div /> }
    const piTempHumInformation = this.state.piTempHumData

    return (
      <ResponsiveContainer 
        width='100%'
        height='75%'
        minWidth='750'
        minHeight='200'
      >
        <LineChart
        className='dht-chart'
          data={this.state.piTempHumData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 15,
          }}
        >
          <CartesianGrid strokeDasharray='4 2' />
          <XAxis 
            dataKey='timestamp'
            type='number'
            domain={['dataMin', 'dataMax']}
            tickCount='10'
            scale='time'
            tickSize='5'
            tickFormatter={formatDateTimeForChart}>
            <Label offset={0} position="bottom">
              (Adjusted for local time)
            </Label>
          </XAxis>
          <YAxis
            tickCount='10'
          />
          <Tooltip content={<DHTToolTip />} />
          {/* <Tooltip /> */}
          <Legend
            className='dht-legend'
            verticalAlign='top'
          />
          <Line
            className='temperature-chart-line'
            type='monotone'
            dot={false}
            dataKey='temperature_c'
            name='Celsius'
            stroke='var(--tempColor)'
            activeDot={{ className: 'temperature-active-dot' }}
          />
          <Line
            className='humidity-chart-line'
            type='monotone'
            dot={false}
            dataKey='relative_humidity'
            name='Humidity'
            stroke='var(--humColor)'
            activeDot={{ className: 'humidity-active-dot' }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}