
const db = require('../auth/dbConfig.js')


exports.getProjectInfo = function () {
  return new Promise(function (resolve) {
    table = 'projects'
    orderClause = 'projectID'
    orderDirection = 'ASC'
    query = `
        SELECT * FROM ${table} ORDER BY ${orderClause} ${orderDirection}`

    db.query(query, function(err, rows, fields) {
      if (!err)
        console.log('Query results:\n', rows);
      else
        console.log('Error while performing Query.');

      resolve(rows)
    });
  })
}
