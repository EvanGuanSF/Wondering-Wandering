// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')
//const sqlstring = require('sqlstring');

// JSON parser.
const bodyParser = require('body-parser')

// Our controllers/endpoints.
const captcha = require('../controllers/captchaController.js')
const dbQuery = require('../controllers/dbQuery.js')

exports.insertComment = function (req, res) {
  // ---------- BEGIN CAPTCHA VALIDATION SECTION ----------
  // g-recaptcha-response is the token that is generated when the user succeeds
  // in a captcha challenge.
  // req.connection.remoteAddress will provide IP address of connected user.
  var captchaValidationParams = {
    'g-recaptcha-response': req.body['g-recaptcha-response'],
    'remote-address': req.connection.remoteAddress
  }
  // Start the verification process.
  captcha.getCaptchaValidationStatus(captchaValidationParams, function (err, result) {
    // If the verification process failed, tell the user and do not enter data into DB.
    if (err || !result) {
      // console.log('Captcha invalid: ', err)
      // res.status(422)
      // res.send('Error creating comment.')
      // return
    } else {
      // If we get here, then the token is valid, so validate the data and then send it to the database.
      // ---------- BEGIN FORM VALIDATION SECTION ----------
      if(!isGuestNameValid(req.body.guestName) || !isGuestCommentValid(req.body.guestComment)) {
        console.log('Error creating comment: invalid guest name and/or comment')
        res.status(422)
        return
      }

      guestName = validator.trim(req.body.guestName)
      console.log(req.body.guestName + ' -> ' + guestName)
      guestComment = validator.trim(req.body.guestComment)
      console.log(req.body.guestComment + ' -> ' + guestComment)
      // ---------- END FORM VALIDATION SECTION ----------

      // ---------- BEGIN COMMENT INSERTION SECTION ----------
      // Build the query.
      var sql = 'INSERT INTO ?? (??, ??) VALUES (?, ?)'
      var inserts = ['guestbook', 'guestName', 'guestComment', guestName, guestComment]
      var query = mysql.format(sql, inserts)

      dbQuery.executeQuery(query)
        .then(function (result) {
          res.status(200)
          res.redirect('guestbook.html')
          return
        })
        .catch(function(err) {
          console.log('Error creating comment: ' + err)
          res.status(422)
          return
        })
      // ---------- END COMMENT INSERTION SECTION ----------
    }
  })
  // ---------- END CAPTCHA VALIDATION SECTION ----------
}

exports.selectComments = function (req, res) {
  // Build the query.
  var sql = 'SELECT ??, ?? FROM  ?? ORDER BY ?? DESC'
  var inserts = ['guestName', 'guestComment', 'guestbook', 'guestID']
  var query = mysql.format(sql, inserts)

  // Execute
  dbQuery.executeQuery(query)
    .then(function (result) {
      res.status(200)
      res.send(result)
    })
    .catch(function(err) {
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
