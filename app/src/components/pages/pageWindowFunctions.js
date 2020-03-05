/**
 * Calculate the viewable height of the viewport.
 * That is, webpage space minus navbar and footer on the client side.
 */
export const calculateUsableHeight = () => {
  var navbarHeight =
      document.getElementById('navbar').clientHeight === null
        ? 0
        : document.getElementById('navbar').clientHeight

  var footerHeight =
      document.getElementById('footer').clientHeight === null
        ? 0
        : document.getElementById('footer').clientHeight

  return window.innerHeight - navbarHeight - footerHeight
}

/**
 * Calculate the viewable width of the viewport.
 */
export const calculateUsableWidth = () => {
  return window.innerWidth
}
