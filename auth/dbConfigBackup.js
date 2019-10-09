// Using the mysql npm package, we will create a connection
// to the database.
const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'subdomain.domain.domainextension',
  user: 'db_user',
  password: 'user_pw',
  database: 'optional_db_to_use'
})

module.exports = db
