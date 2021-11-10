// Using the mysql npm package, we will create a connection
// to the app's database to retrieve information.
const mysql = require('mysql')

const mySQLdb = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_TO_USE
})

module.exports = mySQLdb
