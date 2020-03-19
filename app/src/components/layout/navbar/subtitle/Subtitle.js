// NPM modules
import React, { Component } from 'react'

// CSS
import './Subtitle.css'

export default class Subtitle extends Component {
  /**
   * Constructor for the subtitle.
   * Fetch static assets.
   * @param {*} props
   */
  constructor (props) {
    super(props)

    var loadNewSubtitleInterval = null
    var writeSubtitleInterval = null

    this.state = {
      subtitle: '',
      currentDisplayedSubtitle: '',
      subtitleShowingTime: 10,
      windowIsActive: true
    }

    // Get and set subtitle.
    window.fetch('/getRandomSubtitle')
      // Unwrap response.
      .then(fetchResponse => fetchResponse.json())
      // Access and store response.
      .then(subtitleResponse => { 
        this.setState({ subtitle: subtitleResponse[0].subtitle })
      })
      .then(() => {
        this.writeSubtitle()
      })
  }

  async componentDidMount () {
    // Update the subtitle on a set interval.
    this.getNewSubtitle()
  }

  componentWillUnmount () {
    clearInterval(this.loadNewSubtitleInterval)
    clearInterval(this.writeSubtitleInterval)
  }
  
  handleActivity = (forcedFlag) => {
    if (typeof forcedFlag === 'boolean') {
      forcedFlag ? this.setState({ windowIsActive: true }) : this.setState({ windowIsActive: false })
    } else {
      document.hidden ? this.setState({ windowIsActive: false }) : this.setState({ windowIsActive: true })
    }
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
        await fetch('/getRandomSubtitle')
          // Unwrap response.
          .then(fetchResponse => fetchResponse.json())
          // Access and store response.
          .then(subtitleResponse => {
            this.setState({ subtitle: subtitleResponse[0].subtitle }, () => {
              // Write out the subtitle to the component state.
              clearInterval(this.writeSubtitleInterval)
              this.writeSubtitle()
            })
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
      this.writeSubtitleInterval = setInterval(async () => {
        var character = subtitle[i]
        // If the character to be added is a space, do not pause before writing it.
        if(i === subtitle.length) {
          return null
        }
        if(character === ' ') {
          while(character === ' ') {
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
