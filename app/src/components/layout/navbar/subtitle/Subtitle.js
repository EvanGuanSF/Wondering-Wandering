// NPM modules
import React, { Component } from 'react'
import axios from 'axios'

// CSS
import './Subtitle.css'

export default class Subtitle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      subtitle: '',
      currentDisplayedSubtitle: '',
      subtitleShowingTimeSeconds: 10,
      windowIsActive: true
    }

    this.getInitialSubtitle()
  }

  async componentDidMount () {
    // Update the subtitle on a set interval.
    this.getNewSubtitle()
  }

  componentWillUnmount () {
    // Clear the wait intervals using the refs we made in the constructor.
    clearInterval(this.loadNewSubtitleInterval)
    clearInterval(this.writeCurSubtitleInterval)

    // Cancel requests.
    if (this.cancelRequests !== null) {
      this.cancelRequests()
    }
  }

  async getInitialSubtitle () {
    // Get and set subtitle.
    axios.get('/api/getRandomSubtitle', {
      cancelToken: new axios.CancelToken((executorC) => {
        this.cancelRequests = executorC
      })
    })
    // Access and store response.
    .then(subtitleResponse => {
      this.setState({ subtitle: subtitleResponse.data[0].subtitle }, () => {
        // console.log('Subtitle:', this.state.subtitle)
      })
    })
    .then(() => {
      this.writeSubtitle()
    })
    .catch(err => {
      if (!axios.isCancel(err)) {
        console.log(err)
      }
    })
  }

  /**
   * Gets a new subtitle on a timer.
   */
  async getNewSubtitle () {
    // Update the subtitle on a set interval.
    const subtitleShowingTime = this.state.subtitleShowingTimeSeconds
    // console.log(`${new Date().toLocaleTimeString()}: Getting new subtitle`)
    try {
      this.loadNewSubtitleInterval = setInterval(async () => {
        do {
          var newSubtitleFound = false
          await axios.get('/api/getRandomSubtitle', {
            cancelToken: new axios.CancelToken((executorC) => {
              this.cancelRequests = executorC
            })
          })
          // Access and store response.
          .then(subtitleResponse => {
            if(this.state.subtitle != subtitleResponse.data[0].subtitle) {
              this.setState({ currentDisplayedSubtitle: '' })
              // console.log(`${new Date().toLocaleTimeString()}: New subtitle: ${subtitleResponse.data[0].subtitle}`)
              this.setState({ subtitle: subtitleResponse.data[0].subtitle }, () => {
                // Write out the subtitle to the component state.
                clearInterval(this.writeCurSubtitleInterval)
                this.writeSubtitle()
              })
              // console.log(`${new Date().toLocaleTimeString()}: New subtitle: ${this.state.subtitle}`)
              newSubtitleFound = true
            } else {
              // console.log(`${new Date().toLocaleTimeString()}: Subtitles are the same: ${subtitleResponse.data[0].subtitle} == ${this.state.subtitle}`)
            }
          })
          .catch(err => {
            if (!axios.isCancel(err)) {
              console.log(err)
            }
          })
        } while (!newSubtitleFound)
      }, subtitleShowingTime * 1000)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Writes the subtitle to the state, one character at a time on a timer.
   */
  async writeSubtitle () {
    const subtitleShowingTime = this.state.subtitleShowingTimeSeconds

    // Destructure the subtitle.
    var subtitle = this.state.subtitle
    // Calculate the time needed to write every subtitle letter.
    var secondsToWriteSubtitle = subtitleShowingTime / 5
    var timeBetweenLetters = secondsToWriteSubtitle / subtitle.length
    var i = 0

    try {
      this.writeCurSubtitleInterval = setInterval(async () => {
        var character = subtitle[i]
        // If the character to be added is a space, do not pause before writing it.
        if (i === subtitle.length) {
          this.setState({ currentDisplayedSubtitle: subtitle.substr(0, subtitle.length) })
          return null
        }
        if (character === ' ') {
          while (character === ' ') {
            i++
            character = subtitle[i]
          }
          this.setState({ currentDisplayedSubtitle: subtitle.substr(0, i) })
        } else {
          this.setState({ currentDisplayedSubtitle: subtitle.substr(0, i) })
          i++
        }
      }, timeBetweenLetters * 1000)
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (
      <div id='subtitle' className=''>{this.state.currentDisplayedSubtitle}</div>
    )
  }
}
