const https = require('https')
const ErrorResponse = require('./errorResponse')
const constants = require('./constants.js')

async function getMediaId({
    keyword
}) {

    // Default keyword in case no keyword was provided
    if (!keyword) keyword = process.env.DEFAULT_KEYWORD || 'The Good Doctor'

    const encodedKeyword = encodeURI(keyword)
    const option = {
        hostname: 'www.doesthedogdie.com',
        path: `/dddsearch?q=${encodedKeyword}`,
        headers: {
            'X-API-KEY': process.env.X_API_KEY,
            'Accept': 'application/json'
        }
    }

    let responseChunk = []
    let data

    const request = https.request(option, (response) => {
        response.on('data', data => {
            responseChunk.push(data)
        }).on('end', async () => {
            data = JSON.parse(Buffer.concat(responseChunk).toString())
        })

        response.on('error', error => {
            return new Promise((_, reject) => {
                reject(error)
            })
        })
    })

    request.on('error', error => {
        return new Promise((_, reject) => {
            reject(error)
        })
    })

    request.end()

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!data) {
                return reject(ErrorResponse(null, constants.statusCodes.SERVICEUNAVAILABLE, constants.errorCodes.E0001, 'API failed to provide data on time'))
            }
            const relevantInfo = {
                ...data['items'][0]
            }
            resolve(relevantInfo)
        }, 2500)
    })
}

module.exports = getMediaId