
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
const captcha = require('../controllers/captcha.js')
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
 * This endpoint returns a JSON list of image paths
 *
 * @param none
 * @return {JSON} {imagePath}
 */
router.get('/getCardInfo', (req, res) => {
  index.getCardInfo()
    .then(function (result) {
      res.status(200)
      res.send(result)
    })
    .catch(function(err) {
      console.log(err)
      res.status(404)
      res.send('failed.')
    })
})

/**
 * This endpoint returns a JSON list of image paths
 *
 * @param none
 * @return {JSON} {projectID, projectName, projectURL, projectSecondaryURL, projectTertiaryURL, projectImage, projectDetails, projectLanguagesAndTechnologies, projectRole}
 */
router.get('/getProjectInfo', (req, res) => {
  dbQuery.getQueryResults('projects', 'projectID', 'ASC')
    .then(function (result) {
      res.status(200)
      res.send(result)
    })
    .catch(function(err) {
      console.log(err)
      res.status(404)
      res.send('failed.')
    })
})

/**
 * This endpoint updates the database with a new comment.
 *
 * @param {JSON} {guestName, guestComment, reCAPTCHAToken}
 * @return {URL} {guestBookURL}
 */
router.post('/submitComment', (req, res) => {
  console.log('Comment submission endpoint.')
  console.log(req.body.guestName)
  console.log(req.body.guestComment)
  console.log(req.body['g-recaptcha-response'])
  console.log(captchaSecretKey)
  // ---------- BEGIN FORM VALIDATION SECTION ----------
  // if (!formValidation.validateCommentSubmissionForm(req.body)) {
  //   res.status(422)
  //   res.send('Report form validation failed!')
  //   console.log('Report form validation failed!')
  //   return
  // }
  // ---------- END FORM VALIDATION SECTION ----------

  // ---------- BEGIN CAPTCHA VALIDATION SECTION ----------
  // g-recaptcha-response is the token that is generated when the user succeeds
  // in a captcha challenge.
  var params = {
    'g-recaptcha-response': req.body['g-recaptcha-response'],
    'remote-address': req.connection.remoteAddress
  }
  // Start the verification process.
  captcha.getCaptchaValidationStatus(params, function (err, result) {
    // If the verification process failed, tell the user and do not enter data into DB.
    if (err) {
      console.log('Captcha invalid, value: ', err)
      res.status(422)
      res.send(err)
      return
    } else {
      // If we get here, then the token is valid.
      // Remove the captcha token from the original data packet.
      delete req.body['g-recaptcha-response']

      // ---------- BEGIN COMMENT INSERTION SECTION ----------
      // Now that the validation is done, create the report.
      dbQuery.executeInsertQuery(`guestbook`, `guestName, guestComment`, `'${req.body.guestName}', '${req.body.guestComment}'`)
        .then(function (result) {
          res.status(200)
          res.redirect('guestbook.html')
          return
        })
        .catch(function(err) {
          console.log('Error creating comment: ' + err)
          res.status(422)
          res.send('Error creating comment\n')
          return
        })
      // ---------- END COMMENT INSERTION SECTION ----------
    }
  })
  // ---------- END CAPTCHA VALIDATION SECTION ----------
})
