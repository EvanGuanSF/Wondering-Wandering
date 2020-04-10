// Define Express and make a router.
const express = require('express')
const mainAppRouter = express.Router()

// Add additional middleware imports.
const path = require('path')
const rateLimit = require('express-rate-limit')
const redisStore = require('rate-limit-redis')
const redis = require('redis')

// JSON parser.
const bodyParser = require('body-parser')
mainAppRouter.use(bodyParser.urlencoded({ extended: true }))
mainAppRouter.use(bodyParser.json())

// Our controllers/endpoints.
const index = require('../controllers/indexController.js')
const guestbook = require('../controllers/guestbookController.js')
const navbar = require('../controllers/navbarController.js')
const visitorCount = require('../controllers/visitorCountController.js')
const userValidation = require('../controllers/userVerificationUtilities.js')

// Limiter for webpages.
const pageLimiter = process.env.ENV === 'dev' ? (req, res, next) => { return next() } : rateLimit({
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
const mysqlApiLimiter = process.env.ENV === 'dev' ? (req, res, next) => { return next() } : rateLimit({
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
mainAppRouter.get('/', userValidation.refreshLoginToken, pageLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   pageLimiter(req, res)
  // }
  // Log the request.
  console.log('GET request for the homepage over: ' + req.protocol)

  // Return successful get request status.
  res.status(200)
  // Send the index file via path relative to the one we defined above.
  res.sendFile(path.resolve('views/public/index.html'))
})

// GET guestbook.
mainAppRouter.get('/api/guestbook', pageLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   pageLimiter(req, res)
  // }
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
mainAppRouter.get('/api/getProjectInfo', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('Getting project info.')
  index.selectProjectInfo(req, res)
})

/**
 * This endpoint updates the database with a new comment.
 *
 * @param {JSON} {guestName, guestComment, reCAPTCHAToken}
 * @return {URL} {guestBookURL}
 */
mainAppRouter.post('/api/submitComment', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('Comment submission endpoint.')
  guestbook.insertComment(req, res)
})

/**
 * This endpoint gets comments from the database.
 *
 * @param {}
 * @return {JSON} {guestName, guestComment}
 */
mainAppRouter.get('/api/getComments', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('Getting comments.')
  guestbook.getComments(req, res)
})

/**
 * This endpoint gets comments from the database.
 *
 * @param {}
 * @return {JSON} {guestName, guestComment}
 */
mainAppRouter.get('/api/getRandomSubtitle', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('Getting random subtitle.')
  navbar.getRandomSubtitle(req, res)
})

/**
 * This endpoint gets the count of unique visitors from the database.
 *
 * @param {}
 * @return {JSON} {visitorCount}
 */
mainAppRouter.get('/api/getVisitorCount', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('Getting visitor count.')
  visitorCount.getVisitorCount(req, res)
})

module.exports = mainAppRouter
