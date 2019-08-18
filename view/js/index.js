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
