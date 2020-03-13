// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')

// Our controllers/endpoints.
const captcha = require('../controllers/captchaController.js')
const dbQuery = require('../controllers/dbQuery.js')

exports.insertComment = function (req, res) {
  // g-recaptcha-response is the token that is generated when the user succeeds in a captcha challenge.
  // req.connection.remoteAddress will provide IP address of connected user.
  var captchaValidationParams = {
    'g-recaptcha-response': req.body['g-recaptcha-response'],
    'remote-address': req.connection.remoteAddress
  }

  console.log(req.body)

  // Start the verification process.
  captcha.getCaptchaValidationStatus(captchaValidationParams)
    .then(result => {
      // If we get here, then the token is valid, so validate the data and then send it to the database.
      if (!isGuestNameValid(req.body.guestName) || !isGuestCommentValid(req.body.guestComment)) {
        console.log('Error creating comment: Invalid guest name and/or comment')
        res.status(422)
        return
      }

      // Build the comment insert query.
      var guestName = validator.trim(req.body.guestName)
      var guestComment = validator.trim(req.body.guestComment)
      var sql = 'INSERT INTO ?? (??, ??) VALUES (?, ?)'
      var inserts = ['guestbook', 'guestName', 'guestComment', guestName, guestComment]
      var query = mysql.format(sql, inserts)

      dbQuery.executeQuery(query)
        .then(result => {
          console.log('Comment from ' + req.connection.remoteAddress + ' created successfully.\n')
          res.status(200)
          res.redirect('guestbook')
        })
        .catch(err => {
          console.log('Error creating commen from ' + req.connection.remoteAddress + '.\n', err)
          res.status(422)
        })
    })
    .catch(error => {
      console.log('Error creating comment: Captcha from ' + req.connection.remoteAddress + ' invalid.\n', error)
      res.status(422)
      res.send('Error creating comment: Captcha token invalid.')
    })
}

exports.selectComments = function (req, res) {
  // Build the query.
  var sql = 'SELECT ??, ?? FROM  ?? ORDER BY ?? DESC'
  var inserts = ['guestName', 'guestComment', 'guestbook', 'guestID']
  var query = mysql.format(sql, inserts)

  // Execute
  dbQuery.executeQuery(query)
    .then(result => {
      res.status(200)
      res.send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.send('Failed to receive project data.')
    })
}

// Validate guest name input.
function isGuestNameValid (name) {
  console.log('checking name: ' + name)
  if (validator.isLength(name + '', { min: 2, max: 40 })) {
    // Name is ok.
    return true
  } else {
    // Name is invalid.
    return false
  }
}

// Validate guest comment input.
function isGuestCommentValid (comment) {
  console.log('checking comment: ' + comment)
  if (validator.isLength(comment + '', { min: 2, max: 500 })) {
    // Comment is ok.
    return true
  } else {
    // Comment is invalid.
    return false
  }
}
