// Add additional middleware imports.
const mysql = require('mysql')
// For known-good SHA-256 hashing implementaion.
const crypto = require('crypto')

// Our controllers/endpoints.
const mySQLdb = require('../controllers/QueryMySQL.js')

exports.getVisitorCount = function (req, res) {
  // Hash the visitor's IP address, then send it off to the DB to see if the hash already exists in the DB.
  var hash = crypto.createHmac('sha256', process.env.VISITOR_IP_HASH_SECRET_KEY).update(req.connection.remoteAddress).digest('hex')

  // Build the query. Treat insert errors as warnings since we don't care if there are collisions.
  var sql = 'INSERT IGNORE INTO  ?? (??) VALUES (UNHEX(?))'
  var inserts = ['hashedVisitorIPs', 'hashedVisitorIP', hash]
  var query = mysql.format(sql, inserts)

  // Execute.
  mySQLdb.executeQuery(query)
    .finally(() => {
      // Regardless of the result, we grab the row count of the table to get the number of psuedo-unique visitors.
      // Build the query.
      var sql = 'SELECT COUNT(*) AS visitorCount FROM ??'
      var inserts = ['hashedVisitorIPs']
      var query = mysql.format(sql, inserts)

      // Execute.
      mySQLdb.executeQuery(query)
        .then(result => {
          res.status(200)
          res.send(result)
        })
        .catch(err => {
          console.log(err)
          res.status(404)
          res.send('Failed to receive unique visitor count.')
        })
    })
}
