const constants = require('../utils/constants.js')

const errorHandler = (err, req, res, next) => {

    // Log to console for dev
    if (process.env.NODE_ENV === 'development') console.log(err.stack.red)

    // General error
    // Response with a 500 Internal Server Error HTTP code
    return process.env.NODE_ENV === 'development' ? res.status(err.statusCode || err.status || constants.statusCodes.SERVERERROR).json({
        message: err.message,
        ...err
    }) : res.status(err.statusCode || err.status || constants.statusCodes.SERVERERROR).send()
}

module.exports = errorHandler