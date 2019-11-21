// Variables for viewable screen pixel dimensions.
var winWidth = $(this).outerWidth()
var winHeight = $(this).outerHeight()
var navbarHeight = $('#navbar').outerHeight()

var previouslyClickedCardID = 0


// This funtion calculates and returns the pixel offset of the navbar and footer.
function getHeaderAndFooterDisplacements() {
  this.winHeight = $(this).outerHeight()
  this.navbarHeight = $('#navbar').outerHeight()

  return (this.winHeight - this.navbarHeight)
}

// This function adjusts the layout of the content based on height and orientation.
function setContainerHeight() {
  $('#scrollable-col').css({
    'height': getHeaderAndFooterDisplacements() + 'px'
  })
  $('#scrollable-col').css({
    'width': $(this).outerWidth() + 'px'
  })
}

// This Listens for all resize events and calls functions for resizing elements.
$(window).on('resize', function(){
  setContainerHeight()
})

// This Listens for all navbarLoadedEvent and calls functions for resizing elements.
$(window).on('navbarLoadedEvent', function(){
  setContainerHeight()
})

// Add ready handlers.
$(document).ready(function() {
  // Click event on the submit button.
  $('#submitButton').click(function () {
    console.log('Submitting comment.')
    event.preventDefault();
    console.log($('#comment-submission-form'))
    var canSubmit = true

    // Go in bottom-up order so we can show the top-most form error first.
    // One-way mechanism, if it gets set to false it stays that way,
    // while still allowing us to run all the tests.
    // if(!isCaptchaValid() && true) {
    //   canSubmit = false
    // }
    // if(!isFileValid() && true) {
    //   canSubmit = false
    // }
    // if(!isCoordValid() && true) {
    //   canSubmit = false
    // }
    // if(!isDetailsValid() && true) {
    //   canSubmit = false
    // }
    // if(!isLocationIDValid() && true) {
    //   canSubmit = false
    // }
    // if(!isCategoryIDValid() && true) {
    //   canSubmit = false
    // }

    // One final check.
    if (canSubmit) {
      $('#comment-submission-form').submit()
    }
  })
})

// Makes a request to the server for card data and creates cards accordingly.
function createProjectCards() {
  var xmlResponse = new XMLHttpRequest()

  // Wait for a response.
  xmlResponse.onreadystatechange = function() {
    if (xmlResponse.readyState == 4 && xmlResponse.status == 200)
    {
      projects = JSON.parse(xmlResponse.response)

      // The path to the media file from the JSON.
      var mediaPath
      // The file extension of the file.
      var mediaType

      projects.forEach((item, index) => {
        // Check the extension of the file and create an
        // image or video element according to that file format.

        var mediaContentHTML = createMediaElementWithFilenName(item.projectImage, 'normalCard')

        $('#cardContainer').append(
          '<div onclick=\'viewProjectDetails(' + item.projectID + '); highlightCard(' + item.projectID + ')\' id=' + item.projectID + ' class=\'card-bg card shadow justify-content-center text-center\' style=\'background-color: var(--whiteish)\'>' +
            '<div class=\'container-fluid p-0 m-0\'>' +
              '<div class=\'row p-0 m-0 content-col-row\'>' +

                '<div class=\'col-6 p-0 m-0\'>' +
                  '<div class=\'content-grid-unit\'>' +
                    mediaContentHTML +
                  '</div>' +
                '</div>' +

                '<div class=\'card-body col-6 p-0 m-0\'>' +
                  '<b><p class=\'card-title p-0 m-0\'>' + item.projectName + '</p></b>' +
                  '<p class=\'card-text text-left\'>' + item.projectDetails + '</p>' +
                  '<b><p class=\'card-title p-0 m-0\'>Click this card for more details</p></b>' +
                '</div>' +

              '</div>' +
            '</div>' +
          '</div>'
        )
      })
    }
  }

  // Send the request for data.
  xmlResponse.open('GET', '/getProjectInfo', true) // true for asynchronous
  xmlResponse.send(null)
}

