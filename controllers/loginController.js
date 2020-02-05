// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')
const jwt = require('jsonwebtoken')

// Our controllers/endpoints.
const dbQuery = require('./dbQuery.js')
const captcha = require('../controllers/captchaController.js')
// State of the art password hashing algorithm.
const argon2 = require('argon2')

// jSON web token secret var from json file.
const fs = require('fs')
var rawData = fs.readFileSync('auth/credentials.json')
var jsonData = JSON.parse(rawData)
const jwtSecret = jsonData.jsonWebTokenSecret

exports.userLogin = function (req, res) {
  // Execute the async function to create a new user.
  verifyUser(req, res)
}

/**
 * Uses the form data submitted to attempt to login an existing user.
 * @param {*} req
 * @param {*} res
 */
async function verifyUser (req, res) {
  var email = req.body.email
  var password = req.body.password
  var userInformation = ''

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
        res.status(401)
        res.send('Invalid username or email.')
        throw new Error('Email is malformed.')
      }

      if (!isPasswordValid(password)) {
        res.status(401)
        res.send('Invalid username or email.')
        throw new Error('Password is malformed.')
      }

      // Check to make sure that the email exists in the database.
      var sql = 'SELECT COUNT(*) AS emailMatches FROM ?? WHERE email = (?)'
      var inserts = ['users', email]
      var query = mysql.format(sql, inserts)

      // Execute.
      return dbQuery.executeQuery(query)
    })
    .then(function (result) {
      // If the result is 0, then the email does not exist,
      // so stop here and return an error code.
      console.log('Email matches: ' + result[0].emailMatches)
      if (result[0].emailMatches === 0) {
        res.status(401)
        res.send('Invalid username or email.')
        throw new Error('Invalid username or email.')
      }

      // Get the password hash associated with the email given.
      var sql = 'SELECT ??, ??, ??, ?? FROM ?? WHERE email = (?)'
      var inserts = ['uuid', 'email', 'password', 'role', 'users', email]
      var query = mysql.format(sql, inserts)

      // Execute.
      return dbQuery.executeQuery(query)
    })
    .then(function (results) {
      userInformation = results
      var existingHashedPassword = results[0].password
      console.log('Checking password: ' + password + ' against existing hash: ' + existingHashedPassword)

      // Verify the password.
      return argon2.verify(existingHashedPassword, password)
    })
    .then((isPasswordCorrect, existingHashedPassword) => {
      console.log('Password match: ' + isPasswordCorrect)

      if (!isPasswordCorrect) {
        res.status(401)
        res.send('Invalid username or email.')
        throw new Error('Wrong password supplied.')
      }

      // The user has been logged in successfully.
      if (userInformation[0].role === 3) {
        // Since the user is an admin, make and sign a json web token for them.
        const jwtTokenData = {
          uuid: userInformation.uuid,
          email: userInformation.email,
          role: userInformation.role
        }

        jwt.sign({ jwtTokenData }, jwtSecret, { expiresIn: '24h' }, function (error, token) {
          if (error) {
            throw new Error(error)
          } else {
            res.json({
              success: true,
              status: 200,
              token: token
            })
          }
        })
      }
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

// Validate user email address.
function isEmailValid (email) {
  if (validator.isEmail(email, { max: 50 })) {
    return true
  } else {
    return false
  }
}

// Validate user password.
function isPasswordValid (password) {
  if (validator.isLength(password, { min: 5, max: 30 })) {
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
