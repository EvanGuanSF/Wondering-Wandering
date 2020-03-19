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
    // Add event listeners to check whether or not the tab has focus.
    // If the tab does not have focus, then the subtitle animation should pause.
    document.addEventListener('visibilitychange', this.handleActivity)
    document.addEventListener('blur', () => this.handleActivity(false))
    window.addEventListener('blur', () => this.handleActivity(false))
    window.addEventListener('focus', () => this.handleActivity(true))
    document.addEventListener('focus', () => this.handleActivity(true))

    // Update the subtitle on a set interval.
    this.getNewSubtitle()
  }

  componentWillUnmount () {
    clearInterval(this.loadNewSubtitleInterval)
    clearInterval(this.writeSubtitleInterval)

    window.removeEventListener('blur', this.handleActivity)
    document.removeEventListener('blur', this.handleActivity)
    window.removeEventListener('focus', this.handleActivity)
    document.removeEventListener('focus', this.handleActivity)
    document.removeEventListener('visibilitychange', this.handleActivity)
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
        if(this.state.windowIsActive) {
          this.setState({ currentDisplayedSubtitle: '' })
          await fetch('/getRandomSubtitle')
            // Unwrap response.
            .then(fetchResponse => fetchResponse.json())
            // Access and store response.
            .then(subtitleResponse => {
              if(this.state.windowIsActive) {
                console.log('Setting new subtitle to state.')
                this.setState({ subtitle: subtitleResponse[0].subtitle }, () => {
                  // Write out the subtitle to the component state.
                  this.writeSubtitle()
                })
              }
            })
        }
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
    console.log(subtitle, subtitle.length)
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
        } else if (this.state.windowIsActive) {
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
        } else if (!this.state.windowIsActive) {
          i--
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
