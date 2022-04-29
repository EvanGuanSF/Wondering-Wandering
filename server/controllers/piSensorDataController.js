// Add additional middleware imports.
const myMongoDB = require('../auth/MongoDBConfig.js')

// Get last 24 hours of pi sensor data.
exports.piGetTempHumDataHistory = async function (req, res) {
  const sensorDataDB = myMongoDB.db(`${process.env.MONGODB_DB_TO_USE}`)
  const sensorDataCollection = sensorDataDB.collection(`${process.env.MONGODB_DHT_HISTORY_COLLECTION}`)
  var hours = req.query.hours == null ? 24 : req.query.hours
  console.log(`${new Date()}: Getting sensor data for past ${hours} hours.`)

  const data = await sensorDataCollection.find(
    {
      timestamp: {
        // ms * s * m * h * d * w * m
        $gte:  new Date(new Date().getTime() - 1000 * 60 * 60 * hours),
        $lt: new Date(),
      }
    },
    // Exclude the _id field of matched entries.
    {projection:
      {
        _id: false
      }
    }
  ).toArray()
  
  res.status(200)
  res.send(data)
}

// Get last 5 readings from pi sensor data.
exports.piGetTempHumDataCurrent = async function (req, res) {
  const sensorDataDB = myMongoDB.db(`${process.env.MONGODB_DB_TO_USE}`)
  const sensorDataCollection = sensorDataDB.collection(`${process.env.MONGODB_DHT_CURRENT_COLLECTION}`)
  var hours = req.query.hours == null ? 24 : req.query.hours
  var recordCount = 5
  console.log(`${new Date()}: Getting latest ${recordCount} sensor readings.`)

  const data = await sensorDataCollection.find().sort({timestamp: -1}).limit(recordCount).toArray()
  
  res.status(200)
  res.send(data)
}
