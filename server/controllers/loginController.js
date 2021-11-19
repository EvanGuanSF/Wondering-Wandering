// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')
const cookie = require('cookie')
const ms = require('ms')

// Our controllers/endpoints.
const mySQLdb = require('./queryMySQL.js')
const captcha = require('../controllers/captchaController.js')
const userValidation = require('../controllers/userVerificationUtilities.js')
// State of the art password hashing algorithm.
const argon2 = require('argon2')

exports.userLogin = function (req, res) {
  console.log(req.body)

  // Execute the async function to log in a user.
  if (process.env.ENV === 'dev') {
    verifyUserDev(req, res)
  } else if (process.env.ENV === 'production') {
    verifyUser(req, res)
  } else {
    console.log('NO ENV VARIABLE SET IN .ENV (dev, production)')
    return null
  }
}

/**
 * Uses the form data submitted to attempt to login an existing user.
 * @param {*} req
 * @param {*} res
 */
function verifyUser (req, res) {
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
    .then(result => {
      // If the captcha is valid, continue to the main login loop.
      mainLoginLoop(req, res)
    })
    .catch(error => {
      // Something went wrong somewhere along the way.
      if (error !== null) {
        console.log(error)
      } else {
        console.log('Error with something.')
      }
      res.status(409)
      res.send('Captcha is invalid.')
      console.log('Invalid captcha. Captcha token is not legitimate.')
    })
}

/**
 * Testing version of user login. Does not use reCAPTCHA.
 * Uses the form data submitted to attempt to login an existing user.
 * @param {*} req
 * @param {*} res
 */
function verifyUserDev (req, res) {
  mainLoginLoop(req, res)
}

/**
 * The main login loop. Sanitizes and verifies a user's credentials.
 * Returns a json web token in the header and the user name in the header.
 * @param {*} req
 * @param {*} res
 */
async function mainLoginLoop (req, res) {
  var sanitizedEmail = validator.normalizeEmail(req.body.email.trim())
  var password = req.body.password.trim()

  // Verify that the password is within spec.
  if (!isPasswordValid(password)) {
    res.status(401)
    res.send('Invalid username or email.')
    throw new Error('Password is malformed.')
  }

  try {
    var existingEmailCheckResult = await userValidation.checkUserEmailExists(sanitizedEmail)
    // If the result is 0, then the email does not exist,
    // so stop here and return an error code.
    if (existingEmailCheckResult.emailMatches <= 0) {
      res.status(401)
      res.send('Invalid username or email.')
      throw new Error('Invalid username or email.')
    }

    // Get the user information associated with the email given.
    var sql = 'SELECT ??, ??, ??, ??, ?? FROM ?? WHERE email = (?)'
    var inserts = ['uuid', 'user_name', 'email', 'password', 'role', 'users', sanitizedEmail]
    var query = mysql.format(sql, inserts)

    // Execute.
    var userDetails = await mySQLdb.executeQuery(query)

    var existingHashedPassword = userDetails[0].password

    // Verify the password.
    var isPasswordCorrect = await argon2.verify(existingHashedPassword, password)

    if (!isPasswordCorrect) {
      res.status(401)
      res.send('Invalid username or email.')
      throw new Error('Wrong password supplied.')
    }

    // The user has been logged in successfully.
    console.log(userDetails[0].uuid + ' logged in.')

    // Generate a login token for the user.
    var loginToken = await userValidation.generateLoginJWTFromEmail(sanitizedEmail)

    // Make the cookies.
    var cookieOven = [
      cookie.serialize('LoginToken', loginToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
        overwrite: true,
        path: '/',
        maxAge: ms(process.env.COOKIE_EXPIRATION_TIME) / 1000
      }),
      cookie.serialize('UserName', userDetails[0].user_name, {
        overwrite: true,
        path: '/',
        maxAge: ms(process.env.COOKIE_EXPIRATION_TIME) / 1000
      })
    ]

    // Return the cookies to the user, thus logging them in.
    res.setHeader('Set-Cookie', cookieOven)
    res.status(303)
    res.redirect(303, '/')
    return null
  } catch (err) {

  }
}

// Validate user password.
function isPasswordValid (password) {
  if (validator.isLength(password, {
    min: process.env.PASSWORD_MIN_LENGTH,
    max: process.env.PASSWORD_MAX_LENGTH
  })) {
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