// Takes a card-click event, scrolls to the map, finds the marker with the same id,
// and triggers a click event to zoom in on it.
function viewProjectDetails(cardID) {
  //If a map exists, highlight the report on the map
  var contentwindow = document.getElementById('map')

  // If the about button is clicked, it will be a special case.
  // We will use the information we saved at the loading of the page to populate the details div.
  if (cardID === 0) {
    $('#detailContents').html(aboutMeString)
  } else {
    // Otherwise, loop through the returned projects JSON and find the marker with given id.
    for(var project of projects) {
      if (project['projectID'] == cardID) {
        // Get the proper media element.
        var mediaContentHTML = createMediaElementWithFilenName(project.projectImage, 'largeCard')
        // Format the roles output.
        var projectRoles = project.projectRole.replace(/^/g, '\t• ').replace(/;/g, ';\t• ').replace(/;/g, '<br>')
        // Format the project technologies output.
        var projectLanguagesAndTechnologies = project.projectLanguagesAndTechnologies.replace(/^/g, '\t• ').replace(/;/g, ';\t• ').replace(/;/g, '<br>')

        // Format the html for the project's primary source link html elements.
        // If the link doesn't exist, then we don't show a link.
        var primaryURLHTML = ''
        if(project.projectURL != '' && project.projectURL != null) {
          primaryURLHTML =
            '<a href=\'' + project.projectURL + '\'><b>Repository</b></a>'
        }
        // Format the html for the project's dedicated website link html elements.
        // If the link doesn't exist, then we don't show a link.
        var secondaryURLHTML = ''
        if(project.projectSecondaryURL != '' && project.projectSecondaryURL != null) {
          secondaryURLHTML =
            '<a href=\'' + project.projectSecondaryURL + '\'><b>Project Website</b></a>' +
            '<br>'
        }
        // Format the html for the project's extra info link html elements.
        // If the link doesn't exist, then we don't show a link.
        var tertiaryURLHTML = ''
        if(project.projectTertiaryURL != '' && project.projectTertiaryURL != null) {
          tertiaryURLHTML =
            '<a href=\'' + project.projectTertiaryURL + '\'><b>More Information</b></a>' +
            '<br>'
        }

        $('#detailContents').html(
          '<div class=\'card shadow justify-content-center text-center\'>' +
            '<div class=\'container-fluid justify-content-center text-center p-0 m-0\'>' +
              '<div class=\'row p-0 m-0\'>' +

                '<div class=\'col-12 p-0 m-0\'>' +
                  '<div class=\'content-grid-unit\'>' +
                    mediaContentHTML +
                    '<div class=\'container-fluid\' style=\'overflow: auto\'>' +
                      '<b><h1 class=\'p-0 m-0\'>' + project.projectName + '</h1></b>' +
                      '<br>' +
                      '<p class=\'text-left p-0 m-0\'>' + project.projectDetails + '</p>' +
                      '<br>' +
                      '<p class=\'text-left p-0 m-0\'><b>Personal reponsibilities and role(s):</b><br>' + projectRoles + '</p>' +
                      '<br>' +
                      '<p class=\'text-left p-0 m-0\'><b>Programming languages and computer technologies personally used in project:</b><br>' + projectLanguagesAndTechnologies + '</p>' +
                      '<br>' +
                      secondaryURLHTML +
                      tertiaryURLHTML +
                      primaryURLHTML +
                    '</div>' +
                  '</div>' +
                '</div>' +

              '</div>' +
            '</div>' +
          '</div>'
        )

        break
      }
    }
  }
}

// Handles background color highlighting and resotration of project cards.
function highlightCard(cardID) {
  // Reset the color of the previous card if applicable.
  if(previouslyClickedCardID > 0) {
    $('#' + previouslyClickedCardID).css({'background-color': 'var(--whiteish)'})
  }
  // Set the color of the new card if applicable.
  if(cardID > 0) {
    $('#' + cardID).css({'background-color': 'var(--lavenderish)'})
  }
  // Set the previously clicked card id for future use.
  previouslyClickedCardID = cardID
}

function viewAboutMe() {
  $(location).attr('href', '/')
}
