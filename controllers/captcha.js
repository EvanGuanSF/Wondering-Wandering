
var request = require('request')

// Captcha secret key var from json file.
const fs = require('fs')
var rawData = fs.readFileSync('auth/recaptchaKey.json')
var jsonData = JSON.parse(rawData)
const captchaSecretKey = jsonData['secretKey']

exports.getCaptchaValidationStatus = function (params, callback) {
  // The token string.
  var captchaToken = params['g-recaptcha-response']
  var userIPAdress = params['remote-address']

  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl =
      'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey +
      '&response=' + captchaToken + '&remoteip=' + userIPAdress

  // Send verification request to Google. Response will be true/false for pass/fail respectively.
  request(verificationUrl, function (error, response, body) {
    body = JSON.parse(body)
    if (body.success !== undefined && !body.success) {
      // If the response we get is telling us that there is an error, notify the user.
      callback(new Error(error), null)
    }
    console.log('Captacha token valid!')
    var result = { valid: true }

    callback(null, result)
    // If we get past the above if statement then the token is valid and the report will post.
  })
}
