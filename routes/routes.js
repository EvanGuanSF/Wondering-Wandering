
// Define Express and make a router.
const express = require('express')
const router = express.Router()
module.exports = router

// Add additional middleware imports.
const https = require('https')

// Our endpoints.
const index = require('../controllers/index.js')


/**
 * This endpoint returns a JSON list of image paths
 *
 * @param none
 * @return {JSON} {imagePath}
 */
router.get('/getCardInfo', (req, res) => {
  index.getCardInfo()
    .then(function (result) {
      console.log('returning result: ', result)
      res.status(200)
      res.send(result)
    })
    .catch(function(err) {
      console.log(err)
      res.status(404)
      res.send('failed.')
    })
})
