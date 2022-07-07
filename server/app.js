const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
const homeRoutes = require('./routes/home.js')

// const dbService = require('./dbService')
// const PORT = process.env.PORT
// const PORT = 1401
const logger = morgan("dev")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use(express.static(`${__dirname}/public`))

app.use(logger)
app.use('/', homeRoutes)


module.exports = app 


