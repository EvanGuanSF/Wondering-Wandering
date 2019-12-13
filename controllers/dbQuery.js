
const db = require('../auth/dbConfig.js')

// For executing arbitrary queries.
exports.executeQuery = function (query) {
  return new Promise(function (resolve) {
    console.log(query)

    db.query(query, function(err, rows, fields) {
      if (!err) {
        console.log('Query ok.');
        rows.forEach((row, index) => {
          console.log(row.projectName)
        })
      }
      else
        console.log('Error while performing Query: ' + err);
      resolve(rows)
    });
  })
}
