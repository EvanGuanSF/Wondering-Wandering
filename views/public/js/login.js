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
    console.log('Submitting login information.')
    event.preventDefault()
    var canSubmit = true

    // Form validation.
    // Go in bottom-up order so we can show the top-most form error first.
    if (!isEmailValid() ||
      !isPasswordValid() ||
      !isReCAPTCHAValid()) {
      canSubmit = false
    }

    console.log($('#login-form').serialize())

    // One final check.
    if (canSubmit) {
      // AJAX with jQuery to submit the data and handle the reponse.
      $.ajax({
        type: 'POST',
        url: 'login',
        data: $('#login-form').serialize()
      })
        .always(function (result) {
          if (result.status === 302 && result.redirect) {
            $(location).attr('href', result.redirect)
          } else {
            console.log(result)
            $('#errorText').html(result.responseText)
            $('#errorText')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
          }
        })
    }
  })
})

function viewAboutMe () {
  $(location).attr('href', '/')
}

// Validate new user email address.
function isEmailValid () {
  if (validator.isEmail($('#emailEntry').val()) && validator.isLength($('#emailEntry').val() + '', { max: 50 })) {
    // Be sure to empty the field of past errors if there were any.
    $('#emailValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#emailValidity').html('Please enter a valid email.')
    $('#emailValidity')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Validate new user password.
function isPasswordValid () {
  if (validator.isLength($('#passwordEntry').val() + '', { min: 5, max: 30 })) {
    // Be sure to empty the field of past errors if there were any.
    $('#passwordValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#passwordValidity').html('Please enter a valid password 5-30 characters long.')
    $('#passwordValidity')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Validate reCAPTCHA status.
function isReCAPTCHAValid () {
  if (grecaptcha && grecaptcha.getResponse().length > 0) {
    // Captcha checked
    // Be sure to empty the field of past errors if there were any.
    $('#captchaValidity').html('')
    return true
  } else {
    // Captcha not checked
    // Display error and scroll to the field.
    $('#captchaValidity').html('Please check the box to continue.')
    $('#captchaValidity')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}
