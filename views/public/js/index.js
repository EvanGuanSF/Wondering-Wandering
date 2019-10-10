// Variables for viewable screen pixel dimensions.
var winWidth = $(this).outerWidth()
var winHeight = $(this).outerHeight()
var navbarHeight = $('#navbar').outerHeight()
var footerHeight = $('#footer').outerHeight()
var projects = []

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

        var mediaContentHTML = ""
        item.fileExt = item.projectImage.split('.').pop()
        item.filePath = "img\\" + item.projectImage

        // Image case.
        if (item.fileExt === 'jpg' ||
            item.fileExt === 'jpeg' ||
            item.fileExt === 'png' ||
            item.fileExt === 'bmp' ||
            item.fileExt === 'svg' ||
            item.fileExt === 'webp' ||
            item.fileExt === 'apng' ||
            item.fileExt === 'gif') {
          mediaContentHTML =
            "<img src=\"" + item.filePath + "\" class=\"card-img-top justify-content-center text-center p-0 m-0\">"
        }
        // Video case.
        else if (item.fileExt === 'mp4' ||
                 item.fileExt === 'webm') {
          mediaContentHTML =
            "<video src=\"" + item.filePath + "\" class=\"justify-content-center text-center p-0 m-0\" " +
            "\" type=\"video\" autoplay=\"true\" loop=\"true\" muted=\"true\">"
        }

        $('#cardContainer').append(
          "<div onclick=viewProjectDetails(" + item.projectID + ") id=" + item.projectID + " class=\"card shadow justify-content-center text-center\" style=\"\">" +
            "<div class=\"container-fluid p-0 m-0\">" +
              "<div class=\"row p-0 m-0 content-col-row\">" +

                "<div class=\"col-sm-6 p-0 m-0\">" +
                  "<div class=\"content-grid-unit\">" +
                    mediaContentHTML +
                  "</div>" +
                "</div>" +

                "<div class=\"col-sm-6 p-0 m-0 justify-content-center\">" +
                  "<div class=\"card-body p-0 m-0 justify-content-center\">" +
                    "<div id=\"text-spacer\">" +
                      "<b><p class=\"card-title p-0 m-0\">" + item.projectName + "</p></b>" +
                      "<p class=\"card-text text-left p-0 m-0\"" + ">" + item.projectDetails + "</p>" +
                      "<b><p class=\"card-title p-0 m-0\">Click for more details</p></b>" +
                      // "<a href=\"" + item.filePath + "\" class=\"btn p-0 m-0 content-link-button\">More Details</a>" +
                    "</div>" +
                  "</div>" +
                "</div>" +

              "</div>" +
            "</div>" +
          "</div>"
        )

        console.log(item.filePath)
      })
    }
  }

  // Send the request for data.
  xmlResponse.open("GET", '/getProjectInfo', true); // true for asynchronous
  xmlResponse.send(null);
}

// Takes a card-click event, scrolls to the map, finds the marker with the same id,
// and triggers a click event to zoom in on it.
function viewProjectDetails(cardID) {
  //If a map exists, highlight the report on the map
  var contentwindow = document.getElementById('map')

  console.log("card " + cardID + " clicked.")

  // Loop through and find the marker with given id.
  projects.forEach(function (project) {
    if (project['porjectID'] == cardID) {
      // Fire the click event to show the infowindow popup.
      // google.maps.event.trigger(marker, 'click')

      // Change the left/top pane to show the project details.
    }
  })
}
