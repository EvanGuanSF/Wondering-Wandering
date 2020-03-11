// NPM modules
import React, { Component } from 'react'

// CSS
import './Subtitle.css'

export default class Subtitle extends Component {
  state = {
    subtitle: '',
    currentDisplayedSubtitle: '',
    subtitleShowingTime: 10
  }

  /**
   * Constructor for the subtitle.
   * Fetch static assets.
   * @param {*} props
   */
  constructor (props) {
    super(props)
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

  async componentDidMount() {
    // Update the subtitle on a set interval.
    const subtitleShowingTime = this.state.subtitleShowingTime
    try {
      setInterval(async () => {
        this.setState({ currentDisplayedSubtitle: '' })
        await fetch('/getRandomSubtitle')
          // Unwrap response.
          .then(fetchResponse => fetchResponse.json())
          // Access and store response.
          .then(subtitleResponse => {
            this.setState({ subtitle: subtitleResponse[0].subtitle })
          })
          // Write out the subtitle to the component state.
          .then(() => {
            this.writeSubtitle()
          })
      }, subtitleShowingTime * 1000)
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * Writes the subtitle to the state, one character at a time on a timer.
   */
  async writeSubtitle () {
    const subtitleShowingTime = this.state.subtitleShowingTime
    try {
      // Destructure the subtitle.
      var subtitle = this.state.subtitle
      // Calculate the time needed to write every subtitle letter.
      var secondsToWriteSubtitle = subtitleShowingTime / 5
      var timeBetweenLetters = secondsToWriteSubtitle / subtitle.length

      for (var i = 0; i < subtitle.length; i++) {
        const character = subtitle[i]
        // If the character to be added is a space, do not pause before writing it.
        if (character !== ' ') {
          await new Promise(r => setTimeout(r, timeBetweenLetters * 1000))
        }
        this.setState({ currentDisplayedSubtitle: this.state.currentDisplayedSubtitle + character })
      }
    } catch (error) {
      console.log(error);
    }
  }

  render () {
    return (
      <div id='subtitle' className=''>{this.state.currentDisplayedSubtitle}</div>
    )
  }
}
