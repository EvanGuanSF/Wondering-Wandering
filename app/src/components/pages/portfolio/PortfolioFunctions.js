// Makes a request to the server for card data and creates cards accordingly.
function createProjectCards (projects) {
  // The html return value of the cards we will make.
  var projectInfoHTML = ''
  // The current category.
  var currentCategory
  var categoriesMatch = false
  var currentCategoryID = 0
  var currentCategoryContainerIDString

  projects.forEach((item, index) => {
    // Check the extension of the file and create an
    // image or video element according to that file format.
    var mediaContentHTML = createMediaElementWithFileName(item.projectImage, 'normalCard')

    // Check the category of the project.
    categoriesMatch = currentCategory === item.projectCategory
    if (!categoriesMatch) {
      // Increment the currentCategoryID as needed.
      currentCategoryID++
    }
    // Update the strings for building HTML elements.
    currentCategory = item.projectCategory
    currentCategoryContainerIDString = 'categoryContainer' + currentCategoryID
    var currentCardCategoryIDString = 'cardCategory' + currentCategoryID

    // Create the category container if needed.
    if (!categoriesMatch && currentCategory > 1) {
      projectInfoHTML.concat(
        '</div>'
      )
    }
    if (!categoriesMatch) {
      projectInfoHTML.concat(
        '<div id=\'' + currentCategoryContainerIDString + '\' class=\'p-0 m-0\'>' +

          '<div class=\'container p-0 m-0 project-category-identifier\'>' +
            '<div class=\'row p-0 m-0\' style=\'display:flex; justify-content:flex-end; align-items:center;\'>' +

              '<div class=\'col-6 text-left p-0 m-0\'>' +
                '<p class=\'\'><b>Project Type: ' + currentCategory + '</b></p>' +
              '</div>' +

              '<div class=\'col-6 text-right\'>' +
                '<a class=\'categoryContainer category-collapse-button\' data-toggle=\'collapse\' href=\'.' + currentCardCategoryIDString +
                '\' role=\'button\' aria-expanded=\'true\' aria-controls=\'collapse\'><b>' +
                  'Toggle Category' +
                '</a>' +
              '</div>' +

            '</div>' +
          '</div>'
      )
    }

    // Now attach the card to the current category container.
    projectInfoHTML.concat(
      '<div onclick=\'viewProjectDetails(' + (index + 1) + '); highlightCard(' + (index + 1) + ')\' id=' + (index + 1) +
      ' class=\'collapse show card-bg card shadow justify-content-center text-center ' + currentCardCategoryIDString +
      '\' style=\'background-color: var(--whiteish)\'>' +

        '<div class=\'container-fluid p-0 m-0\'>' +
          '<div class=\'row p-0 m-0 content-col-row\'>' +

            '<div class=\'col-6 p-0 m-0\'>' +
              '<div class=\'content-grid-unit\'>' +
                mediaContentHTML +
              '</div>' +
            '</div>' +

            '<div class=\'card-body col-6 p-0 m-0\'>' +
              '<b><p class=\'card-title p-0 m-0\'>' + item.projectName + '</p></b>' +
              '<p class=\'card-text text-left\'>' + item.projectDetails + '</p>' +
              '<b><p class=\'card-title p-0 m-0\'>Click this card for more details</p></b>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>'
    )
  })
}

// Creates the media element html given a file name and its extension and
// also the type of element (in a card or in the details column).
function createMediaElementWithFileName (fileName, elementType) {
  var fileExt = fileName.split('.').pop()
  var filePath = 'img\\' + fileName
  var mediaContentHTML = ''

  // Image case.
  if (fileExt === 'jpg' ||
      fileExt === 'jpeg' ||
      fileExt === 'png' ||
      fileExt === 'bmp' ||
      fileExt === 'svg' ||
      fileExt === 'webp' ||
      fileExt === 'apng' ||
      fileExt === 'gif') {
    if (elementType === 'normalCard') {
      mediaContentHTML =
        '<img src=\'' + filePath + '\' class=\'card-img-top justify-content-center text-center p-0 m-0\'>'
    } else if (elementType === 'largeCard') {
      mediaContentHTML =
        '<img src=\'' + filePath + '\' class=\'card-img-top-large justify-content-center text-center p-0 m-0\'>'
    }
  }
  // Video case.
  else if (fileExt === 'mp4' ||
           fileExt === 'webm') {
    mediaContentHTML =
      '<video src=\'' + filePath + '\' class=\'justify-content-center card-video text-center p-0 m-0\' ' +
      '\' type=\'video\' autoplay=\'true\' loop=\'true\' muted=\'true\'>'
  }

  return mediaContentHTML
}
