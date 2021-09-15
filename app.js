const morgan = require('morgan')
const express = require('express')
const {
    queryParser
} = require('express-query-parser')
const cors = require('cors')
const color = require('colors')
const errorHandler = require('./middleware/errorHandler.js')
const app = express()

const doesthedogdie = require('./routes/doesthedogdie.js')

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())

app.use(
    queryParser({
        parseNull: true,
        parseBoolean: true,
    })
)

app.use(cors())

app.use('/api/v1/doesthedogdie', doesthedogdie)

app.use(errorHandler)

app.on('error', () => {
    console.error(`Error encountered: ${error}`)
})

const port = process.env.PORT || 5555

const server = app.listen(port, () => {
    console.log(`FlashGuard Plus server is running in ${process.env.NODE_ENV} mode on Port ${port}`.white.bgGreen)
})