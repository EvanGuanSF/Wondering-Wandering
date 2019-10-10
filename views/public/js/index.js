// Variables for viewable screen pixel dimensions.
var winWidth = $(this).outerWidth()
var winHeight = $(this).outerHeight()
var navbarHeight = $('#navbar').outerHeight()
var footerHeight = $('#footer').outerHeight()
var projects = []
var aboutMeString = ''



// This funtion calculates and returns the pixel offset of the navbar and footer.
function getHeaderAndFooterDisplacements() {
  this.winHeight = $(this).outerHeight()
  this.navbarHeight = $('#navbar').outerHeight()
  this.footerHeight = $('#footer').outerHeight()

  return (this.winHeight - this.navbarHeight - this.footerHeight)
}

// This function adjusts the layout of the content based on height and orientation.
function setContainerHeight() {
  // "Normal" large display case.
  if($(this).outerWidth() <= 992) {
    // Check orientaion of device by looking at window dimensions.
    if($(this).outerWidth() < $(this).outerHeight()) {
      // Portrait orientation display case. (i.e. phone)
      $('.content-col').css({
        'height': getHeaderAndFooterDisplacements() / 2 + 'px',
        'width': $(this).outerWidth() + 'px'
      })
    } else {
      // Landscape orientation display case. (i.e. phone)
      $('.content-col').css({
        'height': getHeaderAndFooterDisplacements() + 'px',
        'width': $(this).outerWidth() / 2 + 'px'
      })
    }
  } else {
    // Check orientaion of device by looking at window dimensions.
    if($(this).outerWidth() < $(this).outerHeight()) {
      // Portrait orientation display case. (i.e. rotated display)
      $('.content-col').css({
        'height': getHeaderAndFooterDisplacements() + 'px'
      })
      $('#scrollable-col').css({
        'width': $(this).outerWidth() + 'px'
      })
    } else {
      // Landscape orientation display case. (i.e. normal desktop)
      $('.content-col').css({
        'height': getHeaderAndFooterDisplacements() + 'px'
      })
    }
  }
}

// This Listens for all resize events and calls functions for resizing elements.
$(window).on('resize', function(){
  setContainerHeight()
})

// This Listens for all navbarLoadedEvent and calls functions for resizing elements.
$(window).on('navbarLoadedEvent', function(){
  setContainerHeight()
})

// Load the about me info from the file and put it into the details div.
$(document).ready(function() {
  $.get('AboutMe.txt', function (response) {
    aboutMeString = response;
    $('#detailContents').html(aboutMeString)
  });
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

        var mediaContentHTML = createMediaElementWithFilenName(item.projectImage)

        $('#cardContainer').append(
          '<div onclick=viewProjectDetails(' + item.projectID + ') id=' + item.projectID + ' class=\'card shadow justify-content-center text-center\' style=\'\'>' +
            '<div class=\'container-fluid p-0 m-0\'>' +
              '<div class=\'row p-0 m-0 content-col-row\'>' +

                '<div class=\'col-6 p-0 m-0\'>' +
                  '<div class=\'content-grid-unit\'>' +
                    mediaContentHTML +
                  '</div>' +
                '</div>' +

                '<div class=\'card-body col-6 p-0 m-0\'>' +
                    '<b><p class=\'card-title p-0 m-0\'>' + item.projectName + '</p></b>' +
                    '<p class=\'card-text text-left p-0 m-0\'>' + item.projectDetails + '</p>' +
                    '<b><p class=\'card-title p-0 m-0\'>Click for more details</p></b>' +
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
        var mediaContentHTML = createMediaElementWithFilenName(project.projectImage)
        // Format the roles output.
        var projectRoles = project.projectRole.replace(/^/g, '\t• ').replace(/;/g, ';\t• ').replace(/;/g, '<br>')
        // Format the project technologies output.
        var projectLanguagesAndTechnologies = project.projectLanguagesAndTechnologies.replace(/^/g, '\t• ').replace(/;/g, ';\t• ').replace(/;/g, '<br>')
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
          '<div class=\'card shadow justify-content-center text-center\' style=\'\'>' +
            '<div class=\'container-fluid p-0 m-0\'>' +
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
                      '<a href=\'' + project.projectURL + '\'><b>GitHub Repository</b></a>' +
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

function createMediaElementWithFilenName(fileName) {
  var fileExt = fileName.split('.').pop()
  var filePath = 'img\\' + fileName

  // Image case.
  if (fileExt === 'jpg' ||
      fileExt === 'jpeg' ||
      fileExt === 'png' ||
      fileExt === 'bmp' ||
      fileExt === 'svg' ||
      fileExt === 'webp' ||
      fileExt === 'apng' ||
      fileExt === 'gif') {
    mediaContentHTML =
      '<img src=\'' + filePath + '\' class=\'card-img-top justify-content-center text-center p-0 m-0\'>'
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
