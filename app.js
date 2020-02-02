// Initialize the application and set listening port.
const https = require('https');
const fs = require('fs');
const express = require('express')
const path = require('path');
const httpPort = 3000
const httpsPort = 3001

// Reference to login credentials for db access.
const db = require('./auth/dbConfig.js')

const app = express()

app.set({
  'trust proxy': 1
})

// OpenSSL passphrase var from json file.
var rawData = fs.readFileSync('auth/openSSLPassphrase.json')
var jsonData = JSON.parse(rawData)
const SSLPassphrase = jsonData['passphrase']

// Create the https server.
const openSSLCredentials = {
  key: fs.readFileSync(path.join(__dirname, 'auth/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'auth/cert.pem')),
  passphrase: SSLPassphrase
}

// Check all incoming traffic to see if it is connecting securely.
app.all('*', ensureSecure)

// Check the request and redirect to https if the user is connecting from unsecured http.
function ensureSecure(req, res, next){
  if(req.protocol != 'https') {
    // If the connection is an https connection, send it off to the appropriate route.
    return res.redirect('https://' + req.headers.host.replace(/:(.*)/g, '') + req.url)
  } else {
    // Otherwise, send the packet along to a proper endpoint if one exists.
    return next();
  }
}

// Let's use these routers as well:
// The core of the website.
const mainAppRouter = require('./routes/mainAppRoutes.js')
app.use(mainAppRouter)
// The login page for admin use.
const loginRoutes = require('./routes/loginRoutes.js')
app.use(loginRoutes)

// Start the http server by listening on predefined port.
app.listen(httpPort, function () {
  console.log(`HTTP server is up and listening on port ${httpPort}.`)
})

// Start the https server by listening on predefined port.
https.createServer(openSSLCredentials, app)
.listen(httpsPort, function () {
  console.log(`HTTPS server is up and listening on port ${httpsPort}.`)
})

// Set the base directory for all resource requests.
app.use('/', express.static(path.join(__dirname, 'views/public')))