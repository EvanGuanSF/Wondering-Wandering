// Add additional middleware imports.
const mysql = require('mysql')
// For known-good SHA-256 hashing implementaion.
const crypto = require('crypto')

// Our controllers/endpoints.
const dbQuery = require('./dbQuery.js')

// Captcha secret key var from json file.
const fs = require('fs')
var rawData = fs.readFileSync('auth/visitorIPHashKey.json')
var jsonData = JSON.parse(rawData)
const visitorCountSecretKey = jsonData.secretKey

exports.getVisitorCount = function (req, res) {
  // Hash the visitor's IP address, then send it off to the DB to see if the hash already exists in the DB.
  var hash = crypto.createHmac('sha256', visitorCountSecretKey).update(req.connection.remoteAddress).digest('hex')

  // Build the query. Treat insert errors as warnings since we don't care if there is a collision.
  var sql = 'INSERT IGNORE INTO  ?? (??) VALUES (UNHEX(?))'
  var inserts = ['hashedVisitorIPs', 'hashedVisitorIP', hash]
  var query = mysql.format(sql, inserts)

  // Execute.
  dbQuery.executeQuery(query)
    .finally(function () {
      // Regardless of the result, we grab the row count of the table to get the number of psuedo-unique visitors.
      // Build the query.
      var sql = 'SELECT COUNT(*) AS visitorCount FROM ??'
      var inserts = ['hashedVisitorIPs']
      var query = mysql.format(sql, inserts)

      // Execute.
      dbQuery.executeQuery(query)
        .then(function (result) {
          res.status(200)
          res.send(result)
        })
        .catch(function (err) {
          console.log(err)
          res.status(404)
          res.send('Failed to receive unique visitor count.')
        })
    })
}
