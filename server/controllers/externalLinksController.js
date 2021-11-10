// Add additional middleware imports.
const mysql = require('mysql')

// Our controllers/endpoints.
const mySQLdb = require('./QueryMySQL.js')

exports.getExternalLinkInfo = function (req, res) {
  // Build the query.
  var orderByClause = 'id ASC'
  var sql = 'SELECT * FROM ?? ORDER BY ' + orderByClause
  var inserts = ['externalLinks']
  var query = mysql.format(sql, inserts)

  // Execute.
  mySQLdb.executeQuery(query)
    .then(result => {
      // Since we are sorting results in a way such that the projectID in the database may not necessarily match the
      // project ordering in the client side, we need to give the projects new IDs to reduce confusion.
      var newIndex = 1

      result.forEach(item => {
        item.id = newIndex
        newIndex++
      })

      res.status(200)
      res.send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.send('Failed to receive external link data.')
    })
}
