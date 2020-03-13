// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')
const cookie = require('cookie')
const ms = require('ms')

// Our controllers/endpoints.
const dbQuery = require('./dbQuery.js')
const captcha = require('../controllers/captchaController.js')
const userValidation = require('../controllers/userVerificationUtilities.js')
// State of the art password hashing algorithm.
const argon2 = require('argon2')

exports.userRegistration = function (req, res) {
  // Check the request to see if there is a json web token there and if it is, try to decode it.

  // Execute the async function to create a new user.
  if (process.env.ENV === 'dev') {
    createUserDev(req, res)
  } else if (process.env.ENV === 'production') {
    createUser(req, res)
  } else {
    console.log('NO ENV VARIABLE SET IN .ENV (dev, production)')
    return null
  }
}

/**
 * Uses the form data submitted to attempt to register a new user.
 * @param {*} req
 * @param {*} res
 */
function createUser (req, res) {
  console.log(req.body)

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
      // If the captcha is valid, continue to the main registration loop.
      mainRegistrationLoop(req, res)
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
 * Uses the form data submitted to attempt to register a new user.
 * @param {*} req
 * @param {*} res
 */
function createUserDev (req, res) {
  mainRegistrationLoop(req, res)
}

async function mainRegistrationLoop (req, res) {
  console.log(req.body)
  var userName = req.body.userName.trim()
  var email = req.body.email.trim()
  var password = req.body.password.trim()
  var passwordConfirmation = req.body.passwordConfirmation.trim()

  if (!isUserNameValid(userName)) {
    res.status(409)
    res.send('Invalid user name.')
    throw new Error('User name is malformed.')
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

  try {
    var existingEmailCheckResult = await userValidation.checkUserEmailExists(email)
    // if the result is > 0, then the email already exists.
    if (existingEmailCheckResult.emailMatches !== 0) {
      res.status(409)
      res.send(existingEmailCheckResult.message)
      throw new Error(existingEmailCheckResult.message)
    }

    var passwordHash = await argon2.hash(password, {
      type: argon2.argon2id
    })

    // Insert the new user in to the database.
    // The new user will not have any extra privileges until their role is changed by a database admin.
    // Build the query.
    var sql = 'INSERT INTO ?? (uuid, ??, ??, ??, ??) VALUES (UUID(), ?, ?, ?, ?)'
    var inserts = ['users', 'user_name', 'email', 'password', 'role', userName, email, passwordHash, 1]
    var query = mysql.format(sql, inserts)

    try {
      console.log(await dbQuery.executeQuery(query))
    } catch (err) {
      console.log('Error with creating new user in DB: ', err)
      res.status(500)
      res.send('Internal server error. Please try again later.')
      return null
    }

    // The user has been created successfully, so redirect them to the login page.
    // Generate a login token for the user.
    var loginToken = await userValidation.generateLoginJWTFromEmail(email)

    // Make the cookies.
    var cookieOven = [
      cookie.serialize('LoginToken', loginToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
        maxAge: ms(process.env.COOKIE_EXPIRATION_TIME) / 1000
      }),
      cookie.serialize('UserName', userName, {
        maxAge: ms(process.env.COOKIE_EXPIRATION_TIME) / 1000
      })
    ]

    // Return the cookies to the user, thus logging them in.
    res.setHeader('Set-Cookie', cookieOven)
    res.json({
      success: true,
      status: 303,
      redirect: '/'
    })
    return null
  } catch (err) {
    // Something went wrong somewhere along the way.
    if (err !== null) {
      console.log(err)
    } else {
      console.log('Error with something.')
    }
    return null
  }
}

// Validate new user's user name.
function isUserNameValid (userName) {
  if (validator.isLength(userName, {
    min: process.env.USER_NAME_MIN_LENGTH,
    max: process.env.USER_NAME_MAX_LENGTH
  })) {
    return true
  } else {
    return false
  }
}

// Validate new user's password.
function isPasswordValid (password) {
  console.log(process.env.PASSWORD_MIN_LENGTH)
  console.log(process.env.PASSWORD_MAX_LENGTH)
  if (validator.isLength(password, {
    min: process.env.PASSWORD_MIN_LENGTH,
    max: process.env.PASSWORD_MAX_LENGTH
  })) {
    return true
  } else {
    return false
  }
}

// Validate new user's passwords match.
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
