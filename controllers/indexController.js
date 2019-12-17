// We need these modules to access directory
// and filename information.
const path = require('path');
const filesystem = require('fs');

// Combine the directory of the node server with the
// path that contains our media files.
const directoryPath = path.join(__dirname, '../views/public/img')

// Add additional middleware imports.
const mysql = require('mysql')
//const sqlstring = require('sqlstring');

// JSON parser.
const bodyParser = require('body-parser')

// Our controllers/endpoints.
const dbQuery = require('../controllers/dbQuery.js')

exports.selectProjectInfo = function (req, res) {
  // Build the query.
  var orderByClause = 'projectCategory ASC'
  var sql = 'SELECT * FROM ?? ORDER BY ' + orderByClause
  var inserts = ['projects']
  var query = mysql.format(sql, inserts)

  // Execute.
  dbQuery.executeQuery(query)
    .then(function (result) {
      // Since we are sorting results in a way such that the projectID in the database may not necessarily match the
      // project ordering in the client side, we need to give the projects new IDs to reduce confusion.
      newIndex = 1

      result.forEach((item) => {
        item.projectID = newIndex
        newIndex++
      })

      res.status(200)
      res.send(result)
    })
    .catch(function(err) {
      console.log(err)
      res.status(404)
      res.send('Failed to receive project data.')
    })
}
