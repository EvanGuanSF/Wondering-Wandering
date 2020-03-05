// This funtion calculates and returns the pixel offset of the navbar and footer.
function getHeaderAndFooterDisplacements () {
  var winHeight = $(this).outerHeight()
  var navbarHeight = $('#navbar').outerHeight()
  var footerHeight = $('#footer').outerHeight()

  return (winHeight - navbarHeight - footerHeight)
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
$(document).ready(() => {
  // Click event on the submit button.
  $('#submitButton').click(() => {
    console.log('Submitting comment.')
    event.preventDefault()
    var canSubmit = true

    // Form validation.
    // Go in bottom-up order so we can show the top-most form error first.
    // if (!isUserNameValid() ||
    //   !isEmailValid() ||
    //   !isPasswordValid() ||
    //   !isPasswordConfirmationValid() ||
    //   !isReCAPTCHAValid()) {
    //   canSubmit = false
    // }
    if (!isUserNameValid() ||
      !isEmailValid() ||
      !isPasswordValid() ||
      !isPasswordConfirmationValid()) {
      canSubmit = false
    }

    console.log($('#registration-form').serialize())

    // One final check.
    if (canSubmit) {
      // AJAX with jQuery to submit the data and handle the reponse.
      $.ajax({
        type: 'POST',
        url: 'register',
        data: $('#registration-form').serialize()
      })
        .always(function (result) {
          if (result.status === 200 && result.redirect) {
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

// Validate new user password.
function isUserNameValid () {
  if (validator.isLength($('#userNameEntry').val().trim() + '', { min: 3, max: 50 })) {
    // Be sure to empty the field of past errors if there were any.
    $('#userNameValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#userNameValidity').html('Please enter a valid user name 3-50 characters long.')
    $('#userNameValidity')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Validate new user email address.
function isEmailValid () {
  if (validator.isEmail($('#emailEntry').val().trim()) && validator.isLength($('#emailEntry').val().trim() + '', { max: 90 })) {
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
  if (validator.isLength($('#passwordEntry').val().trim() + '', { min: 7, max: 50 })) {
    // Be sure to empty the field of past errors if there were any.
    $('#passwordValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#passwordValidity').html('Please enter a valid password 7-50 characters long.')
    $('#passwordValidity')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
    return false
  }
}

// Validate new user password match.
function isPasswordConfirmationValid () {
  if ($('#passwordConfirmationEntry').val().trim() === $('#passwordEntry').val().trim()) {
    // Be sure to empty the field of past errors if there were any.
    $('#passwordConfirmationValidity').html('')
    return true
  } else {
    // Display error and scroll to the field.
    $('#passwordConfirmationValidity').html('Passwords do not match.')
    $('#passwordConfirmationValidity')[0].scrollIntoView({ behavior: 'smooth', alignToTop: 'true', inline: 'nearest' })
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
