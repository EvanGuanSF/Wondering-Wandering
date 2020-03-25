// NPM modules
import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

// Contexts
import PortfolioContext from '../../../../context/PortfolioState'

// CSS
import './DetailContent.css'

export default class DetailContent extends Component {
  static contextType = PortfolioContext

  constructor (props) {
    super(props)

    this.state = {
      aboutMeHTML: [],
      currentDetails: []
    }

    this.getAboutMe()
  }

  componentWillUnmount () {
    // Cancel requests.
    if (this.cancelRequests !== null) {
      this.cancelRequests()
    }
  }

  getAboutMe = () => {
    // Get and set AboutMe html.
    axios.get('/AboutMe.txt', {
      cancelToken: new axios.CancelToken ((executorC) => {
        this.cancelRequests = executorC
      })
    })
      .then(aboutTextResponse => {
        // console.log('About text', aboutTextResponse.data)
        this.setState({ aboutMeHTML: aboutTextResponse.data, currentDetails: aboutTextResponse.data })
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err)
        }
      })
  }

  // Creates the media element html given a file name and its extension and
  // also the type of element (in a card or in the details column).
  createMediaElementWithFileName = (fileName, elementType) => {
    var fileExt = fileName.split('.').pop()
    var filePath = 'img\\' + fileName
    var mediaContentHTML = ''

    // Image case.
    if (fileExt === 'jpg' ||
        fileExt === 'jpeg' ||
        fileExt === 'png' ||
        fileExt === 'bmp' ||
        fileExt === 'svg' ||
        fileExt === 'webp' ||
        fileExt === 'apng' ||
        fileExt === 'gif') {
      if (elementType === 'normalCard') {
        mediaContentHTML =
          '<img src=\'' + filePath + '\' class=\'card-img-top justify-content-center text-center p-0 m-0\'>'
      } else if (elementType === 'largeCard') {
        mediaContentHTML =
          '<img src=\'' + filePath + '\' class=\'card-img-top-large justify-content-center text-center p-0 m-0\'>'
      }
    }
    // Video case.
    else if (fileExt === 'mp4' ||
            fileExt === 'webm') {
      mediaContentHTML =
        '<video src=\'' + filePath + '\' class=\'justify-content-center text-center p-0 m-0\' ' +
        '\' type=\'video\' autoplay=\'true\' loop=\'true\' muted=\'true\'>'
    }

    return mediaContentHTML
  }

  render () {
    if (this.props.projects === null) {
      return <div />
    } else if (this.context.state.focusedProjectID === 0) {
      return (<div dangerouslySetInnerHTML={{ __html: this.state.aboutMeHTML }} />)
    } else {
      const project = this.props.projects.filter(project => this.context.state.focusedProjectID === project.projectID)[0]
      var primaryImageHTML = this.createMediaElementWithFileName(project.projectImage, 'largeCard')
      // Create the secondary image/video if necessary.
      var secondaryImageHTML
      if (project.projectSecondaryImage) {
        secondaryImageHTML = this.createMediaElementWithFileName(project.projectSecondaryImage, 'normalCard')
      } else {
        secondaryImageHTML = ''
      }
      // Format the roles output.
      var projectRoles = project.projectRole.replace(/^/g, '\t• ').replace(/;/g, ';\t• ').replace(/;/g, '<br />')
      // Format the project technologies output.
      var projectLanguagesAndTechnologies = project.projectLanguagesAndTechnologies.replace(/^/g, '\t• ').replace(/;/g, ';\t• ').replace(/;/g, '<br />')

      // Format the html for the project's primary source link html elements.
      // If the link doesn't exist, then we don't show a link.
      var primaryURLHTML = ''
      if (project.projectURL !== '' && project.projectURL != null) {
        primaryURLHTML =
          '<a href=\'' + project.projectURL + '\' target=\'_blank\'><b>Repository</b></a>'
      } else {
        primaryURLHTML =
          '<p>Repository is Private</p>'
      }
      // Format the html for the project's dedicated website link html elements.
      // If the link doesn't exist, then we don't show a link.
      var secondaryURLHTML = ''
      if (project.projectSecondaryURL !== '' && project.projectSecondaryURL != null) {
        secondaryURLHTML =
          '<a href=\'' + project.projectSecondaryURL + '\' target=\'_blank\'><b>Project Website</b></a>' +
          '<br>'
      } else {
        secondaryURLHTML =
          '<p>No Project Website</p>'
      }
      // Format the html for the project's extra info link html elements.
      // If the link doesn't exist, then we don't show a link.
      var tertiaryURLHTML = ''
      if (project.projectTertiaryURL !== '' && project.projectTertiaryURL != null) {
        tertiaryURLHTML =
          '<a href=\'' + project.projectTertiaryURL + '\' target=\'_blank\'><b>More Information</b></a>' +
          '<br>'
      }

      return (
        <div className='card shadow justify-content-center text-center'>
          <div className='container-fluid justify-content-center text-center p-0 m-0'>
            <div className='row p-0 m-0'>

              <div className='col-12 p-0 m-0'>
                <div className='content-grid-unit'>
                  <div dangerouslySetInnerHTML={{ __html: primaryImageHTML }} />
                  <div className='container-fluid' style={{ overflow: 'auto' }}>
                    <b><h1 className='p-0 m-0'>{project.projectName}</h1></b>
                    <br />
                    <p className='text-left p-0 m-0'>{project.projectDetails}</p>
                    <br />
                    <div
                      className='text-left p-0 m-0'
                      style={{ fontSize: '14px' }}
                    >
                      <b>Personal reponsibilities and role(s):</b>
                      <p dangerouslySetInnerHTML={{ __html: projectRoles }} />
                    </div>
                    <br />
                    <div
                      className='text-left p-0 m-0'
                      style={{ fontSize: '14px' }}
                    >
                      <b>Languages and technologies personally used in project:</b>
                      <br />
                      <p dangerouslySetInnerHTML={{ __html: projectLanguagesAndTechnologies }} />
                    </div>
                    <br />
                    <div dangerouslySetInnerHTML={{ __html: secondaryImageHTML }} />
                    <div dangerouslySetInnerHTML={{ __html: secondaryURLHTML }} />
                    <div dangerouslySetInnerHTML={{ __html: tertiaryURLHTML }} />
                    <div dangerouslySetInnerHTML={{ __html: primaryURLHTML }} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )
    }
  }
}

// PropTypes
DetailContent.propTypes = {
  projects: PropTypes.array.isRequired
}
