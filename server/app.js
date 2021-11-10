// Initialize the application and set listening port.
require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const httpPort = process.env.HTTP_PORT

const app = express()

// Setup cookie parser.
app.use(cookieParser())

// Setup security configuration and middleware.
app.set({
  'trust proxy': 1
})

// Do not tell the client what type of backend framework is being used.
app.disable('x-powered-by')

// Always check for login tokens coming in to any route.
// Update the cookies if applicable.
const loginUtilities = require('./controllers/userVerificationUtilities')
app.use('*', loginUtilities.refreshLoginToken)

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

// Set the base directory for all resource requests.
app.use('/', express.static(path.join(__dirname, 'views/public')))
