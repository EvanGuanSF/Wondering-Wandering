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
    var canSubmit = true

    // Form validation.
    // Go in bottom-up order so we can show the top-most form error first.
    if (!isGuestNameValid() || !isGuestCommentValid()) {
      canSubmit = false
    }

    // One final check.
    if (canSubmit) {
      $('#comment-submission-form').submit()
    }
  })
})

// Makes a request to the server for card data and creates cards accordingly.
function createCommentCards() {
  var xmlResponse = new XMLHttpRequest()
  cardNumber = 0

  // Wait for a response.
  xmlResponse.onreadystatechange = function() {
    if (xmlResponse.readyState == 4 && xmlResponse.status == 200)
    {
      comments = JSON.parse(xmlResponse.response)

      comments.forEach((comment, index) => {
        // Check the extension of the file and create an
        // image or video element according to that file format.
        $('#cardContainer').append(
          '<div class=\'card-bg card shadow-sm justify-content-center text-center\' style=\'background-color: var(--whiteish)\'>' +
            '<div class=\'container-fluid p-0 m-0\'>' +
              '<div class=\'row p-0 m-0 content-col-row\'>' +

                '<div class=\'card-body col-12 p-0 m-0\'>' +
                  '<b><p class=\'card-title p-0 m-0\' id=\'cardTitleNumber' + cardNumber + '\'></p></b>' +
                  '<p class=\'card-text text-left\' id=\'cardTextNumber' + cardNumber + '\'></p>' +
                '</div>' +

              '</div>' +
            '</div>' +
          '</div>'
        )

        $('#cardTitleNumber' + cardNumber).text(comment.guestName)
        $('#cardTextNumber' + cardNumber).text(comment.guestComment)

        cardNumber++
      })
    }
  }

  // Send the request for data.
  xmlResponse.open('GET', '/getComments', true) // true for asynchronous
  xmlResponse.send(null)
}

// Validate guest name input.
function isGuestNameValid () {
  console.log('checking name: ' + $('#guestNameEntry').val())
  if (validator.isLength($('#guestNameEntry').val() + '', { min: 2, max: 40 })) {
    // Be sure to empty the field of past errors if there were any.
    $('#guestNameValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#guestNameValidity').html('Please enter your name. (2-40 characters)')
    $('#guestNameEntry')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Validate guest comment input.
function isGuestCommentValid () {
  console.log('checking comment: ' + $('#guestCommentEntry').val())
  if (validator.isLength($('#guestCommentEntry').val() + '', { min: 2, max: 500 })) {
    // Be sure to empty the field of past errors if there were any.
    $('#guestCommentValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#guestCommentValidity').html('Please enter your comment. (2-40 characters)')
    $('#guestCommentEntry')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}
