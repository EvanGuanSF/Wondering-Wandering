// Add additional middleware imports.
const mysql = require('mysql')
const validator = require('validator')

// Our controllers/endpoints.
const dbQuery = require('./dbQuery.js')
// State of the art password hashing algorithm.
const argon2 = require('argon2')

exports.checkUserEmailExists = function (email) {
  return new Promise(resolve => {
    console.log('Executing new user email check.')
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
    dbQuery.executeQuery(query)
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

// Validate email address.
function isEmailValid (email) {
  if (validator.isEmail(email, { max: 50 })) {
    return true
  } else {
    return false
  }
}
