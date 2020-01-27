// Define Express and make a router.
const express = require('express')
const router = express.Router()
module.exports = router

// Add additional middleware imports.
const https = require('https')
const path = require('path')
const rateLimit = require('express-rate-limit')
const redisStore = require('rate-limit-redis')
const redis = require('redis')

// JSON parser.
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

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
  max: 30, // limit each IP to max requests per windowMs
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
  max: 90, // limit each IP to max requests per windowMs
  message: 'Please wait to perform more actions.'
})


// GET index.
router.get('/', pageLimiter, function (req, res) {
  // Log the request.
  console.log('GET request for the homepage')
  // Return successful get request status.
  res.status(200)
  // Send the index file via path relative to the one we defined above.
  res.sendFile('index.html')
})

// GET guestbook.
router.get('/guestbook', pageLimiter, function (req, res) {
  // Log the request.
  console.log('GET request for guestbook')
  // Return successful get request status.
  res.status(200)
  // Send the index file via path relative to the one we defined above.
  res.sendFile(path.resolve('views/public/guestbook.html'))
})

/**
 * This endpoint returns a JSON list of project information
 *
 * @param none
 * @return {JSON} {projectID, projectName, projectURL, projectSecondaryURL, projectTertiaryURL, projectImage, projectDetails, projectLanguagesAndTechnologies, projectRole}
 */
router.get('/getProjectInfo', mysqlApiLimiter, (req, res) => {
  console.log('Project info request endpoint.')
  index.selectProjectInfo(req, res)
})

/**
 * This endpoint updates the database with a new comment.
 *
 * @param {JSON} {guestName, guestComment, reCAPTCHAToken}
 * @return {URL} {guestBookURL}
 */
router.post('/submitComment', mysqlApiLimiter, (req, res) => {
  console.log('Comment submission endpoint.')
  guestbook.insertComment(req, res)
})

/**
 * This endpoint gets comments from the database.
 *
 * @param {}
 * @return {JSON} {guestName, guestComment}
 */
router.get('/getComments', mysqlApiLimiter, (req, res) => {
  console.log('Getting comments.')
  guestbook.selectComments(req, res)
})

/**
 * This endpoint gets comments from the database.
 *
 * @param {}
 * @return {JSON} {guestName, guestComment}
 */
router.get('/getRandomSubtitle', mysqlApiLimiter, (req, res) => {
  console.log('Getting random subtitle.')
  navbar.getRandomSubtitle(req, res)
})

/**
 * This endpoint gets the count of unique visitors from the database.
 *
 * @param {}
 * @return {JSON} {visitorCount}
 */
router.get('/getVisitorCount', mysqlApiLimiter, (req, res) => {
  console.log('Getting visitor count.')
  visitorCount.getVisitorCount(req, res)
})
