// We need these modules to access directory
// and filename information.
const path = require('path');
const filesystem = require('fs');

// Combine the directory of the node server with the
// path that contains our media files.
const directoryPath = path.join(__dirname, '../views/public/img')

exports.getCardInfo = function () {
  return new Promise(function (resolve) {

    console.log(directoryPath)
    var fileInformation = []

    // Asynchronous filesystem call.
    // We will treat it as a synchronous function
    // because we want all of the results.
    filesystem.readdir(directoryPath, function (err, files) {
      // Handle file system errors if needed.
      if (err) {
          console.log('Unable to scan directory: ' + err);
      } else {
        // Loop through all files in the directory.
        files.forEach((file, index) => {
          var fileExtension = path.extname(file)

          // Check to see if the file is of a type we are interested in.
          if (fileExtension === '.jpg' ||
              fileExtension === '.jpeg' ||
              fileExtension === '.png' ||
              fileExtension === '.bmp' ||
              fileExtension === '.svg' ||
              fileExtension === '.webp' ||
              fileExtension === '.apng' ||
              fileExtension === '.gif' ||
              fileExtension === '.mp4' ||
              fileExtension === '.webm') {
              // Show the file name.
            console.log(file)

            // Create a new entry.
            var newCardInfo = {}
            newCardInfo = {
              'filePath': path.join('img/', file),
              'fileExt' : fileExtension.split('.').pop()
            }

            // Append the entry to the JSON object.
            fileInformation.push(newCardInfo)
          }
        })
      }

      // Finally, return the informatin.
      resolve(fileInformation)
    })
  })
}
