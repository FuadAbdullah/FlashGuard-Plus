
const constants = require('./constants.js')

function ErrorResponse(err, status, code, message, metadata) {
    if (err) return err
    if (process.env.NODE_ENV === 'development') {
        const error = new Error()
        error.status = status || constants.statusCodes.SERVERERROR
        error.code = code || constants.errorCodes.E9999
        error.message = message || 'This error was not documented and cannot be traced. Please open a GitHub issue to troubleshoot the nature of this error.'
        error.metadata = metadata
        return error
    } else {
        const error = new Error()
        error.status = status || constants.statusCodes.SERVERERROR
        error.metadata = metadata
        return error
    }
}

module.exports = ErrorResponse