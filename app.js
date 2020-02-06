// Initialize the application and set listening port.
const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')
const httpPort = process.env.HTTP_PORT
const httpsPort = process.env.HTTPS_PORT

const app = express()

app.set({
  'trust proxy': 1
})

// Create the https server.
const openSSLCredentials = {
  key: fs.readFileSync(path.join(__dirname, 'auth/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'auth/cert.pem')),
  passphrase: process.env.OPEN_SSL_PASSPHRASE
}

// Check all incoming traffic to see if it is connecting securely.
app.all('*', ensureSecure)

// Check the request and redirect to https if the user is connecting from unsecured http.
function ensureSecure (req, res, next) {
  if (req.protocol !== 'https') {
    // If the connection is an https connection, send it off to the appropriate route.
    return res.redirect('https://' + req.headers.host.replace(/:(.*)/g, '') + req.url)
  } else {
    // Otherwise, send the packet along to a proper endpoint if one exists.
    return next()
  }
}

// Extracts the json web token from the incoming request's authorization header if it exists and
// places it in the body for processing in the proper request handler.
// Header format: { Authorization: Bearer <token> }
exports.checkForToken = function (req, res, next) {
  console.log('In token verification.')
  const authorizationBearerHeader = req.headers.authorization

  // Try to get the token out of the header.
  // If it does not exist, then set the token field to null.
  if (typeof authorizationBearerHeader !== 'undefined') {
    const bearer = authorizationBearerHeader.split(' ')
    const bearerToken = bearer[1]

    req.token = bearerToken
  } else {
    // The user is a guest, which coresponds to 0 in our hierarchy.
    req.token = null
  }

  // Continue on to the next piece of middleware.
  return next()
}

// Let's use these routers as well:
// The core of the website.
const mainAppRouter = require('./routes/mainAppRoutes.js')
app.use(mainAppRouter)
// The login and registration pages for admin use.
const loginRegistrationRoutes = require('./routes/loginRegistrationRoutes.js')
app.use(loginRegistrationRoutes)

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
