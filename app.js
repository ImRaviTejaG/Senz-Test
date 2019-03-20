import { keys } from './config/init.js'
let cors = require('cors')
let express = require('express')
let app = express()
let morgan = require('morgan')
let routes = require('./routes/routes')

app.use(cors())
app.use(morgan('dev'))
app.use(routes)

keys.generateServerKeys()
console.log('Keys generated!')

app.listen(4000, 'localhost', () => {
  console.log(`App listening at localhost:4000`)
})