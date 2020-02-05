// Add additional middleware imports.
var request = require('request')

// Captcha secret key var from json file.
const fs = require('fs')
var rawData = fs.readFileSync('auth/credentials.json')
var jsonData = JSON.parse(rawData)
const captchaSecretKey = jsonData.reCAPTCHASecretKey

exports.getCaptchaValidationStatus = function (params) {
  return new Promise((resolve, reject) => {
    // The token string.
    var captchaToken = params['g-recaptcha-response']
    var userIPAdress = params['remote-address']

    // Build the full reCAPTCHA verification URL.
    var verificationUrl =
        'https://www.google.com/recaptcha/api/siteverify?secret=' + captchaSecretKey +
        '&response=' + captchaToken + '&remoteip=' + userIPAdress

    // Send verification request to Google. Response will be true/false for pass/fail respectively.
    request(verificationUrl, function (error, response, body) {
      body = JSON.parse(body)
      if (!body.success) {
        // If the response we get is telling us that there is an error, notify the user.
        console.log('Captacha token invalid!')
        reject(new Error(error))
        return
      }
      console.log('Captacha token valid!')
      var result = { valid: true }

      resolve(result)
      // If we get past the above if statement then the token is valid and the report will post.
    })
  })
}
