import React, { Component } from '../../../../node_modules/react'
import './Navbar.css'

export class Navbar extends Component {
  state = {
    subtitle: [],
    resume: []
  }

  componentDidMount () {
    console.log('Getting navbar subtitle...')
    window.fetch('/getRandomSubtitle')
      // Unwrap response.
      .then(fetchResponse => fetchResponse.json())
      // Access and store response.
      .then(subtitleResponse => {
        this.setState({ subtitle: subtitleResponse[0].subtitle })
      })
  }

  render () {
    return (
      <nav id='navbar' className='navbar navbar-expand-md navbar-dark sticky-top ml-auto shadow'>
        <button id='' className='navbar-link navbar-brand'><b>Wondering Wandering</b></button>
        <div id='subtitle' className='navbar-text'>{this.state.subtitle}</div>

        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <span className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <a className='navbar-link' rel='noreferrer noopener external' href='/files/resume.pdf' target='_blank'><b>Resume</b></a>
              <label />
              <button className='navbar-link'><b>Guestbook</b></button>
              <label />
              <button className='navbar-link'><b>About Me</b></button>
            </li>
          </span>
        </div>
      </nav>
    )
  }
}

export default Navbar
