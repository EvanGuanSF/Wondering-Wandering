// Define Express and make a router.
const express = require('express')
const loginRegistrationRoutes = express.Router()
module.exports = loginRegistrationRoutes

// Add additional middleware imports.
const path = require('path')
const rateLimit = require('express-rate-limit')
const redisStore = require('rate-limit-redis')
const redis = require('redis')

// JSON parser.
const bodyParser = require('body-parser')
loginRegistrationRoutes.use(bodyParser.urlencoded({ extended: true }))
loginRegistrationRoutes.use(bodyParser.json())

// Our controllers/endpoints.
const loginController = require('../controllers/loginController.js')
const registrationController = require('../controllers/registrationController.js')

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

// GET login page.
loginRegistrationRoutes.get('/api/login', pageLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   pageLimiter(req, res)
  // }
  // Log the request.
  res.status(200)
  res.sendFile(path.resolve('views/public/login.html'))
})

// GET registration page.
loginRegistrationRoutes.get('/api/register', pageLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   pageLimiter(req, res)
  // }
  res.status(200)
  res.sendFile(path.resolve('views/public/register.html'))
})

/**
 * The existing user login endpoint.
 *
 * @param {JSON} {email, password, reCAPTCHAtoken}
 * @return {JSON} {loginResponseWebtoken}
 */
loginRegistrationRoutes.post('/api/login', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('Existing user login endpoint.')
  loginController.userLogin(req, res)
})

/**
 * The new registration endpoint.
 *
 * @param {JSON} {email, password, passwordConfirmation, reCAPTCHAtoken}
 * @return {JSON} {registrationResponse}
 */
loginRegistrationRoutes.post('/api/register', mysqlApiLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   mysqlApiLimiter(req, res)
  // }
  console.log('New registration endpoint.')
  // res.send('ok.')
  registrationController.userRegistration(req, res)
})
