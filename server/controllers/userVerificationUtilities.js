// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const ms = require('ms')
const cookie = require('cookie')

// Our controllers/endpoints.
const mySQLdb = require('./queryMySQL.js')

/**
 * Determines if the given email exists in the database, along with possible error messages.
 */
exports.checkUserEmailExists = function (email) {
  return new Promise(resolve => {
    console.log('Executing user email check.')
    var sanitizedEmail = validator.normalizeEmail(email.trim())

    // Verify that the email and password are of correct type and above minimum length.
    if (!isEmailValid(sanitizedEmail)) {
      // The email is not formatted correctly.
      resolve({
        message: 'Email is malformed.',
        emailMatches: -1
      })
    }

    // Format the query.
    var sql = 'SELECT COUNT(*) AS emailMatches FROM ?? WHERE email = (?)'
    var inserts = ['users', sanitizedEmail]
    var query = mysql.format(sql, inserts)

    // Execute.
    mySQLdb.executeQuery(query)
      .then(result => {
        // if the result is > 0, then the email already exists.
        console.log('Email matches: ' + result[0].emailMatches)
        if (result[0].emailMatches > 0) {
          // The email exists in the database.
          resolve({
            message: 'Email address is already in use',
            emailMatches: 1
          })
        } else {
          // The email is not in the database.
          resolve({
            message: 'Invalid email or password.',
            emailMatches: 0
          })
        }
      })
  })
}

exports.generateLoginJWTFromEmail = function (email) {
  return new Promise((resolve, reject) => {
    // Get the password hash associated with the email given.
    var sanitizedEmail = validator.normalizeEmail(email.trim())
    var sql = 'SELECT ??, ??, ?? FROM ?? WHERE email = (?)'
    var inserts = ['uuid', 'user_name', 'email', 'users', sanitizedEmail]
    var query = mysql.format(sql, inserts)

    // Execute.
    return mySQLdb.executeQuery(query)
      .then(result => {
        const jwtTokenData = {
          uuid: result[0].uuid
        }

        var token = jwt.sign({ jwtTokenData }, process.env.JSON_WEB_TOKEN_SECRET_KEY, { expiresIn: '24h' })

        resolve(token)
      })
      .catch(error => {
        reject(error)
      })
  })
}

exports.generateLoginJWTFromUUID = function (uuid) {
  return new Promise((resolve, reject) => {
    const jwtTokenData = {
      uuid: uuid
    }

    var token = jwt.sign({ jwtTokenData }, process.env.JSON_WEB_TOKEN_SECRET_KEY, { expiresIn: '24h' })

    if (token) {
      resolve(token)
    } else {
      reject(new Error('JWT token signing failed.'))
    }
  })
}

exports.getUserRoleFromUUID = function (uuid) {
  return new Promise((resolve, reject) => {
    // Get the password hash associated with the email given.
    var sql = 'SELECT ?? FROM ?? WHERE uuid = (?)'
    var inserts = ['role', 'users', uuid]
    var query = mysql.format(sql, inserts)

    // Execute.
    return mySQLdb.executeQuery(query)
      .then(result => {
        resolve(result[0].role)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// Validate email address.
function isEmailValid (email) {
  if (validator.isEmail(email, { max: 50 })) {
    return true
  } else {
    return false
  }
}

/**
 * Extracts the json web token from the incoming request's cookies and
 * refreshes their expiration time.
 */
exports.refreshLoginToken = async function (req, res, next) {
  var cookies = cookie.parse(req.headers.cookie || '')
  try {
    // If the requester is not logged in, then just continue to the next middleware.
    if ('LoginToken' in cookies) {
      // If the token exists, we will continue in the function and refresh the cookie.
    } else {
      // If the token doesn't exist, the if statement will have thrown an error along with
      // returning a false value.
      return next()
    }
  } catch (err) {
    console.log(err)
    return next()
  }

  // Get the login jwt cookie.
  var loginCookie = cookies.LoginToken
  var loginToken = ''

  try {
    // Decode the login jwt cookie.
    loginToken = jwt.verify(loginCookie, process.env.JSON_WEB_TOKEN_SECRET_KEY)
    var uuid = loginToken.jwtTokenData.uuid

    // Get the user information associated with the uuid given.
    var sql = 'SELECT ?? FROM ?? WHERE uuid = (?)'
    var inserts = ['user_name', 'users', uuid]
    var query = mysql.format(sql, inserts)

    // Execute.
    var userDetails = await mySQLdb.executeQuery(query)

    var refreshedToken = await exports.generateLoginJWTFromUUID(uuid)

    // Make the cookies.
    var cookieOven = [
      cookie.serialize('LoginToken', refreshedToken, {
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

    // console.log('Cookie refreshed for: ' + uuid)

    // Return the cookies to the user, thus logging them in.
    res.setHeader('Set-Cookie', cookieOven)
  } catch (err) {
    console.log(err)
    return next()
  }

  // Continue on to the next piece of middleware.
  return next()
}
