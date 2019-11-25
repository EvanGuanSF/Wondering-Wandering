
// Define Express and make a router.
const express = require('express')
const router = express.Router()
module.exports = router

// Add additional middleware imports.
const https = require('https')
const path = require('path')

// JSON parser.
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// Our controllers/endpoints.
const index = require('../controllers/indexController.js')
const guestbook = require('../controllers/guestbookController.js')
const navbar = require('../controllers/navbarController.js')
const dbQuery = require('../controllers/dbQuery.js')

// GET guestbook.
router.get('/guestbook', function (req, res) {
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
router.get('/getProjectInfo', (req, res) => {
  console.log('Project Info Request endpoint.')
  index.selectProjectInfo(req, res)
})

/**
 * This endpoint updates the database with a new comment.
 *
 * @param {JSON} {guestName, guestComment, reCAPTCHAToken}
 * @return {URL} {guestBookURL}
 */
router.post('/submitComment', (req, res) => {
  console.log('Comment submission endpoint.')
  guestbook.insertComment(req, res)
})

/**
 * This endpoint gets comments from the database.
 *
 * @param {}
 * @return {JSON} {guestName, guestComment}
 */
router.get('/getComments', (req, res) => {
  console.log('Getting comments.')
  guestbook.selectComments(req, res)
})

/**
 * This endpoint gets comments from the database.
 *
 * @param {}
 * @return {JSON} {guestName, guestComment}
 */
router.get('/getRandomSubtitle', (req, res) => {
  console.log('Getting random subtitle.')
  navbar.getRandomSubtitle(req, res)
})
