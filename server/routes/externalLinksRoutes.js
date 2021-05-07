// Define Express and make a router.
const express = require('express')
const externalLinksRoutes = express.Router()
module.exports = externalLinksRoutes

// Add additional middleware imports.
const path = require('path')
const rateLimit = require('express-rate-limit')
const redisStore = require('rate-limit-redis')
const redis = require('redis')

// Our controllers/endpoints.
const externalLinks = require('../controllers/externalLinksController.js')

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
externalLinksRoutes.get('/external-links', pageLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   pageLimiter(req, res)
  // }
  // Log the request.
  res.status(200)
  res.sendFile(path.resolve('views/public/external-links.html'))
})

// GET login page.
externalLinksRoutes.get('/api/getExternalLinkInfo', pageLimiter, (req, res) => {
  // if (process.env.ENV === 'production') {
  //   pageLimiter(req, res)
  // }
  // Log the request.
  res.status(200)
  externalLinks.getExternalLinkInfo(req,res)
})