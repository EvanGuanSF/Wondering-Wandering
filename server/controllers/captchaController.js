// Add additional middleware imports.
var axios = require('axios')

exports.getCaptchaValidationStatus = function (params) {
  return new Promise((resolve, reject) => {
    // The token string.
    var captchaToken = params['g-recaptcha-response']
    var userIPAdress = params['remote-address']

    // Build the full reCAPTCHA verification URL.
    var verificationUrl =
        'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.RECAPTCHA_SECRET_KEY +
        '&response=' + captchaToken + '&remoteip=' + userIPAdress

    axios.post(
      verificationUrl,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
      }
    )
    .then ((result) => {
      var data = result.data || {};
      if(!data.success) {
        console.log('Captacha token invalid!')
        throw({
            success: false,
            error: 'response not valid'
        })
        
        reject(new Error(error))
        return
      } else {
        // Token is valid.
        console.log('Captacha token valid!')
        var retval = { valid: true }
        resolve(retval)
      }

    }, (error) => {
      console.log(error)
    })
  })
}
