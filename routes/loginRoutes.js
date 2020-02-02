// Define Express and make a router.
const express = require('express')
const loginRoutes = express.Router()
module.exports = loginRoutes

// Add additional middleware imports.
const https = require('https')
const path = require('path')
const rateLimit = require('express-rate-limit')
const redisStore = require('rate-limit-redis')
const redis = require('redis')

// JSON parser.
const bodyParser = require('body-parser')
loginRoutes.use(bodyParser.urlencoded({ extended: true }))
loginRoutes.use(bodyParser.json())

// Our controllers/endpoints.
const index = require('../controllers/indexController.js')
const guestbook = require('../controllers/guestbookController.js')
const navbar = require('../controllers/navbarController.js')
const visitorCount = require('../controllers/visitorCountController.js')
const dbQuery = require('../controllers/dbQuery.js')


// Limiter for webpages.
const pageLimiter = rateLimit({
  store: new redisStore({
    client: redis.createClient({
      host: 'redis-server',
      port: 6379
  }),
    expiry: 60, // seconds - how long each rate limiting window exists for.
    resetExpiryOnChange: false
  }),
  max: 30, // maximum number of requests per minute
  message: 'Please wait to perform more actions.'
})

// Limiter for MySQL APIs.
const mysqlApiLimiter = rateLimit({
  store: new redisStore({
    client: redis.createClient({
      host: 'redis-server',
      port: 6379
  }),
    expiry: 60, // seconds - how long each rate limiting window exists for.
    resetExpiryOnChange: false
  }),
  max: 150, // maximum number of requests per minute
  message: 'Please wait to perform more actions.'
})


// GET index.
loginRoutes.get('/login', pageLimiter, function (req, res) {
  // Log the request.
  console.log('GET request for the login page with params: ')
  console.log(req.protocol)
  // Check to make sure the page is accessed over https.
  if(req.protocol != 'https') {
    console.log('Redirecting to secure version: ' + 'https://' + req.headers.host.replace(/:(.*)/g, '') + ':80' + req.url)
    return res.redirect('https://' + req.headers.host.replace(/:(.*)/g, '') + ':443' + req.url)
  }
  // Return successful get request status.
  res.status(200)
  // Send the index file via path relative to the one we defined above.
  //res.send(__dirname)
  res.sendFile(path.resolve('views/public/login.html'))
})

/**
 * This endpoint returns a JSON list of project information
 *
 * @param none
 * @return {JSON} {projectID, projectName, projectURL, projectSecondaryURL, projectTertiaryURL, projectImage, projectDetails, projectLanguagesAndTechnologies, projectRole}
 */
loginRoutes.post('/login', (req, res) => {
  console.log('Login endpoint.')
  console.log(req)
})