import http from 'http'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import api from './api'
import config from './config.json'
import tests from './lib/tests'

const app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))
app.use(bodyParser.json({
  limit: config.bodyLimit
}))

app.use('/download/:file', function (req, res) {
  res.download(`${__dirname}/data/${req.params.file}`) // Set disposition and send it.
})

// api router
app.use('/api', api())
app.server.listen(process.env.PORT || config.port, () => {
  console.log(`Started on port ${app.server.address().port}`)
  // tests
  tests()
})
