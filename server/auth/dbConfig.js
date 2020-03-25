// Using the mysql npm package, we will create a connection
// to the app's database to retrieve information.
const mysql = require('mysql')

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_TO_USE
})

module.exports = db
