
const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

// create the connection
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

dotenv.config()

const user=require('./router/user')

app.use('/user',user)

app.listen(3090, () => {
  console.log('server running on 3090 port')
})