// NPM modules
import React, { useContext } from 'react'
import { useLocation, NavLink, Link } from 'react-router-dom'

// Components
import Subtitle from './subtitle/Subtitle'

// Contexts
import PortfolioContext from '../../../context/PortfolioState'
import LayoutContext from '../../../context/LayoutState'

// CSS
import './Navbar.css'

export const Navbar = () => {
  const portfolioState = useContext(PortfolioContext)
  const layoutState = useContext(LayoutContext)
  const location = useLocation()

  return (
    <nav
      id='navbar'
      className='navbar navbar-expand-md navbar-dark sticky-top ml-auto shadow'
      onChange={layoutState.updateUsableDimensions.bind(this)}
    >
      <div className='row'>
        <div className='col-6'>

          <Link
            end='true'
            to='/'
            className='navbar-brand'
            style={{
              color: 'var(--blackish)',
              fontWeight: 'bold'
            }}
          >Wondering Wandering
          </Link>

          <Subtitle />

        </div>
      </div>

      <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon' />
      </button>

      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <span className='navbar-nav ml-auto'>
          <li className='nav-item'>
            {/*
            <a className='navbar-link' rel='noreferrer noopener external' href='https://www.linkedin.com/in/evan-guan'><i className='fab fa-linkedin' /></a>
            <a className='navbar-link' rel='noreferrer noopener external' href='https://twitter.com/EvanGuanSF'><i className='fab fa-twitter-square' /></a>
            <a className='navbar-link' rel='noreferrer noopener external' href='https://github.com/JammyPajamies'><i className='fab fa-github' /></a>
            */}
            
            <a className='navbar-link' rel='noreferrer noopener external' href='/files/resume.pdf'><b>Resume</b></a>

            <NavLink
              end='true'
              to='/external-links'
              className='navbar-link'
              style={{
                color: 'var(--blackish)',
                fontWeight: 'bold'
              }}
            >Links
            </NavLink>
            
            <NavLink
              end='true'
              to='/pi-data-charts'
              className='navbar-link'
              style={{
                color: 'var(--blackish)',
                fontWeight: 'bold'
              }}
            >Pi Data Charts
            </NavLink>

            <NavLink
              end='true'
              to='/guestbook'
              className='navbar-link'
              style={{
                color: 'var(--blackish)',
                fontWeight: 'bold'
              }}
            >Guestbook
            </NavLink>

            <NavLink
              end='true'
              to='/'
              caseSensitive
              end
              className='navbar-link'
              onClick={(clickEvent) => {
                // Prevent redirect if already on the homepage.
                if (window.location.pathname === '/') {
                  clickEvent.preventDefault()
                  portfolioState.setFocusedProjectID(0)
                  portfolioState.setIsShowingAboutMe(true)
                }
              }}
              style={{
                color: 'var(--blackish)',
                fontWeight: 'bold'
              }}
            >{location.pathname === '/' ? 'About Me' : 'Home'}
            </NavLink>

          </li>
        </span>
      </div>
    </nav>
  )
}

export default Navbar
