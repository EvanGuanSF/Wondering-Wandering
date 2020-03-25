export default (state, action) => {
  switch (action.type) {
    case 'UPDATE_USABLE_DIMENSIONS':
      var newNavbarHeight =
          document.getElementById('navbar') === null
            ? 0
            : document.getElementById('navbar').clientHeight

      var newFooterHeight =
          document.getElementById('footer') === null
            ? 0
            : document.getElementById('footer').clientHeight

      var availableHeight = window.innerHeight - newNavbarHeight - newFooterHeight

      var newUsableWidth = 0
      var newUsableHeight = 0

      // 'Normal' large display case.
      if (window.innerWidth <= 992) {
        // Check orientaion of device by looking at window dimensions.
        if (window.innerWidth < window.innerHeight) {
          // Portrait orientation display case. (i.e. phone)
          newUsableWidth = window.innerWidth
          newUsableHeight = availableHeight / 2
        } else {
          // Landscape orientation display case. (i.e. phone)
          newUsableWidth = window.innerWidth / 2
          newUsableHeight = availableHeight
        }
      } else {
        // Check orientaion of device by looking at window dimensions.
        if (window.innerWidth < window.innerHeight) {
          // Portrait orientation display case. (i.e. rotated display)
          newUsableWidth = window.innerWidth / 2
          newUsableHeight = availableHeight
        } else {
          // Landscape orientation display case. (i.e. normal desktop)
          newUsableWidth = window.innerWidth / 2
          newUsableHeight = availableHeight
        }
      }

      // console.log(
      //   newNavbarHeight,
      //   newFooterHeight,
      //   newUsableHeight,
      //   newUsableWidth
      // )

      return {
        navbarHeight: newNavbarHeight,
        footerHeight: newFooterHeight,
        usableHeight: newUsableHeight,
        usableWidth: newUsableWidth
      }
    default: {
      return state
    }
  }
}
