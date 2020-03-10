// NPM modules
import React, { Component } from '../../../../node_modules/react'
import { NavLink } from 'react-router-dom'

// CSS
import './Navbar.css'

export class Navbar extends Component {
  state = {
    subtitle: [],
    currentSubtitle: '',
    subtitleTargetColor: '0xF2EFE9',
    subtitleShowingTime: 15,
    resume: []
  }

  /**
   * Constructor for the navbar.
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
        this.setState({ currentSubtitle: '' }, () => {
          
        })
        const res = await fetch('/getRandomSubtitle')
          // Unwrap response.
          .then(fetchResponse => fetchResponse.json())
          // Access and store response.
          .then(subtitleResponse => {
            console.log('subtitle set.')
            this.setState({ subtitle: subtitleResponse[0].subtitle })
          })
          .then(() => {
            this.writeSubtitle()
          })
      }, subtitleShowingTime * 1000)
    } catch(e) {
      console.log(e);
    }
  }

  async writeSubtitle () {
    const subtitleShowingTime = this.state.subtitleShowingTime
    try {
      // Destructure the subtitle.
      var subtitle = this.state.subtitle
      // Calculate the time needed to write every subtitle letter.
      var secondsToWriteSubtitle = subtitleShowingTime / 5
      var timeBetweenLetters = secondsToWriteSubtitle / subtitle.length

      for (var i = 0; i < subtitle.length; i++) {
        const letter = subtitle[i]
        await new Promise(r => setTimeout(r, timeBetweenLetters * 1000))
        this.setState({ currentSubtitle: this.state.currentSubtitle + letter })
      }
    } catch (error) {
      console.log(error);
    }
  }

  render () {
    return (
      <nav id='navbar' className='navbar navbar-expand-md navbar-dark sticky-top ml-auto shadow'>
        <NavLink  
          exact to='/' 
          className='navbar-brand'
          activeStyle={{
            color: 'var(--whiteish)',
            textDecoration: 'underline'
          }}
          style={{
            fontWeight: "bold",
            color: 'var(--blackish)'
          }}
        >Wondering Wandering</NavLink>
        <div id='subtitle' className='navbar-text'>{this.state.currentSubtitle}</div>

        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <span className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <a className='navbar-link' rel='noreferrer noopener external' href='/files/resume.pdf' target='_blank'><b>Resume</b></a>
              <label />
              <NavLink  
                exact to='/guestbook' 
                className='navbar-link'
                activeStyle={{
                  color: 'var(--whiteish)',
                  textDecoration: 'underline'
                }}
                style={{
                  fontWeight: "bold",
                  color: 'var(--blackish)'
                }}
              >Guestbook</NavLink>
              <label />
              {/* <button className='navbar-link' onClick={this.props.setIsShowingAboutMe.bind(this, true)}><b>About Me</b></button> */}
              <NavLink  
                exact to='/' 
                className='navbar-link'
                onClick={(clickEvent) => {
                  // Prevent redirect if already on the homepage.
                  if (window.location.pathname === '/') {
                    clickEvent.preventDefault()
                    this.props.setIsShowingAboutMe(true)
                  }
                }}
                style={{
                  fontWeight: "bold",
                  color: 'var(--blackish)'
                }}
              >About Me</NavLink>
            </li>
          </span>
        </div>
      </nav>
    )
  }
}

export default Navbar
