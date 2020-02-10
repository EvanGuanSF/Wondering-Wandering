// Initialize the application and set listening port.
const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const httpPort = process.env.HTTP_PORT
const httpsPort = process.env.HTTPS_PORT

const app = express()

// Setup cookie parser.
app.use(cookieParser())

// Setup security configuration and middleware.
app.set({
  'trust proxy': 1
})

// Do not tell the client what type of backend framework is being used.
app.disable('x-powered-by')

// Create the https server.
var openSSLCredentials = ''
if (process.env.ENV === 'dev') {
  console.log('Application started in ' + process.env.ENV + ' configuration.')

  openSSLCredentials = {
    key: fs.readFileSync(path.resolve(process.env.OPEN_SSL_KEY_PATH.toString())),
    cert: fs.readFileSync(path.resolve(process.env.OPEN_SSL_CERTIFICATE_PATH.toString())),
    passphrase: process.env.OPEN_SSL_PASSPHRASE
  }
} else if (process.env.ENV === 'production') {
  console.log('Application started in ' + process.env.ENV + ' configuration.')

  openSSLCredentials = {
    key: fs.readFileSync(path.resolve(process.env.OPEN_SSL_KEY_PATH.toString())),
    cert: fs.readFileSync(path.resolve(process.env.OPEN_SSL_CERTIFICATE_PATH.toString()))
  }
}

// Check all incoming traffic to see if it is connecting securely.
app.all('*', ensureSecure)

// Check the request and redirect to https if the client is connecting from unsecured http.
function ensureSecure (req, res, next) {
  if (req.protocol !== 'https') {
    // If the connection is an https connection, send it off to the appropriate route.
    return res.redirect('https://' + req.headers.host.replace(/:(.*)/g, '') + req.url)
  } else {
    // Otherwise, send the packet along to a proper endpoint if one exists.
    return next()
  }
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
