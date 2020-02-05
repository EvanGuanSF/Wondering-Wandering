// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')

// Our controllers/endpoints.
const dbQuery = require('./dbQuery.js')
const captcha = require('../controllers/captchaController.js')
// State of the art password hashing algorithm.
const argon2 = require('argon2')

exports.userRegistration = function (req, res) {
  // Execute the async function to create a new user.
  createUser(req, res)
}

/**
 * Uses the form data submitted to attempt to register a new user.
 * @param {*} req
 * @param {*} res
 */
async function createUser (req, res) {
  var email = req.body.email
  var password = req.body.password
  var passwordConfirmation = req.body.passwordConfirmation

  // Check for the captcha before going any further.
  if (!isReCAPTCHAValid(req.body['g-recaptcha-response'])) {
    res.status(409)
    res.send('Captcha is invalid.')
    console.log('Invalid captcha received.')
    return
  }

  // Check the captcha response for validity.
  // g-recaptcha-response is the token that is generated when the user succeeds in a captcha challenge.
  // req.connection.remoteAddress will provide IP address of connected user.
  var captchaValidationParams = {
    'g-recaptcha-response': req.body['g-recaptcha-response'],
    'remote-address': req.connection.remoteAddress
  }

  // Start the verification process.
  captcha.getCaptchaValidationStatus(captchaValidationParams)
    .then((result) => {
      // Verify that the email and password are of correct type and above minimum length.
      if (!isEmailValid(email)) {
        res.status(409)
        res.send('Invalid email.')
        throw new Error('Email is malformed.')
      }

      if (!isPasswordValid(password)) {
        res.status(409)
        res.send('Invalid password.')
        throw new Error('Password is malformed.')
      }

      if (!isPasswordConfirmationValid(password, passwordConfirmation)) {
        res.status(409)
        res.send('Passwords do not match.')
        throw new Error('Passwords do not match.')
      }

      // Check if the email already exists in the database.
      var sql = 'SELECT COUNT(*) AS emailMatches FROM ?? WHERE email = (?)'
      var inserts = ['users', email]
      var query = mysql.format(sql, inserts)

      // Execute.
      console.log('Executing new user email check.')
      return dbQuery.executeQuery(query)
    })
    .then(function (result) {
      // if the result is > 0, then the email already exists.card
      console.log('Email matches: ' + result[0].emailMatches)
      if (result[0].emailMatches > 0) {
        res.status(409)
        res.send('Email address is already in use. Did you mean to log in?')
        throw new Error('Email address is already in use.')
      }

      return argon2.hash(password, {
        type: argon2.argon2id
      })
    })
    .then(passwordHash => {
      console.log(passwordHash)

      // Insert the new user in to the database.
      // The new user will not have any extra privileges until their role is changed by a database admin.
      // Build the query.
      var sql = 'INSERT INTO ?? (uuid, ??, ??, ??) VALUES (UUID(), ?, ?, ?)'
      var inserts = ['users', 'email', 'password', 'role', email, passwordHash, 1]
      var query = mysql.format(sql, inserts)

      return dbQuery.executeQuery(query)
    })
    .then(result => {
      // The user has been created successfully, so redirect them to the login page.
      console.log(result)
      res.json({
        status: 302,
        redirect: '/login'
      })
      return null
    })
    .catch(error => {
      // Something went wrong somewhere along the way.
      if (error !== null) {
        console.log(error)
      } else {
        console.log('Error with something.')
      }
      return null
    })
}

// Validate new user email address.
function isEmailValid (email) {
  if (validator.isEmail(email, { max: 50 })) {
    return true
  } else {
    return false
  }
}

// Validate new user password.
function isPasswordValid (password) {
  if (validator.isLength(password, { min: 5, max: 30 })) {
    return true
  } else {
    return false
  }
}

// Validate new user password match.
function isPasswordConfirmationValid (password, passwordConfirmation) {
  if (password === passwordConfirmation) {
    return true
  } else {
    return false
  }
}

// Validate reCAPTCHA status.
function isReCAPTCHAValid (grecaptcha) {
  if (grecaptcha && grecaptcha.length > 0) {
    return true
  } else {
    return false
  }
}
