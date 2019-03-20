import { keys } from './config/init.js'
import { routes } from './routes/routes'
let cors = require('cors')
let express = require('express')
let app = express()
let morgan = require('morgan')

app.use(cors())
app.use(morgan('dev'))
routes(app)

keys.generateServerKeys()
console.log('Keys generated!')

app.listen(4000, 'localhost', () => {
  console.log(`App listening at localhost:4000`)
})