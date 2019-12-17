// Add additional middleware imports.
const db = require('../auth/dbConfig.js')

// For executing arbitrary queries.
exports.executeQuery = function (query) {
  return new Promise(function (resolve) {
    db.query(query, function(err, rows, fields) {
      if (err)
        console.log('Error while performing Query: ' + err)
      resolve(rows)
    });
  })
}
