var initialNavbarHeight = $('#navbar').outerHeight()

$(document).ready(() => {
  // Load the navbar.
  $.get('navbar.html', navbarHTML => {
    $('#navbar').replaceWith(navbarHTML)
  })

  // Laod the CSS for the navbar.
  $('head').append('<link rel=\'stylesheet\' href=\'css/navbar.css\' type=\'text/css\'/>')

  // Load the subtitle for the navbar.
  $.get('/getRandomSubtitle')
    .done(data => {
      $('#subtitle').text(data[0].subtitle)
    })
})

// Sleep function workaround. Must be called from an async function.
// Usage: await sleep(int <number of milliseconds>)
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// This function is used to trigger the initial resize(s).
async function checkNavbarFinishedLoaded () {
  var navbarTimer
  console.time(navbarTimer)

  // Continuous trigger mode. 5 seconds total.
  for (var i = 0; i < 60; i++) {
    await sleep(50)
    initialNavbarHeight = $('#navbar').outerHeight()
    $(window).trigger('navbarLoadedEvent')
  }
}

// Call checkNavbarFinishedLoaded after the elements are loaded.
$(document).ready(() => {
  checkNavbarFinishedLoaded()
})

// Call checkNavbarFinishedLoaded after the elements are loaded.
$('#navbar').on(('animate'), () => {
  console.log('navbar resized.')
  $(window).trigger('navbarLoadedEvent')
})
