var initialFooterHeight = $('#footer').outerHeight()

$(document).ready(function () {
  // Load the footer.
  $.get('footer.html', function (footerHTML) {
    $('#footer').replaceWith(footerHTML)
  })

  // Laod the CSS for the footer.
  $('head').append('<link rel=\'stylesheet\' href=\'css/footer.css\' type=\'text/css\'/>')

  // Load the subtitle for the footer.
  $.get('/getVisitorCount')
    .done(function (data) {
      $('#uniqueVisitorsCounter').text('Unique Visitors: ' + data[0].visitorCount)
    })

  // Load the privacy policy text into the modal popup.
  $(document).ready(function () {
    $.get('PrivacyPolicy.txt', function (response) {
      $('#privacyPolicyPopup').html(response)
    })
  })
})

// Sleep function workaround. Must be called from an async function.
// Usage: await sleep(int number of milliseconds)
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// This function is used to trigger the initial resize(s).
async function checkFooterFinishedLoaded () {
  var footerTimer
  console.time(footerTimer)

  // Continuous trigger mode. 5 seconds total.
  for (i = 0; i < 60; i++) {
    await sleep(50)
    initialFooterHeight = $('#footer').outerHeight()
    $(window).trigger('footerLoadedEvent')
  }
}

// Call checkFooterFinishedLoaded after the elements are loaded.
$(document).ready(function () {
  checkFooterFinishedLoaded()
})

// Call checkFooterFinishedLoaded after the elements are loaded.
$('#footer').on(('animate'), function () {
  console.log('footer resized.')
  $(window).trigger('footerLoadedEvent')
})
