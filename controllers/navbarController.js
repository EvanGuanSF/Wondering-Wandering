// Add additional middleware imports.
const mysql = require('mysql')
//const sqlstring = require('sqlstring');

// Our controllers/endpoints.
const dbQuery = require('../controllers/dbQuery.js')

exports.getRandomSubtitle = function (req, res) {
  // Build the query.
  var sql = 'SELECT ?? FROM ?? ORDER BY Rand() Limit 1'
  var inserts = ['subtitle', 'subtitles']
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
