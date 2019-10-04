// Variables for viewable screen pixel dimensions.
var winWidth = $(this).outerWidth()
var winHeight = $(this).outerHeight()
var disclaimerHeight = $('#disclaimerBanner').outerHeight()
var navbarHeight = $('#navbar').outerHeight()
var footerHeight = $('#footer').outerHeight()

// This funtion calculates and returns the pixel offset of the navbar and footer.
function getHeaderAndFooterDisplacements() {
  this.winHeight = $(this).outerHeight()
  this.disclaimerHeight = $('#disclaimerBanner').outerHeight()
  this.navbarHeight = $('#navbar').outerHeight()
  this.footerHeight = $('#footer').outerHeight()

  return (this.winHeight - this.disclaimerHeight - this.navbarHeight - this.footerHeight)
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

  // Set the text of the footer.
  $('#widthText').html($(this).outerWidth())
  $('#heightText').html($(this).outerHeight())
  $('#disclaimerHeightText').html($('#disclaimerBanner').outerHeight())
  $('#navHeightText').html($('#navbar').outerHeight())
  $('#footerHeightText').html($('#footer').outerHeight())


  $('#oh1').html('map outerWidth ' + $('#map-col').outerWidth())
  $('#oh2').html('scrollable outerWidth ' + $('#scrollable-col').outerWidth())
  $('#oh3').html('map outerHeight ' + $('#map-col').outerHeight())
  $('#oh4').html('scrollable outerHeight ' + $('#scrollable-col').outerHeight())
  $('#oh5').html('map height ' + $('#map-col').height())
  $('#oh6').html('scrollable height ' + $('#scrollable-col').height())
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
function createDemoCards() {
  var xmlResponse = new XMLHttpRequest()

  // Wait for a response.
  xmlResponse.onreadystatechange = function() {
    if (xmlResponse.readyState == 4 && xmlResponse.status == 200)
    {
      var reponseAsJSON = JSON.parse(xmlResponse.response)

      // The path to the media file from the JSON.
      var mediaPath
      // The file extension of the file.
      var mediaType

      reponseAsJSON.forEach((item, index) => {
        // Check the extension of the file and create an
        // image or video element according to that file format.

        // Image case.
        if (item.fileExt === 'jpg' ||
            item.fileExt === 'jpeg' ||
            item.fileExt === 'png' ||
            item.fileExt === 'bmp' ||
            item.fileExt === 'svg' ||
            item.fileExt === 'webp' ||
            item.fileExt === 'apng' ||
            item.fileExt === 'gif') {
          $('#cardContainer').append(
            "<div class=\"card shadow-sm justify-content-center text-center\" style=\"\">" +
              "<div class=\"container-fluid p-0 m-0\">" +
                "<div class=\"row p-0 m-0\">" +

                  "<div class=\"col-sm-6 p-0 m-0\">" +
                    "<div class=\"content-grid-unit\">" +
                      "<img src=\"" + item.filePath + "\" class=\"card-img-top justify-content-center text-center p-0 m-0\" " +
                      "alt=\"" + item.filePath + "\">" +
                    "</div>" +
                  "</div>" +

                  "<div class=\"col-sm-6 p-0 m-0 justify-content-center\">" +
                    "<div class=\"card-body p-0 m-0 justify-content-center\">" +
                      "<div id=\"text-spacer\">" +
                        "<p class=\"card-text text-left p-0 m-0\"" + ">" + item.filePath + " " +
                        "Block Block Block ".repeat(50) + ".</p>" +
                        "<a href=\"" + item.filePath + "\" class=\"btn p-0 m-0 content-link-button\">Full Size</a>" +
                      "</div>" +
                    "</div>" +
                  "</div>" +

                "</div>" +
              "</div>" +
            "</div>"
          )
        }
        // Video case.
        else if (item.fileExt === 'mp4' ||
            item.fileExt === 'webm') {
          $('#cardContainer').append(
            "<div class=\"card shadow-sm justify-content-center text-center\" style=\"\">" +
              "<div class=\"container-fluid p-0 m-0\">" +
                "<div class=\"row p-0 m-0 content-col-row\">" +

                  "<div class=\"col-sm-6 p-0 m-0\">" +
                    "<div class=\"content-grid-unit\">" +
                      "<video src=\"" + item.filePath + "\" class=\"justify-content-center text-center p-0 m-0\" " +
                      "alt=\"" + item.filePath + "\" type=\"video\"" + item.fileExt + " autoplay=\"true\" loop=\"true\" muted=\"true\">" +
                    "</div>" +
                  "</div>" +

                  "<div class=\"col-sm-6 p-0 m-0 justify-content-center\">" +
                    "<div class=\"card-body p-0 m-0 justify-content-center\">" +
                      "<div id=\"text-spacer\">" +
                        "<p class=\"card-text text-left p-0 m-0\"" + ">" + item.filePath + " " +
                        "Block Block Block ".repeat(50) + ".</p>" +
                        "<a href=\"" + item.filePath + "\" class=\"btn p-0 m-0 content-link-button\">Full Size</a>" +
                      "</div>" +
                    "</div>" +
                  "</div>" +

                "</div>" +
              "</div>" +
            "</div>"
          )
        }
        console.log(item.filePath)
      })
    }
  }

  // Send the request for data.
  xmlResponse.open("GET", '/getCardInfo', true); // true for asynchronous
  xmlResponse.send(null);
}
