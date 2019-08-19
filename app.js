// Initialize the application and set listening port.
const express = require('express')
const app = express()
const port = 3000

// Set the base directory for all resource requests.
app.use(express.static(__dirname + '/view'))

// Start server by listening on predefined port.
app.listen(port, function () {
  console.log(`App.js is up and listening on port ${port}.`)
})

// GET index.
app.get('/', function (req, res) {
  // Log the request.
  console.log('GET request to the homepage')
  // Return successful get request status.
  res.status(200)
  // Send the index file via path relative to the one we defined above.
  res.sendFile('index.html')
})
