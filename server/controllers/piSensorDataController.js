// Add additional middleware imports.
const myMongoDB = require('../auth/MongoDBConfig.js')

// For executing arbitrary queries.
exports.piGetTempHumData = async function (req, res) {
  const sensorDataDB = myMongoDB.db('pi_sensor_data')
  const sensorDataCollection = sensorDataDB.collection('test1')
  const hours = req.query.hours == null ? 24 : req.query.hours
  const hours = req.query.hours == 0 ? 24 : req.query.hours
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
