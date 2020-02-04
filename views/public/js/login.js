// This funtion calculates and returns the pixel offset of the navbar and footer.
function getHeaderAndFooterDisplacements () {
  this.winHeight = $(this).outerHeight()
  this.navbarHeight = $('#navbar').outerHeight()

  return (this.winHeight - this.navbarHeight)
}

// This function adjusts the layout of the content based on height and orientation.
function setContainerHeight () {
  $('#scrollable-col').css({
    height: getHeaderAndFooterDisplacements() + 'px'
  })
  $('#scrollable-col').css({
    width: $(this).outerWidth() + 'px'
  })
}

// This Listens for all resize events and calls functions for resizing elements.
$(window).on('resize', function () {
  setContainerHeight()
})

// This Listens for all navbarLoadedEvent and calls functions for resizing elements.
$(window).on('navbarLoadedEvent', function () {
  setContainerHeight()
})

// Add ready handlers.
$(document).ready(function () {
  // Click event on the submit button.
  $('#submitButton').click(function () {
    console.log('Submitting comment.')
    event.preventDefault()
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

function viewAboutMe () {
  $(location).attr('href', '/')
}
