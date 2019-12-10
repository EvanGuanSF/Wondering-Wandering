// Using the mysql npm package, we will create a connection
// to the database.
const mysql = require('mysql')

const db = mysql.createPool({
  host: 'subdomain.domain.domainextension',
  user: 'db_user',
  password: 'db_user_pw',
  database: 'general_db'
})

module.exports = db
