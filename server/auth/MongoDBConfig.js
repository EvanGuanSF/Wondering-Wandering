// Using the mysql npm package, we will create a connection
// to the app's database to retrieve information.
const mysql = require('mysql')
const { MongoClient } = require('mongodb')

// Setup uri components.
const username = encodeURIComponent(process.env.MONGODB_USER)
const password = encodeURIComponent(process.env.MONGODB_PASSWORD)
const hostname = process.env.MONGODB_HOST
const authMechanism = "DEFAULT"
const mongodbURI = `mongodb://${username}:${password}@${hostname}/?authMechanism=${authMechanism}`
// console.log(`mongodb://${username}:${password}@${hostname}/?authMechanism=${authMechanism}`)

// Connect to the database.
const myMongoDB = new MongoClient(mongodbURI);
myMongoDB.connect();

// Export this connection for use elsewhere.
module.exports = myMongoDB
