// Add additional middleware imports.
const mysql = require('mysql')

// Our controllers/endpoints.
const dbQuery = require('../controllers/dbQuery.js')

exports.getRandomSubtitle = function (req, res) {
  // Build the query.
  var orderByClause = 'Rand() Limit 1'
  var sql = 'SELECT ?? FROM ?? ORDER BY ' + orderByClause
  var inserts = ['subtitle', 'subtitles']
  var query = mysql.format(sql, inserts)

  // Execute
  dbQuery.executeQuery(query)
    .then(result => {
      res.status(200)
      res.send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.send('Failed to receive subtitle data.')
    })
}
