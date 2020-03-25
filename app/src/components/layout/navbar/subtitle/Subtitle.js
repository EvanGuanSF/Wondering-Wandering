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
      subtitleShowingTime: 10,
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
    const subtitleShowingTime = this.state.subtitleShowingTime
    try {
      this.loadNewSubtitleInterval = setInterval(async () => {
        this.setState({ currentDisplayedSubtitle: '' })
        axios.get('/api/getRandomSubtitle', {
          cancelToken: new axios.CancelToken((executorC) => {
            this.cancelRequests = executorC
          })
        })
          // Access and store response.
          .then(subtitleResponse => {
            this.setState({ subtitle: subtitleResponse.data[0].subtitle }, () => {
              // console.log('Subtitle:', this.state.subtitle)
              // Write out the subtitle to the component state.
              clearInterval(this.writeCurSubtitleInterval)
              this.writeSubtitle()
            })
          })
          .catch(err => {
            if (!axios.isCancel(err)) {
              console.log(err)
            }
          })
      }, subtitleShowingTime * 1000)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Writes the subtitle to the state, one character at a time on a timer.
   */
  async writeSubtitle () {
    const subtitleShowingTime = this.state.subtitleShowingTime

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
          return null
        }
        if (character === ' ') {
          while (character === ' ') {
            this.setState({ currentDisplayedSubtitle: this.state.currentDisplayedSubtitle + character })
            i++
            character = subtitle[i]
          }
        } else {
          this.setState({ currentDisplayedSubtitle: this.state.currentDisplayedSubtitle + character })
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
