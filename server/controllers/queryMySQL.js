// Add additional middleware imports.
const mySQLdb = require('../auth/MySQLdbConfig.js')

// For executing arbitrary queries.
exports.executeQuery = function (query) {
  return new Promise(resolve => {
    mySQLdb.query(query, (err, rows, fields) => {
      if (err) {
        console.log('Error while performing Query: ' + err)
      }
      resolve(rows)
    })
  })
}
