var initialFooterHeight = $('#footer').outerHeight()

$(document).ready(() => {
  // Load the footer.
  $.get('footer.html', footerHTML => {
    $('#footer').replaceWith(footerHTML)

    // Load the greeting for the user if applicable.
    var userName = getCookie('UserName')
    if (userName != '') {
      $('#userGreeting').text('Hello ' + userName + '!')
    }
  })

  // Load the CSS for the footer.
  $('head').append('<link rel=\'stylesheet\' href=\'css/footer.css\' type=\'text/css\'/>')

  // Load the privacy policy text into the modal popup.
  $.get('PrivacyPolicy.txt', response => {
    $('#privacyPolicyPopup').html(response)
  })

  // Load the subtitle for the footer.
  $.get('/getVisitorCount', data => {
    $('#uniqueVisitorsCounter').text('Unique Visitors: ' + data[0].visitorCount)
  })
})

// Function to find the value of a given cookie by name.card
// Credit to W3Schools.
function getCookie (cookieName) {
  var fullCookieName = cookieName + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var cookieArray = decodedCookie.split(';')
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(fullCookieName) === 0) {
      return cookie.substring(fullCookieName.length, cookie.length)
    }
  }
  return ''
}
