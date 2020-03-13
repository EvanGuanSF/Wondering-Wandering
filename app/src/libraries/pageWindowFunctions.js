/**
 * Calculate the viewable dimensions of the viewport, width x height.
 * That is, webpage space minus navbar and footer on the client side.
 * Account for smaller screens and screen orientation.
 */
export const calculateUsableDimensions = () => {
  var navbarHeight =
      document.getElementById('navbar') === null
        ? 0
        : document.getElementById('navbar').clientHeight

  var footerHeight =
      document.getElementById('footer') === null
        ? 0
        : document.getElementById('footer').clientHeight

  var availableHeight = window.innerHeight - navbarHeight - footerHeight

  var usableWidth = 0
  var usableHeight = 0

  // 'Normal' large display case.
  if (window.innerWidth <= 992) {
    // Check orientaion of device by looking at window dimensions.
    if (window.innerWidth < window.innerHeight) {
      // Portrait orientation display case. (i.e. phone)
      usableWidth = window.innerWidth
      usableHeight = availableHeight / 2
    } else {
      // Landscape orientation display case. (i.e. phone)
      usableWidth = window.innerWidth / 2
      usableHeight = availableHeight
    }
  } else {
    // Check orientaion of device by looking at window dimensions.
    if (window.innerWidth < window.innerHeight) {
      // Portrait orientation display case. (i.e. rotated display)
      usableWidth = window.innerWidth / 2
      usableHeight = availableHeight
    } else {
      // Landscape orientation display case. (i.e. normal desktop)
      usableWidth = window.innerWidth / 2
      usableHeight = availableHeight
    }
  }

  return [usableWidth, usableHeight]
}
