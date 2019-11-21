
const db = require('../auth/dbConfig.js')

// For getting query information.
exports.getQueryResults = function (table, orderClause, orderDirection) {
  return new Promise(function (resolve) {
    query = `SELECT * FROM ${table} ORDER BY ${orderClause} ${orderDirection}`

    db.query(query, function(err, rows, fields) {
      if (!err)
        console.log('Query results:\n', rows);
      else
        console.log('Error while performing Query.');
      resolve(rows)
    });
  })
}

// For inserting query information.
exports.executeInsertQuery = function (table, columnsClause, valuesClause) {
  // INSERT INTO `guestbook` (`guestID`, `guestName`, `guestComment`) VALUES ('0', 'Test', 'Me');
  return new Promise(function (resolve) {
    query = `INSERT INTO ${table} (${columnsClause}) VALUES (${valuesClause})`
    console.log('\'' + query + '\'')

    db.query(query, function(err, rows, fields) {
      if (!err)
        console.log('Query results:\n', rows);
      else
        console.log('Error while performing Query.');
      resolve(rows)
    });
  })
}
