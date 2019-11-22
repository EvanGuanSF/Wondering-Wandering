// We need these modules to access directory
// and filename information.
const path = require('path');
const filesystem = require('fs');

// Combine the directory of the node server with the
// path that contains our media files.
const directoryPath = path.join(__dirname, '../views/public/img')


// TODO: Getting and formatting guestbook data to give to user.

// Add additional middleware imports.
const mysql = require('mysql')
//const sqlstring = require('sqlstring');

// JSON parser.
const bodyParser = require('body-parser')

// Our controllers/endpoints.
const captcha = require('../controllers/captchaController.js')
const dbQuery = require('../controllers/dbQuery.js')

exports.selectProjectInfo = function (req, res) {
  // Build the query.
  var sql = 'SELECT * FROM  ?? ORDER BY ? ?'
  var inserts = ['projects', 'projectID', 'ASC']
  var query = mysql.format(sql, inserts)

  // Execute
  dbQuery.executeQuery(query)
    .then(function (result) {
      res.status(200)
      res.send(result)
    })
    .catch(function(err) {
      console.log(err)
      res.status(404)
      res.send('Failed to receive project data.')
    })
}

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
