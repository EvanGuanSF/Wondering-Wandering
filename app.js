// Initialize the application and set listening port.
const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/routes.js')
app.set('trust proxy', 1);

// Reference to login crednetials for db access.
const db = require('./auth/dbConfig.js')

// Set the base directory for all resource requests.
const path = require('path');
app.use(express.static(path.join(__dirname, 'views/public')))
// Let's use routes in this file as well.
app.use(router)

// Start server by listening on predefined port.
app.listen(port, function () {
  console.log(`App.js is up and listening on port ${port}.`)
})
